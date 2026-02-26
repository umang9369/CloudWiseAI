import { MetricCard } from '../components/ui/MetricCard';

export default function Recommendations() {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">AI Recommendations</h1>
            <p className="text-text-muted font-ui text-body">
                Review automated optimizations suggested by the CloudWise AI agent.
            </p>
            <div className="grid grid-cols-3 gap-5">
                <MetricCard label="TOTAL SAVINGS OPPORTUNITY" value="$12,450" isRed={false} />
                <MetricCard label="EASY WINS" value="5" subtext="Can be applied automatically" />
                <MetricCard label="COMPLEX OPTIMIZATIONS" value="2" subtext="Requires engineering review" />
            </div>
            <div className="bg-surface border border-border p-8 rounded flex items-center justify-center text-text-muted font-ui h-[200px]">
                Pending analysis...
            </div>
        </div>
    );
}
