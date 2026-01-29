import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const daysOfWeek = [
    { label: "Monday", value: 0 },
    { label: "Tuesday", value: 1 },
    { label: "Wednesday", value: 2 },
    { label: "Thursday", value: 3 },
    { label: "Friday", value: 4 },
    { label: "Saturday", value: 5 },
    { label: "Sunday", value: 6 }
];

const WorkScheduleSetup = () => {
    const [schedule, setSchedule] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate()

    // Load existing schedule
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/get-work-schedule");
                const data = await res.json();

                // Convert API response into {0:true,1:true,...}
                const formatted = {};
                data.forEach(day => {
                    formatted[day.day_of_week] = day.is_working;
                });

                setSchedule(formatted);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSchedule();
    }, []);

    const handleToggle = (dayValue) => {
        setSchedule(prev => ({
            ...prev,
            [dayValue]: !prev[dayValue]
        }));
    };

    const handleSubmit = async () => {
        setError("");
        setMessage("");

        try {
            const payload = daysOfWeek.map(day => ({
                day_of_week: day.value,
                is_working: schedule[day.value] ?? false
            }));

            const res = await fetch("http://127.0.0.1:8000/set-work-schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to save schedule");

            navigate('/home')
            setMessage("Work schedule updated successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 border">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                    Configure Working Days
                </h2>

                <div className="space-y-4">
                    {daysOfWeek.map(day => (
                        <label
                            key={day.value}
                            className="flex items-center justify-between p-4 rounded-xl border bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                        >
                            <span className="font-medium text-slate-700">{day.label}</span>
                            <input
                                type="checkbox"
                                checked={schedule[day.value] || false}
                                onChange={() => handleToggle(day.value)}
                                className="h-5 w-5 accent-blue-600 cursor-pointer"
                            />
                        </label>
                    ))}
                </div>

                {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
                {message && <p className="text-green-600 text-sm text-center mt-4">{message}</p>}

                <button
                    onClick={handleSubmit}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow-md transition"
                >
                    Save Schedule
                </button>
            </div>
        </div>
    );
};

export default WorkScheduleSetup;
