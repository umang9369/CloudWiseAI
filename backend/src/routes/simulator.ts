import { Router } from 'express';

const router = Router();

router.post('/run', (req, res) => {
    const { instances, type } = req.body;

    // Simulate some logic
    const currentCost = instances * (type === 'compute' ? 120 : 50);
    const newCost = instances * (type === 'compute' ? 90 : 40);

    setTimeout(() => {
        res.json({
            success: true,
            currentCost,
            projectedCost: newCost,
            savings: currentCost - newCost,
            message: `Simulation complete. Migrating ${instances} instances to new tier.`
        });
    }, 1000); // Simulate processing time
});

export default router;
