import express from 'express';
import { createSession, generateOTP, submitAttendance, submitStudentOTP } from '../controllers/attendanceController.js';
import { verifyToken } from '../middleware/auth.js';

const attendanceRouter = express.Router();

// 🛡️ Lock down all downstream paths with our token gatekeeper
attendanceRouter.use(verifyToken);

// Endpoints assume a base path of /api/attendance
attendanceRouter.post('/session/new', createSession);
attendanceRouter.post('/submit', submitAttendance);
attendanceRouter.post('/otp/create-code', generateOTP);
attendanceRouter.post('/otp/verify', submitStudentOTP);

export default attendanceRouter;