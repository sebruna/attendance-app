import React, { useState } from 'react';
import api from '../services/api';

export default function StudentCheckIn() {
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusReport, setStatusReport] = useState(null); // Tracks: null, 'success', 'far_away', 'gps_disabled'
  const [distanceText, setDistanceText] = useState('');

  const handleCheckIn = (e) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.length !== 4) return;

    setLoading(true);
    setStatusReport(null);

    if (!navigator.geolocation) {
      setStatusReport('gps_disabled');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await api.post('/attendance/otp/verify', {
            otpCode,
            latitude,
            longitude
          });

          setStatusReport('success');
          setOtpCode('');
        } catch (err) {
          console.error(err);
          const errMsg = err.response?.data?.error || '';
         
          // Detect if the error is specifically our geofence distance rejection
          if (err.response?.status === 403 && errMsg.includes('away')) {
            setStatusReport('far_away');
            setDistanceText(errMsg); // Saves the "You are Xm away" message
          } else {
            setStatusReport('error');
            setDistanceText(errMsg || 'Failed to verify code.');
          }
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setLoading(false);
        setStatusReport('gps_disabled');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-gray-200 shadow-xl">
       
        {/* 1. DEFAULT ENTRY VIEW */}
        {!statusReport && (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 animate-pulse">
              📍
            </div>
            <h2 className="text-xl font-bold text-gray-800">Class Room Check-In</h2>
            <p className="text-xs text-gray-400 mt-1 px-4">
              Enter the 4-digit code given by your lecturer. Your physical presence will be verified automatically.
            </p>

            <form onSubmit={handleCheckIn} className="mt-6 space-y-4">
              <input
                type="text"
                maxLength="4"
                placeholder="0 0 0 0"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
                className="w-full text-center text-3xl font-black tracking-widest p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition bg-gray-50 uppercase placeholder-gray-300"
              />
              <button
                type="submit"
                disabled={loading || otpCode.length !== 4}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying Coordinates... 📡' : 'Confirm Attendance'}
              </button>
            </form>
          </div>
        )}

        {/* 2. SUCCESS VIEW */}
        {statusReport === 'success' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-xl font-bold text-gray-800">Verified Successfully!</h2>
            <p className="text-sm text-green-700 font-medium mt-2 bg-green-50 py-1.5 px-3 rounded-lg inline-block">
              Present
            </p>
            <p className="text-xs text-gray-400 mt-3 px-4">
              Your attendance record has been locked into the portal database for this session. You may close this tab.
            </p>
            <button
              onClick={() => setStatusReport(null)}
              className="mt-6 text-xs text-emerald-600 font-bold hover:underline"
            >
              Check in to another class
            </button>
          </div>
        )}

        {/* 3. OUTSIDE GEOFENCE RADIUS VIEW */}
        {statusReport === 'far_away' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🚪
            </div>
            <h2 className="text-xl font-bold text-gray-800">Outside Lecture Hall</h2>
            <p className="text-xs text-red-600 font-semibold mt-2 bg-red-50 p-2.5 rounded-xl border border-red-100">
              {distanceText}
            </p>
            <p className="text-xs text-gray-400 mt-4 px-2">
              The proxy fence prevents remote signing. If you are sitting inside the room, your phone's location provider might be inaccurate. Please step closer to the center of the hall and try again.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStatusReport(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-3 rounded-xl transition"
              >
                Change Code
              </button>
              <button
                onClick={() => handleCheckIn()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm"
              >
                🔄 Retry Check-In
              </button>
            </div>
          </div>
        )}

        {/* 4. GPS TURNED OFF / GENERIC ERROR VIEW */}
        {(statusReport === 'gps_disabled' || statusReport === 'error') && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-gray-800">Signal Error</h2>
            <p className="text-xs text-yellow-700 font-medium mt-2 bg-yellow-50 p-2.5 rounded-xl border border-yellow-100">
              {statusReport === 'gps_disabled'
                ? 'Device Location Services Disabled'
                : distanceText}
            </p>
            <p className="text-xs text-gray-400 mt-4 px-2">
              This system uses strict high-precision GPS positioning to verify your seat location. Ensure location access permissions are enabled for this browser in your phone's system settings.
            </p>
            <button
              onClick={() => setStatusReport(null)}
              className="mt-6 w-full bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-3 rounded-xl transition"
            >
              Back to Input
            </button>
          </div>
        )}

      </div>
    </div>
  );
}