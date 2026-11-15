import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const Dashboard = ({user})=>{

    const [courses, setCourses] = useState([]);

    useEffect(() => {
    if(user){
        api.get('/academic/my-courses')
        .then(res => setCourses(res.data))
        .catch(err => console.error("Error loading courses:", err));

      // 📥 FETCH THE NEW METRICS HERE
      api.get('/academic/dashboard-metrics')
        .then(res => setMetrics(res.data))
        .catch(err => console.error("Error loading metrics:", err));
    }
  }, [user]);

    const [metrics, setMetrics] = useState({ totalCourses: 0, totalStudents: 0, totalSessions: 0 });
    const dashData = [{name:'Total Courses', value:metrics.totalCourses, emoji:'📚', color:'bg-blue-50'},
                      {name:'Total Sessions', value:metrics.totalSessions, emoji:'📆', color:'bg-green-50'},
                      {name:'Total Students', value:metrics.totalStudents, emoji:'👥', color:'bg-red-50'},
    ]
    return(
        <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {dashData.map((d)=>(
                <div key={d.name} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{d.name}</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{d.value}</h3>
                    </div>
                    <div className={`text-2xl p-3 ${d.color} rounded-lg`}>
                        {d.emoji}
                    </div>
                </div>
            ))}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Assigned Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition">
                        <div className="mb-4">
                            <span className="text-xs font-bold text-emerald-600 uppercase">{course.course_code}</span>
                            <h3 className="font-bold text-lg text-gray-800">{course.course_name}</h3>
                        </div>
                        <div className="flex gap-2">
                            <Link
                              to={`/take-attendance/${course.id}`}
                              onClick={()=>localStorage.removeItem('sessionId')}
                              className="flex-1 bg-emerald-600 text-white py-2 pl-4 text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
                            >
                              Take Attendance
                            </Link>
                            <Link
                              to={`/history/${course.id}`}
                              className="bg-gray-100 text-gray-700 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                            >
                              📊 History 
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Dashboard;