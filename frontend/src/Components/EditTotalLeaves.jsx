import { useCallback, useEffect, useState } from "react";
import NavBar from "./NavBar"
import { PencilSquareIcon, CheckIcon, XCircleIcon } from "@heroicons/react/24/solid";

const EditTotalLeaves = () =>{

    const [editingId, setEditingId] = useState(false)
    const [totalLeave, setTotalLeave] = useState({
        casual: 0,
        sick: 0,
        earned: 0
    });
    const [formData, setFormData] = useState({})

    const fetchTotal = useCallback(async() => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/user/total-leaves`, {
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
            setTotalLeave({
                casual: data.casual,
                sick: data.sick,
                earned: data.earned
            });
        } catch (error) {
            console.error(error)
        }
    },[]);

    useEffect(()=>{
        fetchTotal()
    },[fetchTotal])

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

    const startEdit = () =>{
        setFormData(totalLeave)
        setEditingId(true);
    }

    const handleSave = async() => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/admin/update-total-leaves`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Can't fetch the attendance");
            }
            const data = await res.json()
            console.log(data)
            setFormData({})
            setEditingId(false)
            fetchTotal()
        } catch (error) {
            console.error(error)
        }
    }

    return(
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

                    <div className="bg-slate-800 text-white p-6">
                        <h2 className="text-2xl font-semibold tracking-wide">
                            Edit Total Leaves
                        </h2>
                        <p className="text-sm text-slate-300 mt-1">
                            Edit Company-Wide Leave Allocations.
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex flex-row items-center gap-10">
                            <p className="text-sm font-medium text-slate-500 mb-1">Number of Casual Leaves: </p>
                            {editingId ? (
                                <input
                                    name="casual"
                                    value={formData.casual}
                                    onChange={handleChange}
                                    className="w-25 text-lg font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1"
                                />
                            ) : (
                                <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                    {totalLeave.casual} Days
                                </p>
                            )}
                        </div>

                        <div className="flex flex-row items-center gap-10">
                            <p className="text-sm font-medium text-slate-500 mb-1">Number of Sick Leaves: </p>
                            {editingId ? (
                                <input
                                    name="sick"
                                    value={formData.sick}
                                    onChange={handleChange}
                                    className="w-25 text-lg font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1"
                                />
                            ) : (
                                <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                    {totalLeave.sick} Days
                                </p>
                            )}
                        </div>

                        <div className="flex flex-row items-center gap-10">
                            <p className="text-sm font-medium text-slate-500 mb-1">Number of Earned Leaves: </p>
                            {editingId ? (
                                <input
                                    type="number"
                                    name="earned"
                                    value={formData.earned}
                                    onChange={handleChange}
                                    className="w-25 text-lg font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1"
                                />
                            ) : (
                                <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                                    {totalLeave.earned} Days
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-5 items-center pt-5 px-6 bg-slate-50 border-t border-slate-200">
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
            </div>
        </>
    )
}

export default EditTotalLeaves