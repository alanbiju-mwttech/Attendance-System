import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "./NavBar"

const ViewAllUsers = () => {

    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const get_all_users = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/admin/all-users`, {
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
            setUsers(data)
        } catch (error) {
            console.error(error)
        }
    }

    const review_Each_Request = (userid) => {
        navigate(`/users/${userid}`)
    }

    useEffect(() => {
        get_all_users()
    }, [])

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4 md:px-10 pt-[110px] pb-10">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden pb-10">

                    <div className="px-6 py-6 flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-3xl max-md:text-xl font-bold text-gray-600">
                                All Users
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 pr-3">
                                List of all users.
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
                                    <th className="px-3 py-4 text-center">Role</th>
                                    <th className="px-3 py-4 text-center">Name</th>
                                    <th className="px-3 py-4 text-center">Reports To</th>
                                </tr>
                            </thead>
                            <tbody className="h-1 overflow-y-scroll">
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr
                                            key={user.userid}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                                            onClick={() => { review_Each_Request(user.userid) }}
                                        >
                                            <td className="px-3 py-4 font-semibold text-center text-center">
                                                {index + 1}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {user.userid}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {user.role}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {user.name}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {user.reports_to}
                                            </td>
                                        </tr>

                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-10 text-gray-500"
                                        >
                                            No Users added yet.
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

export default ViewAllUsers