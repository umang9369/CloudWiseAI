import { Router } from 'express';
import { kpis, costTrends, topDrivers, agentLogs } from '../data/mockData';

const router = Router();

router.get('/metrics', (req, res) => {
    res.json(kpis);
});

router.get('/chart', (req, res) => {
    res.json(costTrends);
});

router.get('/top-drivers', (req, res) => {
    res.json(topDrivers);
});

router.get('/agent-activity', (req, res) => {
    res.json(agentLogs);
});

export default router;
