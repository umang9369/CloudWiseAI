import { Router } from 'express';
import { anomalies } from '../data/mockData';

const router = Router();

router.get('/', (req, res) => {
    res.json(anomalies);
});

export default router;
