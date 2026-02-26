export default function Ingestion() {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">Data Ingestion Logs</h1>
            <p className="text-text-muted font-ui text-body">
                Monitor the status of your cloud billing and metrics integrations.
            </p>
            <div className="bg-surface border border-border p-8 text-text-muted font-ui h-[300px] overflow-y-auto font-mono text-micro space-y-2">
                <div>[06:00:12 AM] [AWS] Cost and Usage Report fully ingested. (23.1mb)</div>
                <div>[05:45:00 AM] [GCP] Billing Export sync completed successfully.</div>
                <div>[05:30:45 AM] [Azure] Cost Management API sync completed successfully.</div>
            </div>
        </div>
    );
}
