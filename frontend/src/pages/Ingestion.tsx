import { useState, useEffect } from 'react';

interface Log {
    id: number;
    time: string;
    source: string;
    message: string;
    status: string;
}

export default function Ingestion() {
    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
        // In a real app, this would be a WebSocket. We're simulating by fetching once.
        fetch('http://localhost:3001/api/ingestion')
            .then(res => res.json())
            .then(data => setLogs(data));
    }, []);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">Data Ingestion Logs</h1>
            <p className="text-text-muted font-ui text-body">
                Monitor the status of your cloud billing and metrics integrations.
            </p>
            <div className="bg-surface border border-border p-8 text-text-muted font-ui h-[400px] overflow-y-auto font-mono text-micro space-y-2">
                {logs.length === 0 ? (
                    <div>Connecting to log stream...</div>
                ) : (
                    logs.map(log => (
                        <div key={log.id} className="flex gap-4 hover:bg-bg-primary p-1 transition-colors">
                            <span className="opacity-50">[{log.time}]</span>
                            <span className="font-bold w-16 text-text-secondary">[{log.source}]</span>
                            <span className={log.status === 'warning' ? 'text-accent-red' : ''}>
                                {log.message}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
