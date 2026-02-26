export default function Query() {
    return (
        <div className="p-8 space-y-6 h-full flex flex-col">
            <h1 className="text-h2 font-display uppercase">Natural Language Query</h1>
            <p className="text-text-muted font-ui text-body">
                Ask questions about your cloud spend and infrastructure in plain English.
            </p>
            <div className="flex-1 bg-surface border border-border flex flex-col">
                <div className="flex-1 p-8 overflow-y-auto space-y-4">
                    <div className="bg-bg-primary p-4 rounded-md text-text-muted inline-block border border-border">
                        How can I help you analyze your cloud costs today?
                    </div>
                </div>
                <div className="p-4 border-t border-border bg-bg-primary">
                    <input
                        type="text"
                        placeholder="e.g., Why did my AWS cost spike yesterday?"
                        className="w-full bg-surface border border-border p-4 text-text-primary focus:outline-none focus:border-text-primary transition-colors"
                        disabled
                    />
                </div>
            </div>
        </div>
    );
}
