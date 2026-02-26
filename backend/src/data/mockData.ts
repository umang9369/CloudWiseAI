export const costTrends = [
    { date: 'Jan 01', aws: 1200, azure: 800, gcp: 400 },
    { date: 'Jan 05', aws: 1300, azure: 850, gcp: 420 },
    { date: 'Jan 10', aws: 1250, azure: 900, gcp: 450 },
    { date: 'Jan 15', aws: 2500, azure: 880, gcp: 410 },
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

export let recommendations = [
    { id: 'REC-001', title: 'Right-size EC2 Instances', description: 'Downgrade 5 underutilized m5.4xlarge instances to m5.2xlarge in us-east-1.', potentialSavings: '$1,200/mo', difficulty: 'Easy', status: 'PENDING' },
    { id: 'REC-002', title: 'Delete Unattached EBS Volumes', description: 'Found 12 unattached gp3 volumes older than 30 days.', potentialSavings: '$450/mo', difficulty: 'Easy', status: 'PENDING' },
    { id: 'REC-003', title: 'Migrate to Graviton Processors', description: 'Switch 20 container workloads from x86 to ARM infrastructure.', potentialSavings: '$3,800/mo', difficulty: 'Hard', status: 'PENDING' }
];

export let chatHistory = [
    { id: 1, role: 'ai', text: 'Hello! I am CloudWise AI. How can I help you analyze your cloud costs today?', time: new Date().toISOString() }
];

export const reports = [
    { id: 'REP-102', title: 'Weekly Cost Summary - W4', date: '2024-01-28', type: 'PDF', generatedBy: 'Reporting Agent' },
    { id: 'REP-101', title: 'Weekly Cost Summary - W3', date: '2024-01-21', type: 'PDF', generatedBy: 'Reporting Agent' },
    { id: 'REP-100', title: 'Weekly Cost Summary - W2', date: '2024-01-14', type: 'CSV', generatedBy: 'Reporting Agent' }
];

export const ingestionLogs = [
    { id: 1, time: '06:00:12 AM', source: 'AWS', message: 'Cost and Usage Report fully ingested. (23.1mb)', status: 'success' },
    { id: 2, time: '05:45:00 AM', source: 'GCP', message: 'Billing Export sync completed successfully.', status: 'success' },
    { id: 3, time: '05:30:45 AM', source: 'Azure', message: 'Cost Management API sync completed successfully.', status: 'success' },
    { id: 4, time: '04:15:00 AM', source: 'AWS', message: 'CloudTrail log ingestion delayed. Retrying...', status: 'warning' }
];

export let settings = {
    providers: [
        { id: 'aws', name: 'Amazon Web Services', status: 'CONNECTED' },
        { id: 'azure', name: 'Microsoft Azure', status: 'CONNECTED' },
        { id: 'gcp', name: 'Google Cloud Platform', status: 'CONFIGURE' }
    ],
    notifications: {
        email: true,
        slack: false,
        criticalAnomaliesOnly: false
    }
};
