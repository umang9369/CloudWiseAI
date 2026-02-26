import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard';
import anomaliesRoutes from './routes/anomalies';
import recommendationsRoutes from './routes/recommendations';
import simulatorRoutes from './routes/simulator';
import queryRoutes from './routes/query';
import reportsRoutes from './routes/reports';
import ingestionRoutes from './routes/ingestion';
import settingsRoutes from './routes/settings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/anomalies', anomaliesRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/ingestion', ingestionRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
    res.send('CloudWise AI API is running. Access endpoints under /api/*');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CloudWise AI Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
