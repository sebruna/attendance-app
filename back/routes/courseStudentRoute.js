import express from 'express';
import { getMyCourses, getStudentRoster, getSessionReport, addCourse, addStudent, enrollStudentToCourse, getDashboardMetrics, getCourseHistory } from '../controllers/courseStudentController.js';
import { verifyToken } from '../middleware/auth.js';

const courseStudentRouter = express.Router();

// Secure all downstream routes with our JWT gatekeeper
courseStudentRouter.use(verifyToken);

courseStudentRouter.get('/my-courses', getMyCourses);
courseStudentRouter.get('/students', getStudentRoster);
courseStudentRouter.get('/report/:sessionId', getSessionReport);
// Add these right under the router.use(verifyToken); line
courseStudentRouter.post('/courses/add', addCourse);
courseStudentRouter.post('/students/add', addStudent);
courseStudentRouter.post('/enroll', enrollStudentToCourse);
courseStudentRouter.get('/dashboard-metrics', getDashboardMetrics);
courseStudentRouter.get('/history/:courseId', getCourseHistory);

export default courseStudentRouter;