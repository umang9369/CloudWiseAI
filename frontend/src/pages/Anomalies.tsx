import { AlertBadge } from '../components/ui/AlertBadge';

export default function Anomalies() {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">Anomaly Detection</h1>
            <p className="text-text-muted font-ui text-body">
                Monitor and investigate unusual cost spikes across your connected cloud accounts.
            </p>
            <div className="bg-surface border border-border p-8 h-[400px] flex items-center justify-center text-text-muted font-ui">
                <div className="flex flex-col items-center gap-4">
                    <AlertBadge severity="CRITICAL" label="SYSTEM DETECTED" />
                    <p>No new anomalies detected in the last 24 hours.</p>
                </div>
            </div>
        </div>
    );
}
