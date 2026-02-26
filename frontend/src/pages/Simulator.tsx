export default function Simulator() {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">What-If Simulator</h1>
            <p className="text-text-muted font-ui text-body">
                Model potential infrastructure changes to forecast impact on your cloud bill.
            </p>
            <div className="bg-surface border border-border p-8 min-h-[400px] flex flex-col items-center justify-center text-text-muted font-ui border-dashed">
                <p>Select infrastructure parameters to begin simulation.</p>
            </div>
        </div>
    );
}
