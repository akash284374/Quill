// server/src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import followRoutes from './routes/followRoutes.js'; // ✅ added follow routes

dotenv.config();

const app = express(); // ✅ app must be defined first

// ------------------- MIDDLEWARES -------------------
app.use(cors({
    origin: 'http://localhost:5173', // React frontend
    credentials: true,               // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

// ------------------- ROUTES -------------------
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follow', followRoutes); // ✅ mounted follow routes

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;
