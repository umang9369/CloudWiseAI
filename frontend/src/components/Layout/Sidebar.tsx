import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Lightbulb, ActivitySquare, TerminalSquare, FileText, Database, Settings } from 'lucide-react';

const NAV_ITEMS = [
    { id: 'overview', label: 'OVERVIEW', path: '/app/overview', icon: LayoutDashboard },
    { id: 'anomalies', label: 'ANOMALIES', path: '/app/anomalies', icon: AlertTriangle },
    { id: 'recommendations', label: 'RECOMMENDATIONS', path: '/app/recommendations', icon: Lightbulb },
    { id: 'simulator', label: 'SIMULATOR', path: '/app/simulator', icon: ActivitySquare },
    { id: 'query', label: 'QUERY', path: '/app/query', icon: TerminalSquare },
    { id: 'reports', label: 'REPORTS', path: '/app/reports', icon: FileText },
    { id: 'ingestion', label: 'INGESTION', path: '/app/ingestion', icon: Database },
    { id: 'settings', label: 'SETTINGS', path: '/app/settings', icon: Settings },
];

export default function Sidebar() {
    return (
        <div className="fixed left-0 top-0 bottom-0 w-[220px] bg-bg-primary border-r border-border flex flex-col pt-4">
            <div className="px-6 pb-6">
                <h1 className="font-display font-bold text-white-glyph text-xl tracking-widest">CLOUDWISE//AI</h1>
            </div>

            <nav className="flex-1 flex flex-col gap-[2px]">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-3 h-[44px] px-6 text-micro font-ui uppercase tracking-[0.12em]
                transition-colors duration-200
                ${isActive
                                    ? 'border-l-2 border-accent-red text-white-glyph bg-surface'
                                    : 'border-l-2 border-transparent text-text-secondary hover:text-text-primary'
                                }
              `}
                        >
                            <Icon className="w-4 h-4" strokeWidth={1.5} />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-border mt-auto flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="text-micro font-ui text-text-secondary">AGENTS ONLINE</span>
            </div>
        </div>
    );
}
