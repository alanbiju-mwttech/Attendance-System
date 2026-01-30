import { useEffect, useState } from "react";
import CalenderComp from "./CalenderComp";
import { useNavigate } from "react-router-dom";
import { ClipboardDocumentCheckIcon, CalendarDaysIcon, UserPlusIcon, ViewfinderCircleIcon } from "@heroicons/react/24/outline";

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

    return role === "Admin" ? (
        <div className="m-auto w-100 flex flex-col mt-30 gap-15">
            <h2 className="text-3xl font-bold text-slate-800 text-center">
                Admin DashBoard
            </h2>
            <ActionCard
                title="Add New User"
                description="Create employee login and assign manager"
                icon={<UserPlusIcon className="h-8 w-8 text-purple-600" />}
                onClick={() => navigate("/add-user")}
            />
            <ActionCard
                title="Set Working Dayes"
                description="Set Working Days & Week-Offs"
                icon={<CalendarDaysIcon className="h-8 w-8 text-blue-600" />}
                onClick={() => navigate("/work-schedule")}
            />
        </div>
    ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 py-15 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Main Grid */}
                <div className="flex flex-row items-center justify-center gap-10 items-start">

                    {/* Calendar */}
                    <div className="lg:col-span-2 backdrop-blur-lg bg-white/70 border border-white/40 shadow-xl rounded-3xl p-6">
                        <CalenderComp />
                    </div>

                    {/* Actions */}
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
                                    icon={<ViewfinderCircleIcon className="h-8 w-8 text-blue-600" />}
                                onClick={() => navigate("/user-all-request")}
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
    };

const ActionCard = ({ title, description, icon, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-200"
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
