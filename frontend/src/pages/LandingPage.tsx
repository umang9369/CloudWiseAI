import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ConnectModalProps {
    onClose: () => void;
}

function AWSConnectModal({ onClose }: ConnectModalProps) {
    const navigate = useNavigate();
    const [step, setStep] = useState<'form' | 'connecting' | 'success' | 'error'>('form');
    const [accessKey, setAccessKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [region, setRegion] = useState('us-east-1');
    const [errorMsg, setErrorMsg] = useState('');
    const [accountId, setAccountId] = useState('');

    const regions = [
        'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
        'eu-west-1', 'eu-west-2', 'eu-central-1',
        'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1',
    ];

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessKey.trim() || !secretKey.trim()) return;

        setStep('connecting');
        setErrorMsg('');

        try {
            const res = await fetch('http://localhost:8000/api/auth/aws/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key_id: accessKey.trim(),
                    secret_access_key: secretKey.trim(),
                    region,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setAccountId(data.account_id);
                setStep('success');
                // Run agents in background
                fetch('http://localhost:8000/api/agents/run', { method: 'POST' }).catch(() => {});
                setTimeout(() => navigate('/app/overview'), 2000);
            } else {
                setErrorMsg(data.detail || 'Failed to connect. Please check your credentials.');
                setStep('error');
            }
        } catch {
            setErrorMsg('Cannot connect to server. Make sure the backend is running on port 8000.');
            setStep('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg mx-4 bg-[#171212] border border-[#372b2a] shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#372b2a] bg-[#1f1616]">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#bf3a2b] text-xl">cloud</span>
                        <span className="text-white text-sm font-bold tracking-wider uppercase">Connect AWS Cloud</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#7a7870] hover:text-white transition-colors text-xl leading-none cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {step === 'form' && (
                        <>
                            <p className="text-[#7a7870] text-xs mb-6 font-mono leading-relaxed border-l-2 border-[#bf3a2b] pl-3">
                                Grant CloudWise AI read-only access to your AWS Cost Explorer and CloudWatch.
                                Your credentials are encrypted and used only for cost analysis.
                            </p>

                            <form onSubmit={handleConnect} className="space-y-4">
                                <div>
                                    <label className="block text-[#7a7870] text-xs font-mono uppercase tracking-wider mb-2">
                                        AWS Access Key ID
                                    </label>
                                    <input
                                        type="text"
                                        value={accessKey}
                                        onChange={e => setAccessKey(e.target.value)}
                                        placeholder="AKIAIOSFODNN7EXAMPLE"
                                        className="w-full bg-[#0c0a0a] border border-[#372b2a] text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#bf3a2b] transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#7a7870] text-xs font-mono uppercase tracking-wider mb-2">
                                        AWS Secret Access Key
                                    </label>
                                    <input
                                        type="password"
                                        value={secretKey}
                                        onChange={e => setSecretKey(e.target.value)}
                                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                                        className="w-full bg-[#0c0a0a] border border-[#372b2a] text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#bf3a2b] transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#7a7870] text-xs font-mono uppercase tracking-wider mb-2">
                                        Primary Region
                                    </label>
                                    <select
                                        value={region}
                                        onChange={e => setRegion(e.target.value)}
                                        className="w-full bg-[#0c0a0a] border border-[#372b2a] text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#bf3a2b] transition-colors cursor-pointer"
                                    >
                                        {regions.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#bf3a2b] hover:bg-[#8a2a20] text-white py-3 text-sm font-bold tracking-wider uppercase transition-colors"
                                    >
                                        &gt; AUTHORIZE ACCESS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 border border-[#372b2a] text-[#7a7870] hover:text-white hover:border-white py-3 text-sm font-bold transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </form>

                            <p className="text-[#3d3c39] text-[10px] font-mono mt-4 text-center">
                                🔒 Credentials are stored encrypted. CloudWise uses read-only IAM permissions.
                            </p>
                        </>
                    )}

                    {step === 'connecting' && (
                        <div className="py-12 flex flex-col items-center gap-6">
                            <div className="w-16 h-16 border-2 border-[#bf3a2b] border-t-transparent rounded-full animate-spin" />
                            <div className="text-center space-y-2">
                                <div className="text-white font-mono text-sm">Establishing secure connection...</div>
                                <div className="text-[#7a7870] font-mono text-xs animate-pulse">Validating credentials via AWS STS...</div>
                            </div>
                            <div className="w-full bg-[#0c0a0a] border border-[#372b2a] p-4 font-mono text-xs space-y-1">
                                <div className="text-green-500">[✓] Initiating STS GetCallerIdentity...</div>
                                <div className="text-[#7a7870] animate-pulse">[...] Verifying IAM permissions...</div>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-10 flex flex-col items-center gap-5">
                            <div className="w-16 h-16 bg-green-500/10 border border-green-500 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="text-white font-bold font-mono text-lg">CONNECTION AUTHORIZED</div>
                                <div className="text-[#7a7870] font-mono text-xs">Account: {accountId}</div>
                                <div className="text-[#7a7870] font-mono text-xs">Region: {region}</div>
                            </div>
                            <div className="w-full bg-[#0c0a0a] border border-green-500/30 p-3 font-mono text-xs space-y-1">
                                <div className="text-green-500">[✓] AWS STS validation successful</div>
                                <div className="text-green-500">[✓] Launching multi-agent pipeline...</div>
                                <div className="text-[#7a7870] animate-pulse">[...] Redirecting to dashboard...</div>
                            </div>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="py-6 space-y-5">
                            <div className="flex items-start gap-3 bg-red-900/20 border border-red-700/40 p-4">
                                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                                <div>
                                    <div className="text-red-400 font-mono text-sm font-bold mb-1">CONNECTION FAILED</div>
                                    <div className="text-[#7a7870] font-mono text-xs">{errorMsg}</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('form')}
                                    className="flex-1 bg-[#bf3a2b] hover:bg-[#8a2a20] text-white py-3 text-sm font-bold tracking-wider uppercase transition-colors"
                                >
                                    TRY AGAIN
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 border border-[#372b2a] text-[#7a7870] py-3 text-sm font-bold"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [showModal, setShowModal] = useState(false);
    
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-mono overflow-x-hidden min-h-screen flex flex-col">
            {showModal && <AWSConnectModal onClose={() => setShowModal(false)} />}

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
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center h-9 px-5 bg-primary hover:bg-primary-dark text-white text-xs font-bold tracking-wider transition-colors border border-transparent hover:border-white/20"
                        >
                            [ ACCESS_PLATFORM ]
                        </button>
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
                                {/* PRIMARY CTA — opens AWS modal */}
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="group relative flex items-center justify-center h-12 px-8 bg-white text-background-dark hover:bg-gray-200 text-sm font-bold tracking-wide transition-all cursor-pointer"
                                >
                                    <span className="mr-2">&gt;</span> INITIALIZE SYSTEM
                                    <div className="absolute inset-0 border border-white group-hover:translate-x-1 group-hover:translate-y-1 transition-transform pointer-events-none"></div>
                                </button>
                                <Link
                                    to="/app/overview"
                                    className="group flex items-center justify-center h-12 px-8 bg-transparent border border-border-dark hover:border-white text-white text-sm font-bold tracking-wide transition-all"
                                >
                                    VIEW_DEMO.EXE
                                </Link>
                            </div>
                        </div>

                        {/* Right: Terminal Window */}
                        <div className="w-full relative group">
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
                                    <div className="w-10"></div>
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
                                        <div>[INFO] Loading agents: [COST_ANALYZER], [ANOMALY], [OPTIMIZER], [MULTI_CLOUD]</div>
                                        <div className="text-green-500">[SUCCESS] All 4 agents loaded. RAG pipeline ready.</div>
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
                                            <span className="text-text-muted">[RAG]</span>
                                            <span>ChromaDB query context retrieved. Groq analysis ready.</span>
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

                {/* Agents Section */}
                <section className="max-w-[1440px] mx-auto px-6 py-20 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-border-dark pb-6">
                        <div className="flex flex-col gap-2">
                            <div className="text-primary font-mono text-xs tracking-widest uppercase">// AUTONOMOUS AGENTS</div>
                            <h2 className="text-white text-3xl md:text-4xl font-bold font-display uppercase max-w-xl">
                                4-Agent AI System
                            </h2>
                        </div>
                        <p className="text-text-muted text-sm max-w-sm text-right md:text-left">
                            Each agent independently reasons with RAG context, then collaborates for final output.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border-dark border border-border-dark">
                        {[
                            { icon: 'payments', name: 'Cost Analyzer', desc: 'Finds the most expensive services and tracks spend trends across all cloud resources.', color: 'text-primary' },
                            { icon: 'warning', name: 'Anomaly Agent', desc: 'Detects unusual cost spikes within minutes using rolling baseline comparison.', color: 'text-yellow-500' },
                            { icon: 'auto_fix_high', name: 'Optimization Agent', desc: 'Identifies idle resources, rightsizing opportunities, and cost-saving actions.', color: 'text-green-500' },
                            { icon: 'public', name: 'Multi-Cloud Agent', desc: 'Compares costs across AWS, Azure, GCP and provides unified intelligence.', color: 'text-blue-400' },
                        ].map((agent) => (
                            <div key={agent.name} className="bg-background-dark p-8 flex flex-col gap-6 hover:bg-surface-dark transition-colors group">
                                <div className={`w-12 h-12 bg-surface-dark border border-border-dark flex items-center justify-center text-white group-hover:border-current group-hover:${agent.color} transition-colors`}>
                                    <span className={`material-symbols-outlined group-hover:${agent.color} transition-colors`}>{agent.icon}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-white font-bold text-base uppercase tracking-tight">{agent.name}</h3>
                                    <p className="text-text-muted text-sm leading-relaxed">{agent.desc}</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-auto pt-4 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-primary transition-colors cursor-pointer"
                                >
                                    Deploy Agent <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features Grid */}
                <section className="max-w-[1440px] mx-auto px-6 pb-20 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-border-dark pb-6">
                        <div className="flex flex-col gap-2">
                            <div className="text-primary font-mono text-xs tracking-widest uppercase">// CAPABILITIES</div>
                            <h2 className="text-white text-3xl md:text-4xl font-bold font-display uppercase max-w-xl">
                                Autonomous Infrastructure Protection
                            </h2>
                        </div>
                        <p className="text-text-muted text-sm max-w-sm text-right md:text-left">
                            Industrial-grade autonomous agents operating 24/7 to secure your infrastructure efficiency.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border-dark border border-border-dark">
                        <div className="bg-background-dark p-8 flex flex-col gap-6 hover:bg-surface-dark transition-colors group">
                            <div className="w-12 h-12 bg-surface-dark border border-border-dark flex items-center justify-center text-white group-hover:border-primary group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">memory</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-white font-bold text-lg uppercase tracking-tight">⚡ Auto Optimization</h3>
                                <ul className="text-text-muted text-sm leading-relaxed space-y-1">
                                    <li>→ Rightsizing instances</li>
                                    <li>→ Removing idle resources</li>
                                    <li>→ Smart storage tiering</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background-dark p-8 flex flex-col gap-6 hover:bg-surface-dark transition-colors group">
                            <div className="w-12 h-12 bg-surface-dark border border-border-dark flex items-center justify-center text-white group-hover:border-primary group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-white font-bold text-lg uppercase tracking-tight">🚨 Real-Time Anomaly Detection</h3>
                                <ul className="text-text-muted text-sm leading-relaxed space-y-1">
                                    <li>→ Detects cost spikes within minutes</li>
                                    <li>→ Prevents unexpected bills</li>
                                    <li>→ Rolling 7-day baseline analysis</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background-dark p-8 flex flex-col gap-6 hover:bg-surface-dark transition-colors group">
                            <div className="w-12 h-12 bg-surface-dark border border-border-dark flex items-center justify-center text-white group-hover:border-primary group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">public</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-white font-bold text-lg uppercase tracking-tight">🌐 Multi-Cloud Intelligence</h3>
                                <ul className="text-text-muted text-sm leading-relaxed space-y-1">
                                    <li>→ Works across AWS, Azure, GCP</li>
                                    <li>→ Provides unified insights</li>
                                    <li>→ Cross-provider cost comparison</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Visualization Abstract Section */}
                <section className="w-full py-16 bg-surface-dark border-y border-border-dark relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#bf3a2b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 relative">
                                <div className="w-full aspect-video bg-background-dark border border-border-dark p-1 relative">
                                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 divide-x divide-y divide-border-dark/30 opacity-50"></div>
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
                                    <div className="absolute top-[20%] right-[10%] bg-background-dark border border-primary px-3 py-1 text-[10px] text-primary">
                                        OPTIMIZED
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 flex flex-col gap-6">
                                <div className="text-primary font-mono text-xs tracking-widest uppercase">// RAG-POWERED ANALYSIS</div>
                                <h2 className="text-white text-3xl md:text-4xl font-bold font-display uppercase">
                                    Visualise Spend.<br />Eliminate Waste.
                                </h2>
                                <ul className="space-y-4 font-mono text-sm text-text-muted">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 material-symbols-outlined text-sm">check_box_outline_blank</span>
                                        <span>ChromaDB vector store ingests all cloud cost data for semantic retrieval.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 material-symbols-outlined text-sm">check_box_outline_blank</span>
                                        <span>Groq (llama-3.3-70b) reasons over your cloud data for instant analysis.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 material-symbols-outlined text-sm">check_box_outline_blank</span>
                                        <span>Customizable dashboards for engineering &amp; finance teams.</span>
                                    </li>
                                </ul>
                                <div className="mt-4">
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="inline-flex items-center text-white border-b border-primary pb-1 hover:text-primary transition-colors text-sm font-bold uppercase tracking-wide cursor-pointer"
                                    >
                                        Connect_Cloud <span className="ml-2 material-symbols-outlined text-sm">arrow_right_alt</span>
                                    </button>
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
                            <span className="text-text-muted text-xs">v4.2.0-fastapi</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
