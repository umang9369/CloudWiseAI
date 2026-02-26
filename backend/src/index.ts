import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard';
import anomaliesRoutes from './routes/anomalies';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/anomalies', anomaliesRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CloudWise AI Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
