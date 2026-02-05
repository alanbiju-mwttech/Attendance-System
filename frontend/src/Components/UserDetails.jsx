import { useCallback, useEffect, useState } from "react";
import { PencilSquareIcon, CheckIcon, UserCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";

const UserDetails = () => {
    const [users, setUsers] = useState({});
    const [formData, setFormData] = useState({})
    const [editingId, setEditingId] = useState(false);
    const {user_id} = useParams()

    const get_user_details = useCallback(async() =>{
        try {
            const res = await fetch(`http://127.0.0.1:8000/admin/user/${user_id}/view`,{
                method: "GET",
                headers: {
                    "content-Type": "application/json",
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
    },[user_id])

    useEffect(()=>{
        get_user_details()
    },[get_user_details])

    const startEdit = () => {
        setFormData(users[0])
        setEditingId(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const onCancel = () => {
        setEditingId(false);
        setFormData({})
    }

    const handleSave = async () => {
        console.log(formData)
        try {
            const res = await fetch(`http://127.0.0.1:8000/admin/update-user/${user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    password: formData.password
                })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Can't fetch the attendance");
            }
            const data = await res.json()
            console.log(data)
            setEditingId(false);
            setFormData({})
            get_user_details();
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <>
            <NavBar />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-20 pb-4">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

                    <div className="text-center py-4 border-b border-slate-200">
                        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
                    </div>

                    <div className="flex items-center gap-6 p-4 px-8 border-b border-slate-200 bg-slate-50">
                        <UserCircleIcon className="h-20 w-20 text-slate-400" />
                        <div>
                            <>
                                <h2 className="text-2xl font-semibold text-slate-800">{users[0]?.name}</h2>
                                <p className="text-slate-500 text-md">UserId: {users[0]?.userid}</p>
                            </>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 p-8 text-slate-700">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Name</p>
                            {editingId ? (
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full text-lg font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1"
                                />
                            ) : (
                                <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                    {users[0]?.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Username</p>
                            {editingId ? (
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full text-lg font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1"
                                />
                            ) : (
                                <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                    {users[0]?.username}
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Password</p>
                            {editingId ? (
                                <input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full text-lg font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1"
                                />
                            ) : (
                                <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                    {users[0]?.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Leaves Available</p>
                            <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                {users[0]?.number_of_leaves}
                            </p>
                        </div>
                            
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Role</p>
                            <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                {users[0]?.role}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Reports To</p>
                            <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                {users[0]?.reporting_manager ? users[0].reporting_manager : "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Work Schedule</p>
                            <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                {users[0]?.schedule_name}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-5 items-center p-4 px-6 bg-slate-50 border-t border-slate-200">
                        <span>
                            { }
                        </span>

                        {editingId ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition cursor-pointer"
                                >
                                    <CheckIcon className="h-5 w-5" />
                                    Save
                                </button>
                                <button
                                    onClick={() => onCancel()}
                                    className="flex items-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-xl shadow-md transition cursor-pointer"
                                >
                                    <XCircleIcon className="h-5 w-5" />
                                    Cancel
                                </button>
                            </>
                        ) : (
                                <button
                                    onClick={() => startEdit()}
                                    className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md transition cursor-pointer"
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                    Edit
                                </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserDetails;
