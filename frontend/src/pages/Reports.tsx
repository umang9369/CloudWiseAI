import { useState, useEffect } from 'react';

interface Report {
    id: string;
    title: string;
    date: string;
    type: string;
    generatedBy: string;
}

export default function Reports() {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/reports')
            .then(res => res.json())
            .then(data => setReports(data));
    }, []);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-h2 font-display uppercase">AI Generated Reports</h1>
            <p className="text-text-muted font-ui text-body">
                View detailed summaries and historical analyses of your cloud infrastructure.
            </p>
            <div className="space-y-4">
                {reports.map((report) => (
                    <div key={report.id} className="bg-surface border border-border p-6 hover:border-text-primary cursor-pointer transition-colors flex justify-between items-center group">
                        <div>
                            <h3 className="text-body font-bold text-text-primary group-hover:text-accent-red transition-colors">{report.title}</h3>
                            <div className="flex gap-4">
                                <p className="text-micro text-text-muted mt-1">{report.generatedBy}</p>
                                <p className="text-micro text-text-muted mt-1 opacity-50">{report.date}</p>
                            </div>
                        </div>
                        <div className="text-micro font-bold tracking-widest text-text-secondary bg-bg-primary px-3 py-1 border border-border hover:text-text-primary transition-colors">
                            DOWNLOAD {report.type.toUpperCase()}
                        </div>
                    </div>
                ))}
                {reports.length === 0 && (
                    <div className="text-center p-8 text-text-muted font-ui">Loading reports...</div>
                )}
            </div>
        </div>
    );
}
