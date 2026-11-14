import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import courseStudentRouter from './routes/courseStudentRoute.js';
import attendanceRouter from './routes/attendanceRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Essential payload parsing filtering block

// Core Route Mount Points
app.use('/api/user', userRouter);
app.use('/api/academic', courseStudentRouter);
app.use('/api/attendance', attendanceRouter);

// Base sanity check probe route
app.get('/health', (req, res) => {
  res.send( `Online ➡▶ Attendance App Backend Running on edrine logic` );
});

// Run Execution Layout
app.listen(PORT, 0,0,0,0, () => {
  console.log(`🚀 Online Attendance Server running directly on port http://localhost:${PORT}`);
});