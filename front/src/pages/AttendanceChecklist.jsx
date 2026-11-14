import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import OtpGenerator from '../components/OtpGenerator';

export default function AttendanceChecklist() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // Stores studentId: status mapping
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const {courseId} = useParams();

  // 2. Fetch student list on mounting layout
  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const response = await api.get(`/academic/students?courseId=${courseId}`);
        setStudents(response.data);
       
        // Initialize all students to 'present' by default layout rules
        const defaultStatus = {};
        response.data.forEach(student => {
          defaultStatus[student.id] = 'absent';
        });
        setAttendance(defaultStatus);
      } catch (err) {
        console.error("❌ Failed to fetch student roster:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, [courseId]); // Added courseId dependency to keep layout warnings clean
  

  // 4. Handle switching status arrays on button click
  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // 5. Package and Bulk Submit Checklist
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const today = new Date().toISOString().split('T')[0];
      const sessionResponse = await api.post('/attendance/session/new', {
        courseId,
        sessionDate: today
      });
      const { sessionId } = sessionResponse.data;

      const records = Object.keys(attendance).map(studentId => ({
        studentId: parseInt(studentId),
        status: attendance[studentId]
      }));

      await api.post('/attendance/submit', { sessionId, records });
     
      setMessage('🎉 Attendance synchronized and saved successfully!');
    } catch (err) {
      console.error("❌ Submission error:", err);
      setMessage('❌ Failed to save attendance to institutional registry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading student sheets roster...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Roll Call Checklist</h2>
            <p className="text-sm text-gray-400">Date: {new Date().toLocaleDateString()}</p>
          </div>
          {message && <span className="text-sm font-medium px-3 py-1 rounded bg-emerald-50 text-emerald-700">{message}</span>}
        </div>

        {/* OTP Generation Box layout control */}
        <OtpGenerator courseId={courseId}/>

        <form onSubmit={handleSubmit}>
          <div className="divide-y divide-gray-100 mb-6">
            {students.map((student) => (
              <div key={student.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800">{student.name}</h4>
                  <p className="text-xs text-gray-400">{student.student_number} | {student.reg_number}</p>
                </div>
               
                {/* Status Selection Buttons */}
                <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
                  {['present', 'absent', 'excused'].map((status) => {
                    const isActive = attendance[student.id] === status;
                    const activeColors =
                      status === 'present' ? 'bg-green-600 text-white shadow' :
                      status === 'absent' ? 'bg-red-600 text-white shadow' :
                      'bg-yellow-500 text-white shadow';
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(student.id, status)}
                        className={`px-3 py-1 text-xs font-semibold capitalize rounded-md transition-all duration-150 ${
                          isActive ? activeColors : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:bg-green-400"
          >
            {submitting ? "Synchronizing Sheet..." : "Submit Completed Roll Call"}
          </button>
        </form>
      </div>
    </div>
  );
}