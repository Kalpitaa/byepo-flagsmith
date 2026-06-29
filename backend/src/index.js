import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import superAdminRoutes from './routes/superAdmin.js';
import authRoutes from './routes/auth.js';
import featureFlagRoutes from './routes/featureFlags.js';
import organisationRoutes from './routes/organisations.js';

connectDB();

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'https://byepo-flagsmith-z68d.vercel.app',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Flagsmith API is running.' });
});

app.use('/api/super-admin', superAdminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/flags', featureFlagRoutes);
app.use('/api/organisations', organisationRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Flagsmith backend running on port ${PORT}`);
});

export default app;