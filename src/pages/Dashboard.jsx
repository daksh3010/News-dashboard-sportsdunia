import { useAuth } from "../context/AuthContext";
import { adminEmails } from "../utils/adminList";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = adminEmails.includes(user?.email);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const goToNews = () => {
    navigate("/news");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <p className="text-gray-700 text-lg mb-4">
          You are logged in as: <span className="font-semibold">{user?.email}</span>
        </p>

        {isAdmin ? (
          <div className="mb-6 text-green-600 font-semibold text-lg">
            ✅ Admin Access Granted
          </div>
        ) : (
          <div className="mb-6 text-red-600 font-semibold text-lg">
            ❌ Regular User – No Admin Access
          </div>
        )}

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition"
          onClick={goToNews}
        >
          Go to News Page
        </button>
      </div>
    </div>
  );
}
