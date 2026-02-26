import { Router } from 'express';
import { chatHistory } from '../data/mockData';

const router = Router();

router.get('/history', (req, res) => {
    res.json(chatHistory);
});

router.post('/ask', (req, res) => {
    const { text } = req.body;

    // Add User message
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date().toISOString() };
    chatHistory.push(userMsg);

    let aiResponse = "I'm analyzing your request...";
    if (text.toLowerCase().includes('spike')) {
        aiResponse = "I see a 340% spike in EC2 costs on Jan 14th due to a runaway cron job scaling up 4 instances.";
    } else if (text.toLowerCase().includes('savings')) {
        aiResponse = "You can save immediately by downgrading your m5.4xlarge instances. Would you like me to draft an infrastructure-as-code PR for this?";
    } else {
        aiResponse = "Based on our last sync, your run rate is tracking 12% above last month. Focus on the Top Cost Drivers shown on the dashboard.";
    }

    const aiMsg = { id: Date.now() + 1, role: 'ai', text: aiResponse, time: new Date().toISOString() };
    chatHistory.push(aiMsg);

    setTimeout(() => {
        res.json({ success: true, message: aiMsg });
    }, 1500);
});

export default router;
