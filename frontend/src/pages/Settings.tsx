import { useState, useEffect } from 'react';

interface Provider {
    id: string;
    name: string;
    status: string;
}

interface SettingsData {
    providers: Provider[];
    notifications: Record<string, boolean>;
}

export default function Settings() {
    const [settings, setSettings] = useState<SettingsData | null>(null);

    const fetchSettings = () => {
        fetch('http://localhost:3001/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data));
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const toggleProvider = (providerId: string) => {
        fetch('http://localhost:3001/api/settings/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ providerId })
        })
            .then(res => res.json())
            .then(() => fetchSettings());
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">Integrations & Settings</h1>
            <p className="text-text-muted font-ui text-body">
                Configure cloud provider accounts, API keys, and notification preferences.
            </p>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-surface border border-border p-6 space-y-4 font-ui">
                    <h3 className="text-body font-bold tracking-widest border-b border-border pb-2 uppercase text-text-primary">CLOUD PROVIDERS</h3>

                    {!settings ? (
                        <div className="animate-pulse text-text-muted text-micro">Loading providers...</div>
                    ) : (
                        settings.providers.map(provider => (
                            <div key={provider.id} className="flex justify-between items-center group">
                                <span className="text-text-primary group-hover:text-accent-red transition-colors">{provider.name}</span>
                                <button
                                    onClick={() => toggleProvider(provider.id)}
                                    className={`text-micro font-bold px-3 py-1 border transition-colors ${provider.status === 'CONNECTED'
                                        ? 'border-accent-green text-accent-green hover:bg-accent-green/10'
                                        : 'border-border text-text-muted hover:border-text-primary hover:text-text-primary'
                                        }`}
                                >
                                    {provider.status}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
