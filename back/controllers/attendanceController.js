import { AttendanceModel } from '../models/attendanceModel.js';

export const createSession = async (req, res) => {
  const { courseId, sessionDate } = req.body;
  const lecturerId = req.user.userId;

  if (!courseId || !sessionDate) return res.status(400).json({ error: "Missing parameters." });

  try {
    const sessionId = await AttendanceModel.createSession(courseId, lecturerId, sessionDate);
    res.status(201).json({ message: "Attendance session opened.", sessionId });
  } catch (err) {
    res.status(500).json({ error: "Failed to open class session." });
  }
};

export const submitAttendance = async (req, res) => {
  const { sessionId, records } = req.body;
  if (!sessionId || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: "Malformed check data matrix payload." });
  }

  try {
    await AttendanceModel.bulkInsertRecords(sessionId, records);
    res.json({ message: "Attendance records synchronized successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed processing roll-call metrics." });
  }
};

export const generateOTP = async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Session ID required." });

  try {
    // Generate a random 4-digit number code string
    const randomOTP = Math.floor(1000 + Math.random() * 9000).toString();
    await AttendanceModel.setSessionOTP(sessionId, randomOTP);
    res.json({ message: "OTP code generated successfully.", otpCode: randomOTP });
  } catch (err) {
    console.error("❌ OTP Gen Error:", err);
    res.status(500).json({ error: "Failed to generate session security token." });
  }
};

export const submitStudentOTP = async (req, res) => {
  const { otpCode } = req.body;
  const studentId = req.user.userId; // Extracted safely from token payload wrapper

  if (!otpCode) return res.status(400).json({ error: "OTP code field required." });

  try {
    const result = await AttendanceModel.verifyStudentOTP(studentId, otpCode);
    if (!result.success) return res.status(400).json({ error: result.error });
    res.json({ message: result.message });
  } catch (err) {
    console.error("❌ Student Self-Check Error:", err);
    res.status(500).json({ error: "Self-attendance logging routine failed." });
  }
};