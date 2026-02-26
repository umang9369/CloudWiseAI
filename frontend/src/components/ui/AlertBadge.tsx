export type BadgeSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS' | 'AI';

interface AlertBadgeProps {
    severity: BadgeSeverity;
    label?: string;
}

export function AlertBadge({ severity, label }: AlertBadgeProps) {
    const styles = {
        CRITICAL: 'bg-[#7a1f18] text-white-glyph border border-transparent',
        WARNING: 'bg-[#6b2f00] text-white-glyph border border-transparent',
        INFO: 'bg-[#1a1e1e] text-text-secondary border border-transparent',
        SUCCESS: 'bg-[#1a2b1a] text-[#3a9a3a] border border-transparent',
        AI: 'bg-border text-text-secondary border border-text-muted',
    };

    return (
        <span className={`inline-flex items-center px-[8px] py-[3px] text-label font-bold tracking-[0.15em] ${styles[severity]}`}>
            {label || severity}
        </span>
    );
}
