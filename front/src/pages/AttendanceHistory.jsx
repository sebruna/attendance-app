import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

export default function AttendanceHistory() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [report, setReport] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

  const {courseId} = useParams();

  useEffect(() => {
    api.get(`/academic/history/${courseId}`)
      .then(res => { setSessions(res.data); setLoadingSessions(false); })
      .catch(err => console.error("Error fetching history:", err));
  }, [courseId]);

  const handleViewReport = (sessionId) => {
    setSelectedSessionId(sessionId);
    setLoadingReport(true);
    api.get(`/academic/report/${sessionId}`)
      .then(res => { setReport(res.data); setLoadingReport(false); })
      .catch(err => console.error("Error fetching report:", err));
  };

  // 📄 EXPORT TO SPREADSHEET LOGIC FUNCTION
  const exportToCSV = () => {
    if (report.length === 0) return;

    // Find current session date for file naming context rules
    const currentSession = sessions.find(s => s.id === selectedSessionId);
    const dateStr = currentSession ? new Date(currentSession.session_date).toLocaleDateString().replace(/\//g, '-') : 'session';

    // Define CSV header string layout
    const headers = ['Full Name', 'Student Number', 'Registration Number', 'Attendance Status\n'];
   
    // Map records into plain comma-separated strings rows arrays
    const rows = report.map(record => [
      `"${record.name.replace(/"/g, '""')}"`, // Wrap names in quotes to avoid breaking on inner commas
      `"${record.student_number}"`,
      `"${record.reg_number}"`,
      record.status.toUpperCase()
    ].join(','));

    const csvContent = headers.concat(rows).join('\n');
   
    // Create an inline downloadable blob pipeline data stream trigger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
   
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_Report_Course_${courseId}_Date_${dateStr}.csv`);
    link.style.visibility = 'hidden';
   
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingSessions) return <div className="p-6 text-center text-gray-500">Loading historical dates...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-4">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Panel List */}
        <div className="md:col-span-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h3 className="font-bold text-gray-800 mb-3 text-lg">Past Class Dates</h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-400">No sessions recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map(session => (
                (session.total_count > 0 && <button
                  key={session.id}
                  onClick={() => handleViewReport(session.id)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${
                    selectedSessionId === session.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium'
                      : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <p className="font-semibold">{new Date(session.session_date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Attended: {session.present_count} / {session.total_count} students
                  </p>
                </button>)
              ))}
            </div>
          )}
        </div>

        {/* Right Side Sheet Panel View Area */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-800 text-lg">Detailed Attendance Sheet</h3>
           
            {/* Show export button only if a report is actually loaded into state view */}
            {selectedSessionId && !loadingReport && report.length > 0 && (
              <button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm"
              >
                📥 Export Sheet (.CSV)
              </button>
            )}
          </div>

          {!selectedSessionId ? (
            <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
              Select a date on the left panel to review specific student marks.
            </div>
          ) : loadingReport ? (
            <div className="text-center py-12 text-gray-500 text-sm">Loading sheet records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="text-gray-400 uppercase text-xs tracking-wider">
                    <th className="pb-3 font-semibold">Student Details</th>
                    <th className="pb-3 font-semibold">Reg / Student No</th>
                    <th className="pb-3 font-semibold text-right">Status Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {report.map(record => (
                    <tr key={record.record_id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 font-medium text-gray-800">{record.name}</td>
                      <td className="py-3 text-xs text-gray-500">
                        <div>{record.reg_number}</div>
                        <div className="text-gray-400">{record.student_number}</div>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full uppercase ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' :
                          record.status === 'absent' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}