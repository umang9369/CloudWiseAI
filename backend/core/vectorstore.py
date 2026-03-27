import os
import chromadb
from chromadb.config import Settings
from dotenv import load_dotenv

load_dotenv()

CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")

# Global ChromaDB client
_chroma_client = None
_collection = None


def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        os.makedirs(CHROMA_PERSIST_DIR, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    return _chroma_client


def get_collection():
    global _collection
    if _collection is None:
        client = get_chroma_client()
        _collection = client.get_or_create_collection(
            name="cloud_cost_data",
            metadata={"hnsw:space": "cosine"}
        )
    return _collection


def ingest_documents(documents: list[dict]):
    """
    Ingest cloud cost documents into ChromaDB.
    Each doc: {"id": str, "text": str, "metadata": dict}
    """
    collection = get_collection()
    if not documents:
        return

    ids = [doc["id"] for doc in documents]
    texts = [doc["text"] for doc in documents]
    metadatas = [doc.get("metadata", {}) for doc in documents]

    # Check for existing IDs to avoid duplicates
    existing = collection.get(ids=ids)
    existing_ids = set(existing["ids"])
    
    new_docs = [(d, t, m) for d, t, m in zip(ids, texts, metadatas) if d not in existing_ids]
    if not new_docs:
        return

    new_ids, new_texts, new_metas = zip(*new_docs)
    collection.add(
        ids=list(new_ids),
        documents=list(new_texts),
        metadatas=list(new_metas)
    )
    print(f"[CHROMA] Ingested {len(new_ids)} documents into vector store")


def query_vectorstore(query_text: str, n_results: int = 5) -> list[str]:
    """Query ChromaDB and return relevant document texts."""
    collection = get_collection()
    count = collection.count()
    if count == 0:
        return []

    results = collection.query(
        query_texts=[query_text],
        n_results=min(n_results, count)
    )
    docs = results.get("documents", [[]])[0]
    return docs
