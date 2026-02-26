import { useEffect, useState } from 'react';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable } from '../components/ui/DataTable';
import { AlertBadge } from '../components/ui/AlertBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardMetrics {
    totalSpend: string;
    spendChange: string;
    savings: string;
    savingsPercent: string;
    activeAnomalies: number;
    criticalAnomalies: number;
    score: number;
}

interface ChartDataPoint {
    date: string;
    aws: number;
    azure: number;
    gcp: number;
}

interface TopDriver {
    id: number;
    name: string;
    service: string;
    cloud: string;
    cost: string;
    change: string;
}

interface AgentLog {
    id: number;
    type: string;
    time: string;
    action: string;
    result: string;
}

export default function Dashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [topDrivers, setTopDrivers] = useState<TopDriver[]>([]);
    const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/api/dashboard/metrics').then(res => res.json()),
            fetch('http://localhost:3001/api/dashboard/chart').then(res => res.json()),
            fetch('http://localhost:3001/api/dashboard/top-drivers').then(res => res.json()),
            fetch('http://localhost:3001/api/dashboard/agent-activity').then(res => res.json())
        ]).then(([metricsData, chart, drivers, logs]) => {
            setMetrics(metricsData);
            setChartData(chart);
            setTopDrivers(drivers);
            setAgentLogs(logs);
        });
    }, []);

    if (!metrics) return <div className="p-8 font-ui text-text-muted animate-pulse">Initializing Agents...</div>;

    return (
        <div className="p-8 space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-4 gap-5">
                <MetricCard label="TOTAL SPEND THIS MONTH" value={metrics.totalSpend} trend="up" trendValue={metrics.spendChange} isRed />
                <MetricCard label="POTENTIAL SAVINGS" value={metrics.savings} subtext={`${metrics.savingsPercent} of spend`} isRed />
                <MetricCard label="ACTIVE ANOMALIES" value={metrics.activeAnomalies} subtext={`${metrics.criticalAnomalies} CRITICAL`} />
                <MetricCard label="OPTIMIZATION SCORE" value={`${metrics.score} / 100`} />
            </div>

            {/* Chart Row */}
            <div className="h-[300px] bg-surface border border-border p-6 pt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1f22" vertical={false} />
                        <XAxis dataKey="date" stroke="#7a7870" tick={{ fill: '#7a7870', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                        <YAxis stroke="#7a7870" tick={{ fill: '#7a7870', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111214', border: '1px solid #1e1f22', borderRadius: '0', fontFamily: 'IBM Plex Mono' }}
                            itemStyle={{ color: '#e8e6df' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: '#7a7870' }} />
                        <Line type="monotone" dataKey="aws" name="AWS" stroke="#c0392b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="azure" name="Azure" stroke="#1e6e6a" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="gcp" name="GCP" stroke="#d4590a" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-8 space-y-4">
                    <h2 className="text-h3 font-display">TOP COST DRIVERS</h2>
                    <DataTable
                        data={topDrivers}
                        columns={[
                            { header: 'RESOURCE', accessor: 'name' },
                            { header: 'SERVICE', accessor: 'service' },
                            { header: 'CLOUD', accessor: 'cloud', className: 'text-text-muted' },
                            { header: 'COST', accessor: 'cost', className: 'font-bold' },
                            {
                                header: 'CHANGE', accessor: (row: TopDriver) => (
                                    <span className={row.change.startsWith('+') ? 'text-accent-red' : 'text-accent-green'}>{row.change}</span>
                                )
                            },
                        ]}
                    />
                </div>

                <div className="col-span-4 space-y-4">
                    <h2 className="text-h3 font-display">AGENT ACTIVITY FEED</h2>
                    <div className="bg-surface border border-border h-[calc(100%-40px)] p-4 overflow-y-auto font-ui text-micro space-y-4">
                        {agentLogs.map(log => (
                            <div key={log.id} className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                    <AlertBadge severity="AI" label={log.type} />
                                    <span className="text-text-muted">{log.time}</span>
                                </div>
                                <div className="text-text-primary mt-1">{log.action}</div>
                                <div className="text-text-muted">{'>'} {log.result}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
