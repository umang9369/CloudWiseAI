import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
    id: number;
    role: 'ai' | 'user';
    text: string;
    time: string;
}

export default function Query() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/query/history')
            .then(res => res.json())
            .then(data => {
                setMessages(data);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input;
        setInput('');

        // Optimistically add user message
        const userMsg: ChatMessage = { id: Date.now(), role: 'user', text: userText, time: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        fetch('http://localhost:3001/api/query/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: userText })
        })
            .then(res => res.json())
            .then(data => {
                setMessages(prev => [...prev, data.message]);
                setLoading(false);
            });
    };

    return (
        <div className="p-8 space-y-6 h-full flex flex-col">
            <h1 className="text-h2 font-display uppercase">Natural Language Query</h1>
            <p className="text-text-muted font-ui text-body">
                Ask questions about your cloud spend and infrastructure in plain English.
            </p>
            <div className="flex-1 bg-surface border border-border flex flex-col min-h-[500px]">
                <div className="flex-1 p-8 overflow-y-auto space-y-6">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className="text-micro text-text-muted mb-1 uppercase tracking-widest">{msg.role === 'user' ? 'You' : 'CloudWise AI'}</div>
                            <div className={`p-4 font-ui max-w-[80%] ${msg.role === 'user' ? 'bg-bg-primary border border-border text-text-primary' : 'bg-accent-red/10 border border-accent-red text-text-primary'}`}>
                                {msg.text}
                            </div>
                            <div className="text-[10px] text-text-muted mt-1">{new Date(msg.time).toLocaleTimeString()}</div>
                        </div>
                    ))}
                    {loading && messages.length > 0 && (
                        <div className="flex flex-col items-start animate-pulse">
                            <div className="text-micro text-text-muted mb-1 uppercase tracking-widest">CloudWise AI</div>
                            <div className="p-4 font-ui bg-accent-red/10 border border-accent-red text-text-primary">
                                Analyzing request...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-border bg-bg-primary">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., Why did my AWS cost spike yesterday?"
                            className="w-full bg-surface border border-border p-4 pr-24 text-text-primary focus:outline-none focus:border-text-primary transition-colors disabled:opacity-50"
                            disabled={loading && messages.length === 0}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-2 top-2 bottom-2 bg-accent-red hover:bg-red-600 text-white font-bold px-6 uppercase tracking-widest transition-colors disabled:opacity-50"
                        >
                            Ask
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
