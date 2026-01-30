import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Regularize = () => {

    const navigate = useNavigate()

    const user_id = sessionStorage.getItem("user_id")
    const [formData, setFormData] = useState({
        user_id: user_id,
        request_date: "",
        request_type: "",
        comments: "",    
    });
    const [apiError, setApiError] = useState("")
    const [absentDates, setAbsentDates] = useState([])
    const [pls, setPls] = useState({})

    const request_types = ["LOP","WFH","PL"]

    const handleChange = (e) => {
        const { name, value } = e.target;

        if(name === "request_date"){
            const dateExists = absentDates.some(record => {
                const dateToParse = record.date ? record.date : record;

                if (!dateToParse) return false;

                const d = new Date(dateToParse);
                if (isNaN(d.getTime())) return false;

                const recordDate = d.toISOString().split("T")[0];
                return recordDate === value;
            });

            if (!dateExists) {
                alert("You are not absent on this date!");
                return;
            }
        }

        if (name === "request_type" && value === "PL"){
            if(pls.pl_count >= pls.leave_count){
                alert("You don't have any leaves this month");
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const send_request = async (payload) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/send-request`, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Request send failed");
            }
            navigate("/home");
            alert("Request Send Successfully!!...")

        } catch (error) {
            setApiError(error.message)
        }
    } 

    const handleSubmit = (e) => {
        e.preventDefault();
        const isAnyFieldEmpty = Object.values(formData).some(value => {
            return value === "" || value === null || (value.trim() === "");
        });

        if (isAnyFieldEmpty) {
            alert("Please provide all the details.");
            return;
        }

        send_request(formData)
    };

    useEffect(()=>{
        const get_absent_dates = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/check-absent-dates`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id }),
                })
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.detail || "Can't fetch the attendance");
                }
                const data = await res.json()
                setAbsentDates(data)
            } catch (error) {
                console.error(error)
            }
        }

        const check_pls = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/check-pls`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id }),
                })
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.detail || "Can't fetch the attendance");
                }
                const data = await res.json()
                setPls(data)
            } catch (error) {
                console.error(error)
            }
        }

        check_pls()
        get_absent_dates()
    },[user_id])

    return(
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Request Form
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Request Date
                            </label>
                            <input
                                type="date"
                                name="request_date"
                                max={new Date().toISOString().split("T")[0]}
                                value={formData.request_date}
                                onChange={handleChange}
                                placeholder="dd-mm-yyyy"
                                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Request Type
                            </label>
                            <select
                                name="request_type"
                                value={formData.request_type}
                                onChange={handleChange}
                                className="flex-1 mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all"
                            >
                                <option value="" disabled>Select Request Type</option>
                                {request_types.map(role => (
                                    <option className="font-medium" key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                            <span className="block text-sm text-gray-600 mt-1 ml-2">Remaining Paid Leaves : {pls.leave_count - pls.pl_count}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Comments
                            </label>
                            <input
                                type="text"
                                name="comments"
                                value={formData.comments}
                                onChange={handleChange}
                                placeholder="Comments"
                                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                            />
                        </div>

                        {apiError && (
                            <p className="text-sm text-center text-red-600">
                                {apiError}
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gray-300 font-semibold py-2 shadow-md rounded-xl transition"
                        >
                            Send Request
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Regularize