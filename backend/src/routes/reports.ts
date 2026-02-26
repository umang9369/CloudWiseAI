import { Router } from 'express';
import { reports } from '../data/mockData';

const router = Router();

router.get('/', (req, res) => {
    res.json(reports);
});

export default router;
