import { Router } from 'express';
import { settings } from '../data/mockData';

const router = Router();

router.get('/', (req, res) => {
    res.json(settings);
});

router.post('/toggle', (req, res) => {
    const { providerId } = req.body;
    const provider = settings.providers.find(p => p.id === providerId);
    if (provider) {
        provider.status = provider.status === 'CONNECTED' ? 'CONFIGURE' : 'CONNECTED';
        res.json({ success: true, provider });
    } else {
        res.status(404).json({ error: 'Provider not found' });
    }
});

export default router;
