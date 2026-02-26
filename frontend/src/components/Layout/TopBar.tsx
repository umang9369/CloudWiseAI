import { useLocation } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

export default function TopBar() {
    const { pathname } = useLocation();
    const title = pathname.split('/').pop()?.toUpperCase() || 'OVERVIEW';

    return (
        <div className="h-[52px] bg-bg-primary border-b border-border flex items-center justify-between px-8 absolute top-0 right-0 left-[220px] z-10">
            <div className="flex items-center gap-4 text-micro font-ui uppercase tracking-widest text-text-secondary">
                <span>DASHBOARD</span>
                <span className="text-border">/</span>
                <span className="text-white-glyph">{title}</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-micro font-ui text-text-muted">
                    LAST SYNC: {new Date().toLocaleTimeString()}
                </div>
                <button className="flex items-center gap-2 text-micro font-ui uppercase tracking-widest text-text-primary border border-border px-3 py-1.5 hover:border-accent-red transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    REFRESH DATA
                </button>
            </div>
        </div>
    );
}
