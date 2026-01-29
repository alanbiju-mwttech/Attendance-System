import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [apiError, setApiError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const loginFunction = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Login failed");
            }

            const data = await response.json();

            sessionStorage.setItem("user_id", data.user_id);
            sessionStorage.setItem("role", data.role);
            sessionStorage.setItem("isLoggedIn", "true");

            navigate("/home");

        } catch (error) {
            setApiError(error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setApiError("");
        loginFunction();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="username"
                            className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 transition-all"
                        />
                    </div>

                    {apiError && (
                        <p className="text-sm text-center text-red-600">
                            {apiError}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gray-300 font-semibold py-2 shadow-md rounded-xl transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;