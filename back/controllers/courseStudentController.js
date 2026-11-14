import { CourseStudentModel } from '../models/courseStudentModel.js';

// Fetch courses for the logged-in lecturer
export const getMyCourses = async (req, res) => {
  try {
    const lecturerId = req.user.userId;
    const courses = await CourseStudentModel.getCoursesByLecturer(lecturerId);
    res.json(courses);
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res.status(500).json({ error: "Failed to retrieve lecturer course assignments." });
  }
};

// Fetch student list for the attendance checklist layout
export const getStudentRoster = async (req, res) => {
  const { courseId } = req.query; // Capture ?courseId=1 from the URL frontend request

  if (!courseId) {
    return res.status(400).json({ error: "Course ID parameter is required." });
  }

  try {
    const students = await CourseStudentModel.getStudentsByCourse(courseId);
    res.json(students);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ error: "Failed to retrieve student class roll." });
  }
};

// Fetch historical records for a specific class date session
export const getSessionReport = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const report = await CourseStudentModel.getSessionAttendanceReport(sessionId);
    res.json(report);
  } catch (err) {
    console.error("❌ Error fetching sheet report:", err);
    res.status(500).json({ error: "Failed to retrieve class list records." });
  }
};

export const addCourse = async (req, res) => {
  try {
    const courseId = await CourseStudentModel.createCourse(req.body);
    res.status(201).json({ message: "Course added successfully!", courseId });
  } catch (err) {
    console.error("❌ Add Course Error:", err);
    res.status(500).json({ error: "Failed to add course configuration." });
  }
};

export const addStudent = async (req, res) => {
  try {
    const studentId = await CourseStudentModel.createStudent(req.body);
    res.status(201).json({ message: "Student registered successfully!", studentId });
  } catch (err) {
    console.error("❌ Add Student Error:", err);
    res.status(500).json({ error: "Failed to register student record." });
  }
};

export const enrollStudentToCourse = async (req, res) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({ error: "Both student_id and course_id are required." });
  }

  try {
    const enrollmentId = await CourseStudentModel.enrollStudent({ student_id, course_id });
    res.status(201).json({ message: "Student successfully enrolled in course!", enrollmentId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "This student is already enrolled in this course." });
    }
    console.error("❌ Enrollment Error:", err);
    res.status(500).json({ error: "Failed to create enrollment record." });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const lecturerId = req.user.userId;
    const metrics = await CourseStudentModel.getLecturerMetrics(lecturerId);
    res.json(metrics);
  } catch (err) {
    console.error("❌ Metrics Fetch Error:", err);
    res.status(500).json({ error: "Failed to compile dashboard metrics stats." });
  }
};

export const getCourseHistory = async (req, res) => {
  const { courseId } = req.params;

  try {
    const sessions = await CourseStudentModel.getCourseSessions(courseId);
    res.json(sessions);
  } catch (err) {
    console.error("❌ History Fetch Error:", err);
    res.status(500).json({ error: "Failed to retrieve course session history logs." });
  }
};

/*{
  "course_code": "BIT 3104",
  "course_name": "Advanced Web Development",
  "lecturer_id": 1
}
{
  "student_number": "2300100456",
  "reg_number": "23/U/14521/EVE",
  "name": "Mukasa John"
}*/