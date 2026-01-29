import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, CalendarDaysIcon, UserIcon } from "@heroicons/react/24/solid";

const ReviewRequest = () =>{

    const { request_id } = useParams()
    const [request, setRequest] = useState([])
    const user_id = sessionStorage.getItem('user_id')
    const navigate = useNavigate()

    const statusColors = {
        Pending: "bg-yellow-100 text-yellow-700",
        Approved: "bg-green-100 text-green-700",
        Rejected: "bg-red-100 text-red-700",
    };

    const onApprove = async() =>{
        try {
            const res = await fetch(`http://127.0.0.1:8000/request/approve`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({request_id: request_id, user_id: user_id})
            })
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Can't accept the request!!..");
            }
            navigate(-1)
            alert('Sussessfully approved the request')
        } catch (error) {
            console.error(error)
        }
    }

    const onReject = async() =>{
        try {
            const res = await fetch(`http://127.0.0.1:8000/request/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ request_id: request_id, user_id: user_id })
            })
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Can't reject the request!!..");
            }
            navigate(-1)
            alert('Sussessfully rejected the request')
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        const get_requests = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/request/${request_id}/view`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.detail || "Can't fetch the attendance");
                }
                const data = await res.json()
                console.log(data)
                setRequest(data)
            } catch (error) {
                console.error(error)
            }
        }

        get_requests()
    },[request_id])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

                {/* Header */}
                <div className="bg-slate-800 text-white p-6">
                    <h2 className="text-2xl font-semibold tracking-wide">
                        Leave / WFH Request
                    </h2>
                    <p className="text-sm text-slate-300 mt-1">
                        Review and take action
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Status Badge */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            Request ID: <span className="font-medium text-gray-800">{request.request_id}</span>
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[request.status]}`}>
                            {request.status}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                        <InfoCard icon={<UserIcon className="h-5 w-5 text-slate-600" />} label="Employee ID" value={request.user_id} />

                        <InfoCard
                            icon={<CalendarDaysIcon className="h-5 w-5 text-slate-600" />}
                            label="Request Date"
                            value={new Date(request.request_date).toLocaleDateString()}
                        />

                        <InfoCard label="Request Type" value={request.request_type} />

                        <InfoCard
                            label="Applied On"
                            value={new Date(request.applied_at).toLocaleString()}
                        />
                    </div>

                    {/* Comments */}
                    {request.comments && (
                        <div className="bg-slate-50 border rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">Employee Comment</p>
                            <p className="text-sm text-gray-800">{request.comments}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {request.status === "Pending" && (
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => onApprove(request.request_id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl shadow-md transition"
                            >
                                <CheckCircleIcon className="h-5 w-5" />
                                Approve
                            </button>

                            <button
                                onClick={() => onReject(request.request_id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl shadow-md transition"
                            >
                                <XCircleIcon className="h-5 w-5" />
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, label, value }) => (
    <div className="border rounded-lg p-3 bg-white shadow-sm flex items-start gap-3">
        {icon}
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-medium text-gray-800">{value}</p>
        </div>
    </div>
    );


export default ReviewRequest