export default function Settings() {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">Integrations & Settings</h1>
            <p className="text-text-muted font-ui text-body">
                Configure cloud provider accounts, API keys, and notification preferences.
            </p>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-surface border border-border p-6 space-y-4">
                    <h3 className="text-body font-bold tracking-widest border-b border-border pb-2">CLOUD PROVIDERS</h3>
                    <div className="flex justify-between items-center">
                        <span>Amazon Web Services</span>
                        <span className="text-accent-green text-micro">CONNECTED</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Microsoft Azure</span>
                        <span className="text-accent-green text-micro">CONNECTED</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Google Cloud Platform</span>
                        <span className="text-text-muted text-micro">CONFIGURE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
