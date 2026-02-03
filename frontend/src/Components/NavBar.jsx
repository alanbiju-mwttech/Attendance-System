import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/solid";

const NavBar = () => {
    const navigate = useNavigate();

    const user_id = sessionStorage.getItem('user_id')

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    const User_Details = (userid) => {
        navigate(`/user/${userid}`)
    }

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-slate-800 shadow-md border-b px-10 py-5 flex items-center justify-between">

            <h1 className="text-xl font-bold text-white cursor-pointer tracking-wide" onClick={()=> {navigate('/home')}}>
                HRMS Portal
            </h1>

            <div className="flex flex-row items-center gap-7">
                <UserIcon className="w-7 h-7 text-white cursor-pointer" onClick={() => { User_Details(user_id) }} />
                <button
                    onClick={handleLogout}
                    className="bg-white hover:bg-gray-100 text-slate-800 text-sm font-bold px-4 py-2 rounded-lg shadow transition cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default NavBar;