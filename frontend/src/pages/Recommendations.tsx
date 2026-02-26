import { useEffect, useState } from 'react';
import { MetricCard } from '../components/ui/MetricCard';

interface Recommendation {
    id: string;
    title: string;
    description: string;
    potentialSavings: string;
    difficulty: string;
    status: string;
}

export default function Recommendations() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRecommendations = () => {
        fetch('http://localhost:3001/api/recommendations')
            .then(res => res.json())
            .then(data => {
                setRecommendations(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const processApply = (id: string) => {
        fetch(`http://localhost:3001/api/recommendations/${id}/apply`, { method: 'POST' })
            .then(res => res.json())
            .then(() => {
                fetchRecommendations(); // Refresh list to show applied state
            });
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">AI Recommendations</h1>
            <p className="text-text-muted font-ui text-body">
                Review automated optimizations suggested by the CloudWise AI agent.
            </p>
            <div className="grid grid-cols-3 gap-5 mb-8">
                <MetricCard label="TOTAL SAVINGS OPPORTUNITY" value="$12,450" isRed={false} />
                <MetricCard label="EASY WINS" value="5" subtext="Can be applied automatically" />
                <MetricCard label="COMPLEX OPTIMIZATIONS" value="2" subtext="Requires engineering review" />
            </div>

            {loading ? (
                <div className="bg-surface border border-border p-8 py-20 flex items-center justify-center text-text-muted font-ui animate-pulse">
                    Analyzing infrastructure...
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-5">
                    {recommendations.map(rec => (
                        <div key={rec.id} className="bg-surface border border-border p-6 flex flex-col justify-between hover:border-text-primary transition-colors h-full group">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-body font-bold text-text-primary uppercase group-hover:text-accent-green transition-colors">{rec.title}</h3>
                                    <span className={`text-micro font-bold px-2 py-1 ${rec.difficulty === 'Easy' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                                        {rec.difficulty.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-micro text-text-muted mb-6">{rec.description}</p>
                            </div>

                            <div className="flex justify-between items-center border-t border-border pt-4">
                                <div className="flex flex-col">
                                    <span className="text-micro text-text-muted">POTENTIAL SAVINGS</span>
                                    <span className="text-body font-bold text-accent-green">{rec.potentialSavings}</span>
                                </div>

                                {rec.status === 'PENDING' ? (
                                    <button
                                        onClick={() => processApply(rec.id)}
                                        className="bg-bg-primary border border-border hover:border-accent-green hover:text-accent-green px-6 py-2 text-micro font-bold transition-colors cursor-pointer"
                                    >
                                        APPLY FIX
                                    </button>
                                ) : (
                                    <div className="text-micro font-bold text-text-muted px-4 py-2 border border-border/50">
                                        APPLIED
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
