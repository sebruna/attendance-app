import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import AttendanceChecklist from './pages/AttendanceChecklist';
import { authService } from './services/authService';
import api from './services/api';
import AttendanceHistory from './pages/AttendanceHistory';
import StudentCheckIn from './pages/StudentCheckIn';
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import AttendanceDashboard from './pages/AttendanceDashboard';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

export default function App() {
  const [user, setUser] = useState(null);
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);
  

  if (!user) return <Login onLoginSuccess={(u) => setUser(u)} />;

  return (
    <>
      <div className="min-h-screen bg-gray-50">

        <NavBar user={user} setUser={setUser} authService={authService}/>

        <main className="p-6">
          <Routes>
            {user.role === 'student' && (<Route path='/' element={<StudentCheckIn />} /> )}
            {user.role === 'lecturer' && (
            <Route path='/' element={<AttendanceDashboard  />} >
                <Route path='/' element={<Dashboard user={user} setCourseId={setCourseId}/>} />
                <Route path='/take-attendance/:courseId' element={<AttendanceChecklist courseId={courseId} />} />
                <Route path='/history/:courseId' element={<AttendanceHistory courseId={courseId} />} />
            </Route> )}
          </Routes>
        </main>
      </div>
      <Footer/>
    </>
  );
}

// john.admin@univ.ac.ug
// patricia.akello@univ.ac.ug
// ivanmukasa@univ.ac.ug