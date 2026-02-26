export const costTrends = [
    { date: 'Jan 01', aws: 1200, azure: 800, gcp: 400 },
    { date: 'Jan 05', aws: 1300, azure: 850, gcp: 420 },
    { date: 'Jan 10', aws: 1250, azure: 900, gcp: 450 },
    { date: 'Jan 15', aws: 2500, azure: 880, gcp: 410 }, // Anomaly spike
    { date: 'Jan 20', aws: 1400, azure: 920, gcp: 460 },
    { date: 'Jan 25', aws: 1350, azure: 950, gcp: 500 },
    { date: 'Jan 30', aws: 1380, azure: 910, gcp: 480 },
];

export const topDrivers = [
    { id: 1, name: 'i3.2xlarge', service: 'EC2', cost: '$2,340', change: '+12%', cloud: 'AWS' },
    { id: 2, name: 'm5.4xlarge', service: 'EC2', cost: '$1,890', change: '-4%', cloud: 'AWS' },
    { id: 3, name: 'db.r5.large', service: 'RDS', cost: '$890', change: '+2%', cloud: 'AWS' },
    { id: 4, name: 'prod-logs-2023', service: 'S3', cost: '$340', change: '+18%', cloud: 'AWS' },
    { id: 5, name: 'Standard_D4s_v3', service: 'Virtual Machines', cost: '$1,100', change: '+5%', cloud: 'Azure' },
    { id: 6, name: 'n1-standard-8', service: 'Compute Engine', cost: '$950', change: '-2%', cloud: 'GCP' }
];

export const kpis = {
    totalSpend: '$84,320',
    spendChange: '+12%',
    savings: '$31,400',
    savingsPercent: '37.2%',
    activeAnomalies: 14,
    criticalAnomalies: 3,
    score: 62
};

export const anomalies = [
    { id: 'AN-001', service: 'EC2', resource: 'web-server-prod-07', detected: '2024-01-14', spike: '+340%', baseline: '$45/day', current: '$198/day', status: 'OPEN', explanation: 'Runaway cron job caused sustained 100% CPU utilization starting at 02:00 UTC, triggering auto-scaling group to launch 4 additional instances.', severity: 'CRITICAL' },
    { id: 'AN-002', service: 'Data Transfer', resource: 'vpc-main-egress', detected: '2024-01-15', spike: '+180%', baseline: '$12/day', current: '$34/day', status: 'INVESTIGATING', explanation: 'Cross-region replication was enabled for a high-volume S3 bucket transferring to eu-west-1.', severity: 'CRITICAL' },
    { id: 'AN-003', service: 'Lambda', resource: 'process-image-queue', detected: '2024-01-18', spike: '+2100%', baseline: '$2/day', current: '$44/day', status: 'OPEN', explanation: 'Recursive trigger detected: Lambda function is writing to the same S3 bucket that triggers it.', severity: 'CRITICAL' },
    { id: 'AN-004', service: 'Cloud Run', resource: 'api-gateway', detected: '2024-01-22', spike: '+45%', baseline: '$8/day', current: '$12/day', status: 'ACKNOWLEDGED', explanation: 'Expected traffic spike due to marketing campaign. No action required.', severity: 'INFO' }
];

export const agentLogs = [
    { id: 1, type: 'INGESTION', time: '10:42 AM', action: 'Parsed AWS CUR data', result: '14,203 records processed' },
    { id: 2, type: 'ANALYSIS', time: '10:45 AM', action: 'Ran anomaly detection', result: 'Found 2 new anomalies' },
    { id: 3, type: 'OPTIMIZATION', time: '11:00 AM', action: 'Generated recommendations', result: '$4,200 potential savings identified' },
    { id: 4, type: 'REPORTING', time: '11:05 AM', action: 'Drafted Weekly Summary', result: 'Ready for review' }
];
