import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        roleid: "",
        number_of_leaves: "",
        reports_to: "",
        schedule_id: ""
    });

    const navigate = useNavigate()

    const [roles, setRoles] = useState([])
    const [users, setUSers] = useState([])
    const [schedule, setSchedule] = useState([])

    const getRoles = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/get-roles`, {
                method: 'GET',
            })
            const data = await response.json()
            setRoles(data)
        } catch (error) {
            console.error(error.message);
        }
    }

    const getUsers = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/get-users`, {
                method: 'GET',
            })
            const data = await response.json()
            setUSers(data)
        } catch (error) {
            console.error(error.message);
        }
    }

    const get_work_schedules = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/get-work-schedules`, {
                method: 'GET',
            })
            const data = await response.json()
            setSchedule(data)
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getRoles()
        getUsers()
        get_work_schedules()
    }, []) 

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!formData.name || !formData.username || !formData.password  || !formData.roleid || formData.number_of_leaves === "") {
            setError("Please fill all required fields.");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/add-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    roleid: Number(formData.roleid),
                    number_of_leaves: Number(formData.number_of_leaves),
                    reports_to: formData.reports_to ? Number(formData.reports_to) : null
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || "Failed to add user");

            
            setMessage("User added successfully!");
            navigate("/home")
            setFormData({
                name: "",
                username: "",
                password: "",
                roleid: "",
                number_of_leaves: "",
                reports_to: ""
            });

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6 pt-25">
                <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl px-8 py-4">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                        Add New User
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                        <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
                        <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                        <Input label="Number of Leaves" name="number_of_leaves" type="number" value={formData.number_of_leaves} onChange={handleChange} />
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Role<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="roleid"
                                value={formData.roleid}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select Role</option>
                                {roles.map(role => (
                                    <option className="font-medium" key={role.roleid} value={role.roleid}>
                                        {role.role}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {formData.roleid !== "3" && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Reports To
                                </label>
                                <select
                                    name="reports_to"
                                    value={formData.reports_to}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select Reporting Manager</option>
                                    {users.map(user => (
                                        <option className="font-medium" key={user.userid} value={user.userid}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Work Shedule<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="schedule_id"
                                value={formData.schedule_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select Schedule</option>
                                {schedule.map(role => (
                                    <option className="font-medium" key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                        {message && <p className="text-green-600 text-sm text-center">{message}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow-md transition"
                        >
                            Create User
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

const Input = ({ label, name, value, onChange, type = "text", optional }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
            {label} {!optional && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default AddUser;
