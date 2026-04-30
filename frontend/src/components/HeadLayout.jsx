import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  User,
  Globe,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function HeadLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/head", label: "Dashboard", icon: LayoutDashboard },
    { to: "/head/agendas", label: "My Agendas", icon: ClipboardList },
    { to: "/head/create-agenda", label: "Create Agenda", icon: Plus },
    { to: "/head/profile", label: "Profile", icon: User },
    { to: "/agendas", label: "Public Portal", icon: Globe },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between">
        <Link
          to="/head"
          onClick={() => setSidebarOpen(false)}
          className="text-xl font-bold"
        >
          Department Head
        </Link>

        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-8 space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === "/head"
              ? location.pathname === "/head"
              : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/head"}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-200 hover:bg-red-500/20"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-950 text-white p-5 flex-col fixed left-0 top-0 bottom-0">
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

        <h1 className="font-bold text-slate-900">Department Head</h1>

        <button
          onClick={handleLogout}
          className="text-xs font-bold text-red-600"
        >
          Logout
        </button>
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