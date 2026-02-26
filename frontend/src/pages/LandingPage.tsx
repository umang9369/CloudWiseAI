import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-mono overflow-x-hidden min-h-screen flex flex-col">
            {/* Navbar */}
            <header className="w-full border-b border-border-dark bg-background-dark/95 backdrop-blur z-50 sticky top-0">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
                        <h2 className="text-white text-lg font-bold tracking-tight">CLOUDWISE//AI</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-text-muted hover:text-white text-sm font-medium transition-colors" href="#">// SOLUTIONS</a>
                        <a className="text-text-muted hover:text-white text-sm font-medium transition-colors" href="#">// PRICING</a>
                        <a className="text-text-muted hover:text-white text-sm font-medium transition-colors" href="#">// DOCS</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="hidden sm:block text-xs text-text-muted">SYSTEM ONLINE</span>
                        <Link to="/app/overview" className="flex items-center justify-center h-9 px-5 bg-primary hover:bg-primary-dark text-white text-xs font-bold tracking-wider transition-colors border border-transparent hover:border-white/20">
                            [ ACCESS_PLATFORM ]
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col">
                {/* Hero Section */}
                <section className="relative w-full border-b border-border-dark bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    <div className="absolute inset-0 bg-background-dark/90 pointer-events-none"></div>
                    <div className="relative max-w-[1440px] mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left: Typography */}
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <div className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-widest uppercase mb-2">
                                <span className="w-2 h-2 bg-primary"></span>
                                Initializing Sequence v4.0.2
                            </div>
                            <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tighter font-display">
                                CLOUD COSTS,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-text-muted">DECODED.</span>
                            </h1>
                            <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-lg border-l-2 border-primary pl-4">
                                Production-ready agentic AI for total cloud cost optimization. Deploy autonomous agents to analyze, detect anomalies, and reduce spend without human intervention.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <Link to="/app/overview" className="group relative flex items-center justify-center h-12 px-8 bg-white text-background-dark hover:bg-gray-200 text-sm font-bold tracking-wide transition-all">
                                    <span className="mr-2">&gt;</span> DEPLOY AGENTS
                                    <div className="absolute inset-0 border border-white group-hover:translate-x-1 group-hover:translate-y-1 transition-transform pointer-events-none"></div>
                                </Link>
                                <Link to="/app/overview" className="group flex items-center justify-center h-12 px-8 bg-transparent border border-border-dark hover:border-white text-white text-sm font-bold tracking-wide transition-all">
                                    VIEW_DEMO.EXE
                                </Link>
                            </div>
                        </div>

                        {/* Right: Terminal Window */}
                        <div className="w-full relative group">
                            {/* Decor elements */}
                            <div className="absolute -top-3 -right-3 w-24 h-24 border-t-2 border-r-2 border-primary/30 z-0"></div>
                            <div className="absolute -bottom-3 -left-3 w-24 h-24 border-b-2 border-l-2 border-primary/30 z-0"></div>
                            <div className="relative z-10 bg-[#0c0a0a] border border-border-dark shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
                                {/* Terminal Header */}
                                <div className="flex items-center justify-between px-4 py-2 bg-[#1f1616] border-b border-border-dark">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-[#ff5f57]"></div>
                                        <div className="w-3 h-3 bg-[#febc2e]"></div>
                                        <div className="w-3 h-3 bg-[#28c840]"></div>
                                    </div>
                                    <div className="text-text-muted text-[10px] tracking-widest uppercase">agent_monitor_v1.sh</div>
                                    <div className="w-10"></div> {/* Spacer */}
                                </div>
                                {/* Terminal Body */}
                                <div className="p-6 h-[320px] overflow-y-auto flex flex-col gap-2 text-gray-300">
                                    <div className="flex gap-2">
                                        <span className="text-green-500">root@cloudwise:~#</span>
                                        <span className="text-white">./init_agents.sh --verbose</span>
                                    </div>
                                    <div className="pl-4 text-text-muted">
                                        <div>[INFO] Establishing secure connection to AWS/GCP/AZURE...</div>
                                        <div>[INFO] Connection established (Latency: 12ms)</div>
                                        <div>[INFO] Loading agent modules: [COST_OP], [ANOMALY_DETECTOR], [RIGHT_SIZER]</div>
                                        <div className="text-green-500">[SUCCESS] All modules loaded.</div>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <span className="text-green-500">root@cloudwise:~#</span>
                                        <span className="text-white">tail -f /var/log/activity.log</span>
                                    </div>
                                    <div className="pl-4 grid gap-1 font-mono text-xs">
                                        <div className="flex gap-3">
                                            <span className="text-blue-400">10:42:01</span>
                                            <span className="text-yellow-500">[WARN]</span>
                                            <span>Unexpected spike detected in us-east-1 (RDS instance)</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-blue-400">10:42:02</span>
                                            <span className="text-primary">[ACTION]</span>
                                            <span>Auto-scaling policy triggered. Reducing capacity by 20%.</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-blue-400">10:42:05</span>
                                            <span className="text-green-500">[SAVED]</span>
                                            <span>Estimated savings: $420.50/month</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-blue-400">10:42:15</span>
                                            <span className="text-text-muted">[SCAN]</span>
                                            <span>Scanning for idle load balancers...</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-blue-400">10:42:18</span>
                                            <span className="text-primary">[ALERT]</span>
                                            <span>3 Unused ELBs found. Marking for deletion.</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-blue-400">10:42:22</span>
                                            <span className="text-text-muted">[STATUS]</span>
                                            <span>System optimal. Efficiency rating: 98.4%</span>
                                        </div>
                                        <div className="flex gap-3 mt-2">
                                            <span className="text-green-500">root@cloudwise:~#</span>
                                            <span className="animate-blink bg-white w-2 h-4 block"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="border-b border-border-dark bg-surface-dark">
                    <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border-dark">
                        <div className="p-6 md:p-8 flex flex-col gap-1 items-start group hover:bg-[#2a2221] transition-colors">
                            <div className="text-text-muted text-xs font-bold tracking-wider uppercase mb-1">Resources Analyzed</div>
                            <div className="text-white text-3xl font-display font-bold">2.4M<span className="text-primary">+</span></div>
                            <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 mt-2"></div>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col gap-1 items-start group hover:bg-[#2a2221] transition-colors">
                            <div className="text-text-muted text-xs font-bold tracking-wider uppercase mb-1">Avg Savings</div>
                            <div className="text-white text-3xl font-display font-bold">38<span className="text-primary">%</span></div>
                            <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 mt-2"></div>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col gap-1 items-start group hover:bg-[#2a2221] transition-colors">
                            <div className="text-text-muted text-xs font-bold tracking-wider uppercase mb-1">Anomalies Caught</div>
                            <div className="text-white text-3xl font-display font-bold">14,203</div>
                            <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 mt-2"></div>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col gap-1 items-start group hover:bg-[#2a2221] transition-colors">
                            <div className="text-text-muted text-xs font-bold tracking-wider uppercase mb-1">Active Agents</div>
                            <div className="text-white text-3xl font-display font-bold">850<span className="text-primary">+</span></div>
                            <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 mt-2"></div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="max-w-[1440px] mx-auto px-6 py-20 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-border-dark pb-6">
                        <div className="flex flex-col gap-2">
                            <div className="text-primary font-mono text-xs tracking-widest uppercase">// CAPABILITIES</div>
                            <h2 className="text-white text-3xl md:text-4xl font-bold font-display uppercase max-w-xl">
                                Autonomous Infrastructure Protection
                            </h2>
                        </div>
                        <p className="text-text-muted text-sm max-w-sm text-right md:text-left">
                            Our industrial-grade autonomous agents operate 24/7 to secure your infrastructure efficiency.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border-dark border border-border-dark">
                        {/* Feature 1 */}
                        <div className="bg-background-dark p-8 flex flex-col gap-6 hover:bg-surface-dark transition-colors group">
                            <div className="w-12 h-12 bg-surface-dark border border-border-dark flex items-center justify-center text-white group-hover:border-primary group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">memory</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-white font-bold text-lg uppercase tracking-tight">Autonomous Optimization</h3>
                                <p className="text-text-muted text-sm leading-relaxed">
                                    Agents automatically right-size instances and remove waste without human intervention.
                                </p>
                            </div>
                            <a className="mt-auto pt-4 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-primary transition-colors" href="#">
                                Read_More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-background-dark p-8 flex flex-col gap-6 hover:bg-surface-dark transition-colors group">
                            <div className="w-12 h-12 bg-surface-dark border border-border-dark flex items-center justify-center text-white group-hover:border-primary group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-white font-bold text-lg uppercase tracking-tight">Real-Time Anomaly Detection</h3>
                                <p className="text-text-muted text-sm leading-relaxed">
                                    Detect cost spikes instantly with machine learning models trained on millions of data points.
                                </p>
                            </div>
                            <a className="mt-auto pt-4 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-primary transition-colors" href="#">
                                Read_More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-background-dark p-8 flex flex-col gap-6 hover:bg-surface-dark transition-colors group">
                            <div className="w-12 h-12 bg-surface-dark border border-border-dark flex items-center justify-center text-white group-hover:border-primary group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">public</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-white font-bold text-lg uppercase tracking-tight">Multi-Cloud Command</h3>
                                <p className="text-text-muted text-sm leading-relaxed">
                                    Unified control plane for AWS, Azure, and GCP environments in a single terminal view.
                                </p>
                            </div>
                            <a className="mt-auto pt-4 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-primary transition-colors" href="#">
                                Read_More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Data Visualization Abstract Section */}
                <section className="w-full py-16 bg-surface-dark border-y border-border-dark relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#bf3a2b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 relative">
                                {/* Abstract Data Viz */}
                                <div className="w-full aspect-video bg-background-dark border border-border-dark p-1 relative" data-alt="Abstract line chart showing cost reduction over time on a dark grid background">
                                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 divide-x divide-y divide-border-dark/30 opacity-50"></div>
                                    {/* Fake Graph Lines */}
                                    <svg className="absolute inset-0 w-full h-full text-primary" preserveAspectRatio="none">
                                        <polyline fill="none" points="0,200 50,180 100,190 150,140 200,150 250,100 300,80 350,90 400,40 500,20" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"></polyline>
                                        <defs>
                                            <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: 'rgb(191, 58, 43)', stopOpacity: 0.2 }}></stop>
                                                <stop offset="100%" style={{ stopColor: 'rgb(191, 58, 43)', stopOpacity: 0 }}></stop>
                                            </linearGradient>
                                        </defs>
                                        <polygon fill="url(#grad1)" points="0,200 50,180 100,190 150,140 200,150 250,100 300,80 350,90 400,40 500,20 500,300 0,300"></polygon>
                                    </svg>
                                    {/* Floating badges on graph */}
                                    <div className="absolute top-[20%] right-[10%] bg-background-dark border border-primary px-3 py-1 text-[10px] text-primary">
                                        OPTIMIZED
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 flex flex-col gap-6">
                                <div className="text-primary font-mono text-xs tracking-widest uppercase">// REPORTING</div>
                                <h2 className="text-white text-3xl md:text-4xl font-bold font-display uppercase">
                                    Visualise Spend.<br />Eliminate Waste.
                                </h2>
                                <ul className="space-y-4 font-mono text-sm text-text-muted">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 material-symbols-outlined text-sm">check_box_outline_blank</span>
                                        <span>Granular per-second billing analysis across all zones.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 material-symbols-outlined text-sm">check_box_outline_blank</span>
                                        <span>Forecast future spend with 99.8% accuracy.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 material-symbols-outlined text-sm">check_box_outline_blank</span>
                                        <span>Customizable dashboards for engineering &amp; finance teams.</span>
                                    </li>
                                </ul>
                                <div className="mt-4">
                                    <Link className="inline-flex items-center text-white border-b border-primary pb-1 hover:text-primary transition-colors text-sm font-bold uppercase tracking-wide" to="/app/overview">
                                        Explore_Dashboard <span className="ml-2 material-symbols-outlined text-sm">arrow_right_alt</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-background-dark border-t border-border-dark pt-16 pb-8">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
                        <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
                                <h2 className="text-white text-lg font-bold tracking-tight">CLOUDWISE//AI</h2>
                            </div>
                            <p className="text-text-muted text-sm max-w-xs leading-relaxed">
                                The industrial standard for autonomous cloud cost optimization. Built for scale. Engineered for efficiency.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <a className="text-text-muted hover:text-white transition-colors" href="#">
                                    <span className="material-symbols-outlined text-xl">hub</span>
                                </a>
                                <a className="text-text-muted hover:text-white transition-colors" href="#">
                                    <span className="material-symbols-outlined text-xl">code</span>
                                </a>
                                <a className="text-text-muted hover:text-white transition-colors" href="#">
                                    <span className="material-symbols-outlined text-xl">mail</span>
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Platform</h4>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Agents</a>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Integrations</a>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Security</a>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Changelog</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Resources</h4>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Documentation</a>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">API Reference</a>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Community</a>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Case Studies</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Company</h4>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">About</a>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Careers</a>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Legal</a>
                            <a className="text-text-muted hover:text-primary transition-colors text-sm" href="#">Contact</a>
                        </div>
                    </div>
                    <div className="border-t border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-text-muted text-xs">
                            © 2024 CLOUDWISE AI SYSTEMS. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-text-muted text-xs">All Systems Operational</span>
                            </div>
                            <span className="text-text-muted text-xs">v4.2.0-beta</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
