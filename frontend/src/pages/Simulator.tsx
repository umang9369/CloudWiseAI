import { useState } from 'react';
import { MetricCard } from '../components/ui/MetricCard';

interface SimulationResult {
    currentCost: number;
    projectedCost: number;
    savings: number;
    message: string;
}

export default function Simulator() {
    const [instances, setInstances] = useState<number>(10);
    const [tierType, setTierType] = useState<'compute' | 'memory'>('compute');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SimulationResult | null>(null);

    const runSimulation = () => {
        setLoading(true);
        fetch('http://localhost:3001/api/simulator/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ instances, type: tierType })
        })
            .then(res => res.json())
            .then(data => {
                setResult(data);
                setLoading(false);
            });
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">What-If Simulator</h1>
            <p className="text-text-muted font-ui text-body">
                Model potential infrastructure changes to forecast impact on your cloud bill.
            </p>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 bg-surface border border-border p-6 space-y-6">
                    <h3 className="text-body font-bold text-text-primary uppercase border-b border-border pb-2">Simulation Parameters</h3>

                    <div className="space-y-4 font-ui">
                        <div>
                            <label className="block text-micro text-text-muted mb-2">NUMBER OF INSTANCES</label>
                            <input
                                type="number"
                                value={instances}
                                onChange={(e) => setInstances(Number(e.target.value))}
                                className="w-full bg-bg-primary border border-border p-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-micro text-text-muted mb-2">TARGET ARCHITECTURE MIGRATION</label>
                            <select
                                value={tierType}
                                onChange={(e) => setTierType(e.target.value as 'compute' | 'memory')}
                                className="w-full bg-bg-primary border border-border p-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors appearance-none"
                            >
                                <option value="compute">Graviton (ARM) Compute</option>
                                <option value="memory">Memory Optimized (R5 to R6g)</option>
                            </select>
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={loading}
                            className="w-full bg-accent-red hover:bg-red-600 text-white font-bold py-3 uppercase tracking-widest transition-colors mt-4 disabled:opacity-50"
                        >
                            {loading ? 'SIMULATING...' : 'RUN SIMULATION'}
                        </button>
                    </div>
                </div>

                <div className="col-span-8">
                    {result ? (
                        <div className="space-y-6">
                            <div className="bg-accent-green/10 border border-accent-green p-4 text-accent-green font-ui font-bold">
                                {result.message}
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <MetricCard label="CURRENT MONTHLY RUN RATE" value={`$${result.currentCost.toLocaleString()}`} />
                                <MetricCard label="PROJECTED MONTHLY RUN RATE" value={`$${result.projectedCost.toLocaleString()}`} />
                                <div className="col-span-2">
                                    <MetricCard label="PROJECTED MONTHLY SAVINGS" value={`$${result.savings.toLocaleString()}`} isRed={false} trend="down" trendValue="Impact Model" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface border border-border p-8 h-[400px] flex items-center justify-center text-text-muted font-ui border-dashed">
                            <div>Select infrastructure parameters to begin simulation.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
