import { useEffect, useState } from "react";
import api from "../services/api";

const OtpGenerator = ({courseId})=>{

    const [activeOTP, setActiveOTP] = useState('');
    // 🔑 Added States for Visual Countdown Sync
    const [timeLeft, setTimeLeft] = useState(600); // 600 seconds = 10 minutes
    const [isTimerActive, setIsTimerActive] = useState(false);

    // ⏱️ 1. Handle Ticking Countdown Interval Loops
    useEffect(() => {
        let interval = null;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
        }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTimerActive(false);
            setActiveOTP(''); // Automatically clear the display string when time expires
        }
      
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft]);

    const triggerOTPGeneration = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const sessionResponse = await api.post('/attendance/otp/generate', { courseId, sessionDate: today });
            const { sessionId } = sessionResponse.data;
            
            const otpResponse = await api.post('/attendance/otp/create-code', { sessionId });
            
            setActiveOTP(otpResponse.data.otpCode);
            setTimeLeft(600); // Reset timer tracking to 10 minutes flat
            setIsTimerActive(true); // Initiate countdown loop
        } catch (err) {
            console.error("Failed setting up session OTP:", err);
        }
    };

    // 📝 Helper to format seconds string cleanly to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return(
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <h4 className="font-bold text-emerald-900 text-sm">Automate with Student Self-Check-In</h4>
                <p className="text-xs text-emerald-700 mt-0.5">Generate a 10-minute expiring secure code students can submit from their portals.</p>
            </div>

            {activeOTP ? (
                <div className="text-center sm:text-right">
                    <span className="text-2xl font-black tracking-widest bg-white border-2 border-emerald-300 text-emerald-600 px-4 py-1.5 rounded-lg shadow-sm block font-mono">
                        {activeOTP}
                    </span>
                    {/* ⏰ Clock Insertion Layout Element */}
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 mt-1.5 inline-block">
                        ⏳ Expires In: {formatTime(timeLeft)}
                    </span>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={triggerOTPGeneration}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shrink-0"
                >
                    🔑 Generate Check-In Code
                </button>
            )}
        </div>
    )
}

export default OtpGenerator;