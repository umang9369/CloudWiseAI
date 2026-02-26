import { Router } from 'express';
import { anomalies } from '../data/mockData';

const router = Router();

router.get('/', (req, res) => {
    res.json(anomalies);
});

router.post('/:id/acknowledge', (req, res) => {
    const { id } = req.params;
    const anomaly = anomalies.find(a => a.id === id);
    if (anomaly) {
        anomaly.status = 'ACKNOWLEDGED';
        res.json({ success: true, anomaly });
    } else {
        res.status(404).json({ error: 'Anomaly not found' });
    }
});

export default router;
