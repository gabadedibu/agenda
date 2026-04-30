import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Clock,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Departments",
      path: "/admin/departments",
      icon: Building2,
    },
    {
      label: "Pending Reviews",
      path: "/admin/pending-agendas",
      icon: Clock,
    },
    {
      label: "All Agendas",
      path: "/admin/agendas",
      icon: ClipboardList,
    },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>

        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-white/15 text-white" : "hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-200"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-950 text-white min-h-screen p-5 hidden md:flex flex-col fixed left-0 top-0 bottom-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="font-bold text-slate-900">Admin Panel</h1>

        <div className="w-10" />
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950 text-white p-5 z-50 flex flex-col transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      <main className="md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}