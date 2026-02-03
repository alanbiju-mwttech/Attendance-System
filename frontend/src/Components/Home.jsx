import { useEffect, useState } from "react";
import CalenderComp from "./CalenderComp";
import Navbar from "./NavBar";
import { useNavigate } from "react-router-dom";
import {
    ClipboardDocumentCheckIcon,
    CalendarDaysIcon,
    UserPlusIcon,
    ViewfinderCircleIcon,
    PencilSquareIcon,
    BanknotesIcon,
    AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

const Home = () => {
    const [reportsTo, setReportsTo] = useState(false);
    const user_id = sessionStorage.getItem("user_id");
    const role = sessionStorage.getItem("role");
    const navigate = useNavigate();

    useEffect(() => {
        const validate = async () => {
            const res = await fetch(`http://127.0.0.1:8000/check-reports-to`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id }),
            });

            const data = await res.json();
            setReportsTo(data === true);
        };

        validate();
    }, [user_id]);

    return (
        <>
            <Navbar />

            {role === "Admin" ? (
                <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-slate-100 pt-25 pb-10">
                    <h2 className="text-3xl font-bold text-slate-800 text-center">
                        Admin Dashboard
                    </h2>

                    <div className="flex flex-col items-center justify-center gap-6 w-full">
                        <ActionCard
                            title="Add New User"
                            description="Create employee login and assign manager"
                            icon={<UserPlusIcon className="h-8 w-8 text-purple-600" />}
                            onClick={() => navigate("/add-user")}
                        />

                        <ActionCard
                            title="Set Working Dates"
                            description="Set Working Days & Week-Offs"
                            icon={<CalendarDaysIcon className="h-8 w-8 text-blue-600" />}
                            onClick={() => navigate("/work-schedule")}
                        />

                        <ActionCard
                            title="Edit User Details"
                            description="Update employee role, manager, or leave balance"
                            icon={<PencilSquareIcon className="h-8 w-8 text-amber-600" />}
                            onClick={() => navigate("/all-users")}
                        />

                        <ActionCard
                            title="Edit Total Leave"
                            description="Modify company-wide leave allocations"
                            icon={<AdjustmentsHorizontalIcon className="h-8 w-8 text-purple-700" />}
                            onClick={() => navigate("/admin/edit-total-leaves")}
                        />

                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 pt-26 py-4 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-wrap items-start justify-center gap-10">

                            <div className="backdrop-blur-lg bg-white/70 border border-gray-200 shadow-xl rounded-3xl p-6">
                                <CalenderComp />
                            </div>

                            <div className="flex flex-col items-center justify-center gap-6">
                                {role !== "CEO" && (
                                    <ActionCard
                                        title="Regularize Attendance"
                                        description="Apply for leave, WFH or corrections"
                                        icon={<CalendarDaysIcon className="h-8 w-8 text-blue-600" />}
                                        onClick={() => navigate("/regularize")}
                                    />
                                )}

                                {reportsTo && (
                                    <ActionCard
                                        title="Review Requests"
                                        description="Approve or reject employee requests"
                                        icon={<ClipboardDocumentCheckIcon className="h-8 w-8 text-green-600" />}
                                        onClick={() => navigate("/all-requests")}
                                    />
                                )}

                                {role !== "CEO" && (
                                    <ActionCard
                                        title="View All Requests"
                                        description="View all applied requests and its status"
                                        icon={<ViewfinderCircleIcon className="h-8 w-8 text-purple-700" />}
                                        onClick={() => navigate("/user-all-request")}
                                    />
                                )}

                                {role !== "CEO" && (
                                    <ActionCard
                                        title="Leave Balance"
                                        description="Check remaining leave days and usage"
                                        icon={<BanknotesIcon className="h-8 w-8 text-emerald-600" />}
                                        onClick={() => navigate("/leave-balance")}
                                    />
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const ActionCard = ({ title, description, icon, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-200 w-100"
    >
        <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-3 rounded-xl">{icon}</div>
            <div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </div>
    </div>
);

export default Home;
