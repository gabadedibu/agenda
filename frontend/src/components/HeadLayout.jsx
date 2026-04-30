import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  User,
  Globe,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function HeadLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-64 bg-slate-950 text-white p-5 flex-col">
        <Link to="/head" className="text-xl font-bold">
          Department Head
        </Link>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/head"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "text-slate-300 hover:bg-white/10"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      <div className="flex-1">
        <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between">
          <Link to="/head" className="font-bold">
            Department Head
          </Link>

          <button onClick={handleLogout} className="text-sm">
            Logout
          </button>
        </div>

        <div className="md:hidden bg-white border-b border-slate-200 p-3 flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/head"}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <Outlet />
      </div>
    </div>
  );
}