import pool from '../config/db.js';

export const CourseStudentModel = {
  // Get all courses assigned to a specific lecturer
  async getCoursesByLecturer(lecturerId) {
    const [rows] = await pool.query(
      'SELECT id, course_code, course_name FROM courses WHERE lecturer_id = ?',
      [lecturerId]
    );
    return rows;
  },

  // Get a complete student roster list for roll call
async getStudentsByCourse(courseId) {
  const query = `
    SELECT s.id, s.student_number, s.reg_number, s.name
    FROM students s
    INNER JOIN enrollments e ON s.id = e.student_id
    WHERE e.course_id = ?
    ORDER BY s.name ASC
  `;
  const [rows] = await pool.query(query, [courseId]);
  return rows;
},

  // View past attendance statistics for a specific course session
  async getSessionAttendanceReport(sessionId) {
    const query = `
      SELECT r.id AS record_id, s.name, s.student_number, s.reg_number, r.status
      FROM attendance_records r
      JOIN students s ON r.student_id = s.id
      WHERE r.session_id = ?
      ORDER BY s.name ASC
    `;
    const [rows] = await pool.query(query, [sessionId]);
    return rows;
  },
  // 📚 Add a new course to the university catalog
  async createCourse({ course_code, course_name, lecturer_id }) {
    const [result] = await pool.query(
      'INSERT INTO courses (course_code, course_name, lecturer_id) VALUES (?, ?, ?)',
      [course_code, course_name, lecturer_id]
    );
    return result.insertId;
  },

  // 🎓 Register a student into the master registry
  async createStudent({ student_number, reg_number, name }) {
    const [result] = await pool.query(
      'INSERT INTO students (student_number, reg_number, name) VALUES (?, ?, ?)',
      [student_number, reg_number, name]
    );
    return result.insertId;
  },
  // 🔗 Enroll a student into a specific course
  async enrollStudent({ student_id, course_id }) {
    const [result] = await pool.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [student_id, course_id]
    );
    return result.insertId;
  },
    // 📊 Fetch summary metrics for a specific lecturer
  async getLecturerMetrics(lecturerId) {
    // Count total courses
    const [courses] = await pool.query('SELECT COUNT(*) AS total FROM courses WHERE lecturer_id = ?', [lecturerId]);
   
    // Count total unique students enrolled in those courses
    const [students] = await pool.query(`
      SELECT COUNT(DISTINCT e.student_id) AS total
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.lecturer_id = ?
    `, [lecturerId]);

    // Count total attendance sessions conducted
    const [sessions] = await pool.query('SELECT COUNT(*) AS total FROM attendance_sessions WHERE lecturer_id = ?', [lecturerId]);

    return {
      totalCourses: courses[0].total,
      totalStudents: students[0].total,
      totalSessions: sessions[0].total
    };
  },
    // 🗓️ Fetch all past attendance sessions for a specific course
  async getCourseSessions(courseId) {
    const query = `
      SELECT s.id, s.session_date,
             COUNT(CASE WHEN r.status = 'present' THEN 1 END) AS present_count,
             COUNT(r.id) AS total_count
      FROM attendance_sessions s
      LEFT JOIN attendance_records r ON s.id = r.session_id
      WHERE s.course_id = ?
      GROUP BY s.id, s.session_date
      ORDER BY s.session_date DESC
    `;
    const [rows] = await pool.query(query, [courseId]);
    return rows;
  },
};