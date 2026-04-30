import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Clock,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-950 text-white min-h-screen p-5 hidden md:flex flex-col fixed left-0 top-0 bottom-0">
        <h1 className="text-xl font-bold mb-8">Admin Panel</h1>

        <nav className="space-y-2 flex-1">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            to="/admin/departments"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10"
          >
            <Building2 className="w-5 h-5" />
            Departments
          </Link>

          <Link
            to="/admin/pending-agendas"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10"
          >
            <Clock className="w-5 h-5" />
            Pending Reviews
          </Link>

          <Link
            to="/admin/agendas"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10"
          >
            <ClipboardList className="w-5 h-5" />
            All Agendas
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      <main className="flex-1 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}