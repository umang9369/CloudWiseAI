import { Router } from 'express';
import { ingestionLogs } from '../data/mockData';

const router = Router();

router.get('/', (req, res) => {
    res.json(ingestionLogs);
});

export default router;
