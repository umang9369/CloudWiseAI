import { Router } from 'express';
import { recommendations } from '../data/mockData';

const router = Router();

router.get('/', (req, res) => {
    res.json(recommendations);
});

router.post('/:id/apply', (req, res) => {
    const { id } = req.params;
    const rec = recommendations.find(r => r.id === id);
    if (rec) {
        rec.status = 'APPLIED';
        res.json({ success: true, recommendation: rec });
    } else {
        res.status(404).json({ error: 'Recommendation not found' });
    }
});

export default router;
