import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ─── parallax hook ─── */
function useParallax(speed = 0.4) {
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        const onScroll = () => setOffset(window.scrollY * speed);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [speed]);
    return offset;
}

/* ─── intersection-observer hook ─── */
function useReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

/* ─── AWS Connect Modal ─── */
interface ConnectModalProps { onClose: () => void; }

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
                body: JSON.stringify({ access_key_id: accessKey.trim(), secret_access_key: secretKey.trim(), region }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setAccountId(data.account_id);
                setStep('success');
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
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#372b2a] bg-[#1f1616]">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#bf3a2b] text-xl">cloud</span>
                        <span className="text-white text-sm font-bold tracking-wider uppercase">Connect AWS Cloud</span>
                    </div>
                    <button onClick={onClose} className="text-[#ded2ad] hover:text-white transition-colors text-xl leading-none cursor-pointer">✕</button>
                </div>
                <div className="p-6">
                    {step === 'form' && (
                        <>
                            <p className="text-[#ded2ad] text-xs mb-6 font-mono leading-relaxed border-l-2 border-[#bf3a2b] pl-3">
                                Grant CloudWise AI read-only access to your AWS Cost Explorer and CloudWatch.
                                Your credentials are encrypted and used only for cost analysis.
                            </p>
                            <form onSubmit={handleConnect} className="space-y-4">
                                <div>
                                    <label className="block text-[#ded2ad] text-xs font-mono uppercase tracking-wider mb-2">AWS Access Key ID</label>
                                    <input type="text" value={accessKey} onChange={e => setAccessKey(e.target.value)} placeholder="AKIAIOSFODNN7EXAMPLE"
                                        className="w-full bg-[#0c0a0a] border border-[#372b2a] text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#bf3a2b] transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-[#ded2ad] text-xs font-mono uppercase tracking-wider mb-2">AWS Secret Access Key</label>
                                    <input type="password" value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                                        className="w-full bg-[#0c0a0a] border border-[#372b2a] text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#bf3a2b] transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-[#ded2ad] text-xs font-mono uppercase tracking-wider mb-2">Primary Region</label>
                                    <select value={region} onChange={e => setRegion(e.target.value)}
                                        className="w-full bg-[#0c0a0a] border border-[#372b2a] text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#bf3a2b] transition-colors cursor-pointer">
                                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="pt-2 flex gap-3">
                                    <button type="submit" className="flex-1 bg-[#bf3a2b] hover:bg-[#8a2a20] text-white py-3 text-sm font-bold tracking-wider uppercase transition-colors">&gt; AUTHORIZE ACCESS</button>
                                    <button type="button" onClick={onClose} className="px-6 border border-[#372b2a] text-[#ded2ad] hover:text-white hover:border-white py-3 text-sm font-bold transition-colors">CANCEL</button>
                                </div>
                            </form>
                            <p className="text-[#3d3c39] text-[10px] font-mono mt-4 text-center">🔒 Credentials are stored encrypted. CloudWise uses read-only IAM permissions.</p>
                        </>
                    )}
                    {step === 'connecting' && (
                        <div className="py-12 flex flex-col items-center gap-6">
                            <div className="w-16 h-16 border-2 border-[#bf3a2b] border-t-transparent rounded-full animate-spin" />
                            <div className="text-center space-y-2">
                                <div className="text-white font-mono text-sm">Establishing secure connection...</div>
                                <div className="text-[#ded2ad] font-mono text-xs animate-pulse">Validating credentials via AWS STS...</div>
                            </div>
                            <div className="w-full bg-[#0c0a0a] border border-[#372b2a] p-4 font-mono text-xs space-y-1">
                                <div className="text-green-500">[✓] Initiating STS GetCallerIdentity...</div>
                                <div className="text-[#ded2ad] animate-pulse">[...] Verifying IAM permissions...</div>
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
                                <div className="text-[#ded2ad] font-mono text-xs">Account: {accountId}</div>
                                <div className="text-[#ded2ad] font-mono text-xs">Region: {region}</div>
                            </div>
                            <div className="w-full bg-[#0c0a0a] border border-green-500/30 p-3 font-mono text-xs space-y-1">
                                <div className="text-green-500">[✓] AWS STS validation successful</div>
                                <div className="text-green-500">[✓] Launching multi-agent pipeline...</div>
                                <div className="text-[#ded2ad] animate-pulse">[...] Redirecting to dashboard...</div>
                            </div>
                        </div>
                    )}
                    {step === 'error' && (
                        <div className="py-6 space-y-5">
                            <div className="flex items-start gap-3 bg-red-900/20 border border-red-700/40 p-4">
                                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                                <div>
                                    <div className="text-red-400 font-mono text-sm font-bold mb-1">CONNECTION FAILED</div>
                                    <div className="text-[#ded2ad] font-mono text-xs">{errorMsg}</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep('form')} className="flex-1 bg-[#bf3a2b] hover:bg-[#8a2a20] text-white py-3 text-sm font-bold tracking-wider uppercase transition-colors">TRY AGAIN</button>
                                <button onClick={onClose} className="px-6 border border-[#372b2a] text-[#ded2ad] py-3 text-sm font-bold">CANCEL</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const { ref, visible } = useReveal(0.3);
    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [visible, target]);
    return (
        <span ref={ref as React.Ref<HTMLSpanElement>}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const { ref, visible } = useReveal();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

/* ─── Marquee ─── */
const marqueeItems = [
    'COST OPTIMIZATION', 'AWS', 'AZURE', 'GCP', 'ANOMALY DETECTION',
    'MULTI-CLOUD', 'RAG ANALYSIS', 'GROQ LLM', 'CHROMADB', 'REAL-TIME AGENTS',
    'RIGHTSIZING', 'RESERVED INSTANCES', 'SPOT OPTIMIZATION', 'CLOUD INTELLIGENCE',
];

function Marquee() {
    const doubled = [...marqueeItems, ...marqueeItems];
    return (
        <div className="w-full overflow-hidden border-y border-[#372b2a] bg-[#0c0a0a] py-4 select-none">
            <style>{`
                @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                .marquee-track { animation: marquee 30s linear infinite; display: flex; width: max-content; }
                .marquee-track:hover { animation-play-state: paused; }
            `}</style>
            <div className="marquee-track">
                {doubled.map((item, i) => (
                    <span key={i} className="flex items-center gap-6 px-6 text-xs font-mono tracking-widest text-[#ded2ad] whitespace-nowrap">
                        <span className="text-[#bf3a2b]">◆</span>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
    const [showModal, setShowModal] = useState(false);
    const heroParallax = useParallax(0.35);
    const bgParallax = useParallax(0.15);

    return (
        <div className="bg-[#171212] text-white font-mono overflow-x-hidden min-h-screen flex flex-col">
            {showModal && <AWSConnectModal onClose={() => setShowModal(false)} />}

            {/* ── Sticky Nav ── */}
            <header className="w-full border-b border-[#372b2a] bg-[#171212]/95 backdrop-blur z-50 sticky top-0">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#bf3a2b] text-2xl">terminal</span>
                        <h2 className="text-white text-lg font-bold tracking-tight">CLOUDWISE//AI</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-[#ded2ad] hover:text-white text-sm font-medium transition-colors" href="#">// SOLUTIONS</a>
                        <a className="text-[#ded2ad] hover:text-white text-sm font-medium transition-colors" href="#">// PRICING</a>
                        <a className="text-[#ded2ad] hover:text-white text-sm font-medium transition-colors" href="#">// DOCS</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="hidden sm:block text-xs text-[#ded2ad]">SYSTEM ONLINE</span>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center h-9 px-5 bg-[#bf3a2b] hover:bg-[#8a2a20] text-white text-xs font-bold tracking-wider transition-colors border border-transparent hover:border-white/20"
                        >
                            [ ACCESS_PLATFORM ]
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col">

                {/* ── Hero with Parallax ── */}
                <section className="relative w-full min-h-screen flex items-center overflow-hidden border-b border-[#372b2a]">
                    {/* Parallax background grid */}
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(#bf3a2b 1px, transparent 1px), linear-gradient(90deg, #bf3a2b 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                            transform: `translateY(${bgParallax}px)`,
                            willChange: 'transform',
                        }}
                    />

                    {/* Radial glow */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(191,58,43,0.08) 0%, transparent 70%)',
                            transform: `translate(-50%, calc(-50% + ${bgParallax * 0.5}px))`,
                        }}
                    />

                    <div
                        className="relative max-w-[1440px] mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full"
                        style={{ transform: `translateY(${heroParallax}px)`, willChange: 'transform' }}
                    >
                        {/* Left: Typography */}
                        <div className="flex flex-col gap-8 max-w-2xl">
                            <div
                                className="inline-flex items-center gap-2 text-[#bf3a2b] text-xs font-bold tracking-widest uppercase"
                                style={{ opacity: 1 }}
                            >
                                <span className="w-2 h-2 bg-[#bf3a2b] animate-pulse"></span>
                                Initializing Sequence v4.0.2
                            </div>

                            <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tighter">
                                CLOUD COSTS,<br />
                                <span
                                    className="text-transparent bg-clip-text"
                                    style={{ backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #ded2ad 100%)' }}
                                >
                                    DECODED.
                                </span>
                            </h1>

                            <p className="text-[#ded2ad] text-base sm:text-lg leading-relaxed max-w-lg border-l-2 border-[#bf3a2b] pl-4">
                                Production-ready agentic AI for total cloud cost optimization. Deploy autonomous agents to analyze, detect anomalies, and reduce spend without human intervention.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="group relative flex items-center justify-center h-12 px-8 bg-white text-[#171212] hover:bg-gray-200 text-sm font-bold tracking-wide transition-all cursor-pointer overflow-hidden"
                                    style={{ willChange: 'transform' }}
                                >
                                    <span
                                        className="absolute inset-0 bg-[#bf3a2b]"
                                        style={{
                                            transform: 'translateX(-100%)',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(0)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(-100%)')}
                                    />
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                                        <span className="mr-2">&gt;</span> INITIALIZE SYSTEM
                                    </span>
                                    <div className="absolute inset-0 border border-white group-hover:translate-x-1 group-hover:translate-y-1 transition-transform pointer-events-none"></div>
                                </button>
                                <Link
                                    to="/app/overview"
                                    className="group flex items-center justify-center h-12 px-8 bg-transparent border border-[#372b2a] hover:border-white text-white text-sm font-bold tracking-wide transition-all"
                                >
                                    VIEW_DEMO.EXE
                                </Link>
                            </div>
                        </div>

                        {/* Right: Terminal Window */}
                        <div className="w-full relative group">
                            <div className="absolute -top-3 -right-3 w-24 h-24 border-t-2 border-r-2 border-[#bf3a2b]/30 z-0"></div>
                            <div className="absolute -bottom-3 -left-3 w-24 h-24 border-b-2 border-l-2 border-[#bf3a2b]/30 z-0"></div>
                            <div className="relative z-10 bg-[#0c0a0a] border border-[#372b2a] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
                                <div className="flex items-center justify-between px-4 py-2 bg-[#1f1616] border-b border-[#372b2a]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-[#ff5f57]"></div>
                                        <div className="w-3 h-3 bg-[#febc2e]"></div>
                                        <div className="w-3 h-3 bg-[#28c840]"></div>
                                    </div>
                                    <div className="text-[#ded2ad] text-[10px] tracking-widest uppercase">agent_monitor_v1.sh</div>
                                    <div className="w-10"></div>
                                </div>
                                <div className="p-6 h-[320px] overflow-y-auto flex flex-col gap-2 text-gray-300">
                                    <div className="flex gap-2">
                                        <span className="text-green-500">root@cloudwise:~#</span>
                                        <span className="text-white">./init_agents.sh --verbose</span>
                                    </div>
                                    <div className="pl-4 text-[#ded2ad]">
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
                                        {[
                                            { time: '10:42:01', tag: '[WARN]', color: 'text-yellow-500', msg: 'Unexpected spike detected in us-east-1 (RDS instance)' },
                                            { time: '10:42:02', tag: '[ACTION]', color: 'text-[#bf3a2b]', msg: 'Auto-scaling policy triggered. Reducing capacity by 20%.' },
                                            { time: '10:42:05', tag: '[SAVED]', color: 'text-green-500', msg: 'Estimated savings: $420.50/month' },
                                            { time: '10:42:15', tag: '[RAG]', color: 'text-[#ded2ad]', msg: 'ChromaDB query context retrieved. Groq analysis ready.' },
                                            { time: '10:42:18', tag: '[ALERT]', color: 'text-[#bf3a2b]', msg: '3 Unused ELBs found. Marking for deletion.' },
                                            { time: '10:42:22', tag: '[STATUS]', color: 'text-[#ded2ad]', msg: 'System optimal. Efficiency rating: 98.4%' },
                                        ].map((row, i) => (
                                            <div key={i} className="flex gap-3">
                                                <span className="text-blue-400">{row.time}</span>
                                                <span className={row.color}>{row.tag}</span>
                                                <span>{row.msg}</span>
                                            </div>
                                        ))}
                                        <div className="flex gap-3 mt-2">
                                            <span className="text-green-500">root@cloudwise:~#</span>
                                            <span className="animate-blink bg-white w-2 h-4 block"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                        <span className="text-[#372b2a] text-[10px] tracking-widest font-mono">SCROLL</span>
                        <div className="w-px h-8 bg-gradient-to-b from-[#372b2a] to-transparent"></div>
                    </div>
                </section>

                {/* ── Marquee ── */}
                <Marquee />

                {/* ── Stats Bar ── */}
                <section className="border-b border-[#372b2a] bg-[#251e1d]">
                    <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-[#372b2a]">
                        {[
                            { label: 'Resources Analyzed', value: 2400000, suffix: '+', display: '2.4M+' },
                            { label: 'Avg Savings', value: 38, suffix: '%', display: '38%' },
                            { label: 'Anomalies Caught', value: 14203, suffix: '', display: '14,203' },
                            { label: 'Active Agents', value: 850, suffix: '+', display: '850+' },
                        ].map((stat, i) => (
                            <Reveal key={stat.label} delay={i * 100}>
                                <div className="p-6 md:p-8 flex flex-col gap-1 items-start group hover:bg-[#2a2221] transition-colors cursor-default">
                                    <div className="text-[#ded2ad] text-xs font-bold tracking-wider uppercase mb-1">{stat.label}</div>
                                    <div className="text-white text-3xl font-bold">
                                        <Counter target={stat.value} />{stat.suffix}
                                    </div>
                                    <div className="h-0.5 w-0 bg-[#bf3a2b] group-hover:w-full transition-all duration-500 mt-2"></div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── Agents Section ── */}
                <section className="max-w-[1440px] mx-auto px-6 py-24 w-full">
                    <Reveal>
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-[#372b2a] pb-6">
                            <div className="flex flex-col gap-2">
                                <div className="text-[#bf3a2b] font-mono text-xs tracking-widest uppercase">// AUTONOMOUS AGENTS</div>
                                <h2 className="text-white text-3xl md:text-4xl font-bold uppercase max-w-xl">4-Agent AI System</h2>
                            </div>
                            <p className="text-[#ded2ad] text-sm max-w-sm text-right md:text-left">
                                Each agent independently reasons with RAG context, then collaborates for final output.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#372b2a] border border-[#372b2a]">
                        {[
                            { icon: 'payments', name: 'Cost Analyzer', desc: 'Finds the most expensive services and tracks spend trends across all cloud resources.', color: 'text-[#bf3a2b]' },
                            { icon: 'warning', name: 'Anomaly Agent', desc: 'Detects unusual cost spikes within minutes using rolling baseline comparison.', color: 'text-yellow-500' },
                            { icon: 'auto_fix_high', name: 'Optimization Agent', desc: 'Identifies idle resources, rightsizing opportunities, and cost-saving actions.', color: 'text-green-500' },
                            { icon: 'public', name: 'Multi-Cloud Agent', desc: 'Compares costs across AWS, Azure, GCP and provides unified intelligence.', color: 'text-blue-400' },
                        ].map((agent, i) => (
                            <Reveal key={agent.name} delay={i * 80}>
                                <div className={`bg-[#171212] p-8 flex flex-col gap-6 hover:bg-[#251e1d] transition-all duration-300 group h-full`}>
                                    <div className={`w-12 h-12 bg-[#251e1d] border border-[#372b2a] flex items-center justify-center text-white group-hover:border-current group-hover:${agent.color} transition-colors`}>
                                        <span className={`material-symbols-outlined group-hover:${agent.color} transition-colors`}>{agent.icon}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <h3 className="text-white font-bold text-base uppercase tracking-tight">{agent.name}</h3>
                                        <p className="text-[#ded2ad] text-sm leading-relaxed">{agent.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="mt-auto pt-4 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-[#bf3a2b] transition-colors cursor-pointer"
                                    >
                                        Deploy Agent <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── Horizontal scroll features ── */}
                <section className="w-full py-24 bg-[#251e1d] border-y border-[#372b2a] relative overflow-hidden">
                    {/* Parallax dot grid bg */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'radial-gradient(#bf3a2b 1.5px, transparent 1.5px)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                    <Reveal className="max-w-[1440px] mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-[#372b2a] pb-6">
                            <div className="flex flex-col gap-2">
                                <div className="text-[#bf3a2b] font-mono text-xs tracking-widest uppercase">// CAPABILITIES</div>
                                <h2 className="text-white text-3xl md:text-4xl font-bold uppercase max-w-xl">
                                    Autonomous Infrastructure Protection
                                </h2>
                            </div>
                            <p className="text-[#ded2ad] text-sm max-w-sm text-right md:text-left">
                                Industrial-grade autonomous agents operating 24/7 to secure your infrastructure efficiency.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#372b2a] border border-[#372b2a]">
                            {[
                                {
                                    icon: 'memory', title: '⚡ Auto Optimization',
                                    items: ['→ Rightsizing instances', '→ Removing idle resources', '→ Smart storage tiering']
                                },
                                {
                                    icon: 'warning', title: '🚨 Real-Time Anomaly Detection',
                                    items: ['→ Detects cost spikes within minutes', '→ Prevents unexpected bills', '→ Rolling 7-day baseline analysis']
                                },
                                {
                                    icon: 'public', title: '🌐 Multi-Cloud Intelligence',
                                    items: ['→ Works across AWS, Azure, GCP', '→ Provides unified insights', '→ Cross-provider cost comparison']
                                },
                            ].map((cap, i) => (
                                <Reveal key={cap.title} delay={i * 100}>
                                    <div className="bg-[#171212] p-8 flex flex-col gap-6 hover:bg-[#251e1d] transition-colors group h-full">
                                        <div className="w-12 h-12 bg-[#251e1d] border border-[#372b2a] flex items-center justify-center text-white group-hover:border-[#bf3a2b] group-hover:text-[#bf3a2b] transition-colors">
                                            <span className="material-symbols-outlined">{cap.icon}</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-white font-bold text-lg uppercase tracking-tight">{cap.title}</h3>
                                            <ul className="text-[#ded2ad] text-sm leading-relaxed space-y-1">
                                                {cap.items.map(it => <li key={it}>{it}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </Reveal>
                </section>

                {/* ── RAG Visualization Section with Parallax ── */}
                <section className="w-full py-24 bg-[#171212] border-b border-[#372b2a] relative overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage: 'linear-gradient(#bf3a2b 1px, transparent 1px)',
                            backgroundSize: '1px 40px',
                        }}
                    />
                    <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <Reveal className="order-2 md:order-1 relative">
                                <div className="w-full aspect-video bg-[#0c0a0a] border border-[#372b2a] p-1 relative overflow-hidden">
                                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 divide-x divide-y divide-[#372b2a]/30 opacity-50"></div>
                                    <svg className="absolute inset-0 w-full h-full text-[#bf3a2b]" preserveAspectRatio="none">
                                        <polyline fill="none" points="0,200 50,180 100,190 150,140 200,150 250,100 300,80 350,90 400,40 500,20" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                        <defs>
                                            <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: 'rgb(191, 58, 43)', stopOpacity: 0.2 }} />
                                                <stop offset="100%" style={{ stopColor: 'rgb(191, 58, 43)', stopOpacity: 0 }} />
                                            </linearGradient>
                                        </defs>
                                        <polygon fill="url(#grad1)" points="0,200 50,180 100,190 150,140 200,150 250,100 300,80 350,90 400,40 500,20 500,300 0,300" />
                                    </svg>
                                    <div className="absolute top-[20%] right-[10%] bg-[#0c0a0a] border border-[#bf3a2b] px-3 py-1 text-[10px] text-[#bf3a2b]">OPTIMIZED</div>
                                </div>
                            </Reveal>
                            <Reveal delay={150} className="order-1 md:order-2 flex flex-col gap-6">
                                <div className="text-[#bf3a2b] font-mono text-xs tracking-widest uppercase">// RAG-POWERED ANALYSIS</div>
                                <h2 className="text-white text-3xl md:text-4xl font-bold uppercase">
                                    Visualise Spend.<br />Eliminate Waste.
                                </h2>
                                <ul className="space-y-4 font-mono text-sm text-[#ded2ad]">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#bf3a2b] mt-1 material-symbols-outlined text-sm">check_box_outline_blank</span>
                                        <span>ChromaDB vector store ingests all cloud cost data for semantic retrieval.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#bf3a2b] mt-1 material-symbols-outlined text-sm">check_box_outline_blank</span>
                                        <span>Groq (llama-3.3-70b) reasons over your cloud data for instant analysis.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#bf3a2b] mt-1 material-symbols-outlined text-sm">check_box_outline_blank</span>
                                        <span>Customizable dashboards for engineering &amp; finance teams.</span>
                                    </li>
                                </ul>
                                <div className="mt-4">
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="inline-flex items-center text-white border-b border-[#bf3a2b] pb-1 hover:text-[#bf3a2b] transition-colors text-sm font-bold uppercase tracking-wide cursor-pointer"
                                    >
                                        Connect_Cloud <span className="ml-2 material-symbols-outlined text-sm">arrow_right_alt</span>
                                    </button>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ── CTA Banner ── */}
                <section className="w-full py-24 bg-[#251e1d] border-b border-[#372b2a]">
                    <Reveal className="max-w-[1440px] mx-auto px-6 text-center flex flex-col items-center gap-8">
                        <div className="text-[#bf3a2b] font-mono text-xs tracking-widest uppercase">// GET STARTED</div>
                        <h2 className="text-white text-4xl md:text-5xl font-bold uppercase max-w-3xl leading-tight">
                            Stop overpaying for cloud.<br />
                            <span className="text-[#ded2ad]">Deploy intelligence today.</span>
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => setShowModal(true)}
                                className="h-14 px-10 bg-[#bf3a2b] hover:bg-[#8a2a20] text-white text-sm font-bold tracking-wider uppercase transition-all hover:-translate-y-0.5"
                            >
                                &gt; INITIALIZE SYSTEM
                            </button>
                            <Link to="/app/overview"
                                className="h-14 px-10 border border-[#372b2a] hover:border-white text-white text-sm font-bold tracking-wider uppercase transition-all hover:-translate-y-0.5 flex items-center"
                            >
                                VIEW LIVE DEMO
                            </Link>
                        </div>
                    </Reveal>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className="bg-[#171212] border-t border-[#372b2a] pt-16 pb-8">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
                        <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-[#bf3a2b] text-2xl">terminal</span>
                                <h2 className="text-white text-lg font-bold tracking-tight">CLOUDWISE//AI</h2>
                            </div>
                            <p className="text-[#ded2ad] text-sm max-w-xs leading-relaxed">
                                The industrial standard for autonomous cloud cost optimization. Built for scale. Engineered for efficiency.
                            </p>
                        </div>
                        {[
                            { title: 'Platform', links: ['Agents', 'Integrations', 'Security', 'Changelog'] },
                            { title: 'Resources', links: ['Documentation', 'API Reference', 'Community', 'Case Studies'] },
                            { title: 'Company', links: ['About', 'Careers', 'Legal', 'Contact'] },
                        ].map(col => (
                            <div key={col.title} className="flex flex-col gap-4">
                                <h4 className="text-white font-bold text-sm uppercase tracking-wider">{col.title}</h4>
                                {col.links.map(l => (
                                    <a key={l} className="text-[#ded2ad] hover:text-[#bf3a2b] transition-colors text-sm" href="#">{l}</a>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-[#372b2a] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[#ded2ad] text-xs">© 2024 CLOUDWISE AI SYSTEMS. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-[#ded2ad] text-xs">All Systems Operational</span>
                            </div>
                            <span className="text-[#ded2ad] text-xs">v4.2.0-fastapi</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
