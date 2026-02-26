import { motion } from 'framer-motion';

interface MetricCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    isRed?: boolean;
}

export function MetricCard({ label, value, subtext, trend, trendValue, isRed = false }: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-surface border border-border p-[20px_24px] hover:border-border-hover transition-colors relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white-glyph/5 to-transparent -translate-x-full group-hover:animate-[scan_1.5s_ease-in-out_infinite]" />

            <div className="text-label text-text-secondary mb-2">{label}</div>

            <div className="flex items-baseline gap-3">
                <div className={`text-[28px] font-bold ${isRed ? 'text-accent-red' : 'text-text-primary'}`}>
                    {value}
                </div>

                {trendValue && (
                    <div className={`text-micro flex items-center font-bold ${trend === 'up' ? 'text-accent-red' : trend === 'down' ? 'text-accent-green' : 'text-text-muted'}`}>
                        {trend === 'up' && '▲ '}
                        {trend === 'down' && '▼ '}
                        {trendValue}
                    </div>
                )}
            </div>

            {subtext && <div className="text-[11px] text-text-muted mt-1">{subtext}</div>}
        </motion.div>
    );
}
