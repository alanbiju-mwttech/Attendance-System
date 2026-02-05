import NavBar from "./NavBar"
import { useEffect, useState } from "react";
import { SparklesIcon, HeartIcon, BriefcaseIcon, BanknotesIcon } from "@heroicons/react/24/outline";

const LeaveBalance = () => {

    const user_id = sessionStorage.getItem('user_id')

    const [balances, setBalances] = useState({});
    const [paidLeave, setPaidLeave] = useState({});
    const [totalLeave, setTotalLeave] = useState({});

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/user/leave-balance`, {
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
                setBalances(data);
            } catch (error) {
                console.error(error)
            }
        };

        const fetchTotal = async () => {
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
                setTotalLeave(data);
            } catch (error) {
                console.error(error)
            }
        };

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
                setPaidLeave({
                    "Taken": data.pl_count,
                    "Total": data.total_leave
                })
            } catch (error) {
                console.error(error)
            }
        }

        fetchTotal()
        fetchBalances()

        check_pls()
    }, [user_id]);

    const cards = [
        {
            title: "Casual Leaves",
            value: balances["Casual Leave"],
            total: totalLeave["Casual Leave"],
            note: "Yearly",
            icon: <SparklesIcon className="h-7 w-7 text-blue-600" />,
            bg: "bg-blue-50",
        },
        {
            title: "Sick Leaves",
            value: balances["Sick Leave"],
            total: totalLeave["Sick Leave"],
            note: "Yearly",
            icon: <HeartIcon className="h-7 w-7 text-rose-500" />,
            bg: "bg-rose-50",
        },
        {
            title: "Earned Leaves",
            value: balances["Earned Leave"],
            total: totalLeave["Earned Leave"],
            note: "Yearly",
            icon: <BriefcaseIcon className="h-7 w-7 text-amber-600" />,
            bg: "bg-amber-50",
        },
        {
            title: "Paid Leaves",
            value: paidLeave["Taken"],
            total: paidLeave["Total"],
            note: "Monthly",
            icon: <BanknotesIcon className="h-7 w-7 text-emerald-600" />,
            bg: "bg-emerald-50",
        },
      ];

    return(
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-30 px-6">
                <div className="max-w-5xl mx-auto">

                    <h1 className="text-3xl font-bold text-slate-800 mb-10 text-center">
                        Leave Balance Overview
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-slate-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${card.bg}`}>
                                        {card.icon}
                                    </div>
                                    <span className={`text-sm ${card.total - card.value === 0 ? "text-red-500" : "text-slate-500" }`}>{
                                        card.total - card.value === 0 ? "Not Available" : "Available" 
                                    }
                                    </span>
                                </div>

                                <h2 className="text-lg font-semibold text-slate-700">
                                    {card.title} <span className="text-sm font-medium text-slate-700">({card.note})</span>
                                </h2>

                                <p className="text-3xl font-semibold text-slate-900 mt-2">
                                    {card.total - card.value}/{card.total}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeaveBalance