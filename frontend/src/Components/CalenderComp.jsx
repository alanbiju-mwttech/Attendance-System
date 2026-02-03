import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const statusStyles = {
    WFH: "bg-green-100 text-green-700",
    PR: "bg-blue-100 text-blue-700",
    AB: "bg-red-100 text-red-700",
    LOP: "bg-red-200 text-red-800",
    PL: "bg-pink-100 text-pink-700",
    EL: "bg-purple-200 text-purple-900",
    CL: "bg-amber-200 text-amber-700",
    SL: "bg-pink-100 text-pink-700",
    WO: "bg-gray-300 text-black",
};

const CalenderComp = () => {
    const [attendanceData, setAttendanceData] = useState([]);

    const STATUS_ABBREVIATIONS = {
        "Work From Home": "WFH",
        "Loss of Pay": "LOP",
        "Paid Leave": "PL",
        "Casual Leave": "CL",
        "Sick Leave": "SL",
        "Earned Leave": "EL",
        "Absent": "AB",
        "Week Off": "WO",
        "Present": "PR",
    };

    useEffect(() => {
        const getAttendance = async () => {
            const user_id = sessionStorage.getItem("user_id");

            const res = await fetch(`http://127.0.0.1:8000/view-attendance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id }),
            });

            const data = await res.json();
            setAttendanceData(data);
        };

        getAttendance();
    }, []);

    const tileContent = ({ date, view }) => {
        if (view !== "month") return null;

        if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
            return null;
        }

        const record = attendanceData.find((r) =>
            new Date(r.date).toDateString() === date.toDateString()
        );

        if (!record) return null;

        const shortStatus =
            STATUS_ABBREVIATIONS[record.status] || record.status;

        return (
            <div className="flex justify-center mt-1">
                <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-lg font-semibold ${statusStyles[shortStatus]}`}
                >
                    {shortStatus}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-slate-700">
                    Attendance Calendar
                </h2>
                <p className="text-sm text-slate-500">Your monthly attendance overview</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-xs font-medium">
                {Object.entries(statusStyles).map(([key, style]) => (
                    <span key={key} className={`px-3 py-1 rounded-full shadow-sm ${style}`}>
                        {key}
                    </span>
                ))}
            </div>

            <div className="flex justify-center">
                <Calendar
                    tileContent={tileContent}
                    className="rounded-2xl border-0 shadow-md p-4 bg-white"
                />
            </div>
        </div>
    );
      
};

export default CalenderComp;