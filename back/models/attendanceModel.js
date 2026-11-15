import pool from '../config/db.js';

export const AttendanceModel = {
  // Insert a new classroom tracking block session
  async createSession(courseId, lecturerId, sessionDate) {
    const [result] = await pool.query(
      'INSERT INTO attendance_sessions (course_id, lecturer_id, session_date) VALUES (?, ?, ?)',
      [courseId, lecturerId, sessionDate]
    );
    return result.insertId;
  },

  // 🔑 Save a generated OTP code to a session (expires in 10 minutes)
  async setSessionOTP(sessionId, otpCode) {
    const query = `
      UPDATE attendance_sessions
      SET otp_code = ?, otp_expiry = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [otpCode, sessionId]);
    return result;
  },
  

  // 🎓 Student validation check against active codes
  async verifyStudentOTP(studentId, otpCode) {
    // Look up an active, unexpired session matching the OTP
    const sessionQuery = `
      SELECT id, course_id FROM attendance_sessions
      WHERE otp_code = ? AND otp_expiry > NOW()
    `;
    const [sessions] = await pool.query(sessionQuery, [otpCode]);
    if (sessions.length === 0) return { success: false, error: "Invalid or expired OTP code." };

    const session = sessions[0];

    // Check if the student is actually enrolled in this course
    const enrollmentQuery = 'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?';
    const [enrollments] = await pool.query(enrollmentQuery, [studentId, session.course_id]);
    if (enrollments.length === 0) return { success: false, error: "You are not enrolled in this course." };

    // Insert or update attendance record as 'present'
    const recordQuery = `
      INSERT INTO attendance_records (session_id, student_id, status, marked_by)
      VALUES (?, ?, 'present', 'otp')
      ON DUPLICATE KEY UPDATE status = 'present', VALUES(marked_by)
    `;
    await pool.query(recordQuery, [session.id, studentId]);
    return { success: true, message: "Attendance marked successfully!" };
  },

  // Bulk upsert attendance records checklist
  async bulkInsertRecords(sessionId, records) {
    const values = records.map(rec => [sessionId, rec.studentId, rec.status || 'absent', 'lecturer']);
    const query = `
      INSERT INTO attendance_records (session_id, student_id, status, marked_by)
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        status = CASE 
                   WHEN attendance_records.marked_by = 'otp' AND attendance_records.status = 'present' 
                   THEN attendance_records.status 
                   ELSE VALUES(status) 
                 END,
        marked_by = CASE 
                      WHEN attendance_records.marked_by = 'otp' AND attendance_records.status = 'present' 
                      THEN attendance_records.marked_by 
                      ELSE VALUES(marked_by) 
                    END
    `;
    const [results] = await pool.query(query, [values]);
    return results;
  },
};
