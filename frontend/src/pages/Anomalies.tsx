import { useEffect, useState } from 'react';
import { AlertBadge } from '../components/ui/AlertBadge';

interface Anomaly {
    id: string;
    service: string;
    resource: string;
    detected: string;
    spike: string;
    baseline: string;
    current: string;
    status: string;
    explanation: string;
    severity: string;
}

export default function Anomalies() {
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAnomalies = () => {
        fetch('http://localhost:3001/api/anomalies')
            .then(res => res.json())
            .then(data => {
                setAnomalies(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAnomalies();
    }, []);

    const processAcknowledge = (id: string) => {
        fetch(`http://localhost:3001/api/anomalies/${id}/acknowledge`, { method: 'POST' })
            .then(res => res.json())
            .then(() => {
                fetchAnomalies(); // Refresh the list
            });
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">Anomaly Detection</h1>
            <p className="text-text-muted font-ui text-body">
                Monitor and investigate unusual cost spikes across your connected cloud accounts.
            </p>

            {loading ? (
                <div className="bg-surface border border-border p-8 py-20 flex items-center justify-center text-text-muted font-ui animate-pulse">
                    Loading anomalies...
                </div>
            ) : (
                <div className="space-y-4">
                    {anomalies.map(anomaly => (
                        <div key={anomaly.id} className="bg-surface border border-border p-6 font-ui space-y-4 hover:border-text-primary transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-body font-bold text-text-primary">{anomaly.resource}</h3>
                                        <AlertBadge severity={anomaly.severity as 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS'} label={anomaly.service} />
                                    </div>
                                    <p className="text-micro text-text-muted mb-4">{anomaly.explanation}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-h3 font-bold text-accent-red">{anomaly.spike}</div>
                                    <div className="text-micro text-text-muted">Detected {anomaly.detected}</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-border pt-4">
                                <div className="flex gap-8 text-micro">
                                    <div><span className="text-text-muted mr-2">Baseline</span> {anomaly.baseline}</div>
                                    <div><span className="text-text-muted mr-2">Current</span> {anomaly.current}</div>
                                    <div><span className="text-text-muted mr-2">Status</span> <span className={anomaly.status === 'OPEN' ? 'text-accent-red font-bold' : 'text-text-muted'}>{anomaly.status}</span></div>
                                </div>

                                {anomaly.status === 'OPEN' && (
                                    <button
                                        onClick={() => processAcknowledge(anomaly.id)}
                                        className="bg-accent-red/10 text-accent-red hover:bg-accent-red hover:text-white px-4 py-2 text-micro font-bold transition-colors cursor-pointer"
                                    >
                                        ACKNOWLEDGE
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
