import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "./NavBar"

const AllRequests = () => {

    const [requests, setRequests] = useState([])
    const navigate = useNavigate()
    const get_all_requests = async() =>{
        const user_id = sessionStorage.getItem('user_id')
        try {
            const res = await fetch(`http://127.0.0.1:8000/get-requests`, {
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
            console.log(data)
            setRequests(data)
        } catch (error) {
            console.error(error)
        }
    }

    const review_Each_Request = (request_id) => {
        navigate(`/review-request/${request_id}`)
    }

    useEffect(()=>{
        get_all_requests()
    },[])

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return(
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4 md:px-10 pt-[110px] pb-10">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden pb-10">

                    <div className="px-6 py-6 flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-3xl max-md:text-xl font-bold text-gray-600">
                                All Requests
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 pr-3">
                                List of all requests to be reviewed.
                            </p>
                        </div>
                    </div>

                    <hr className="mx-6 mb-7 border-t border-gray-300" />
                    <div className="px-10 relative max-h-[calc(100vh-370px)] overflow-y-auto">
                        <table className="w-full text-left min-w-[550px] border-collapse">
                            <thead className="sticky top-0 z-20 bg-gray-200 text-gray-600 text-sm uppercase">
                                <tr>
                                    <th className="px-3 py-4 text-center">#</th>
                                    <th className="px-3 py-4 text-center">User Id</th>
                                    <th className="px-3 py-4 text-center">Date</th>
                                    <th className="px-3 py-4 text-center">Request Type</th>
                                    <th className="px-3 py-4 text-center">Status</th>
                                    <th className="px-3 py-4 text-center">Applied At</th>
                                </tr>
                            </thead>
                            <tbody className="h-1 overflow-y-scroll">
                                {requests.length > 0 ? (
                                    requests.map((request, index) => (
                                        <tr
                                            key={request.request_id}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                                            onClick={() => { review_Each_Request(request.request_id) }}
                                        >
                                            <td className="px-3 py-4 font-semibold text-center text-center">
                                                {index + 1}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {request.user_id}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {request.request_date}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {request.request_type}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {request.status}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {formatDateTime(request.applied_at)}
                                            </td>
                                        </tr>

                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-10 text-gray-500"
                                        >
                                            No Complaints added yet.
                                        </td>
                                    </tr>
                                )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllRequests