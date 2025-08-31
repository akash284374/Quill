// server/src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express(); // ✅ app must be defined first

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173', // React frontend
    credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // ✅ Moved after app is defined

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;
