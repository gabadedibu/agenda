import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Users,
} from "lucide-react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    departments: 0,
    allAgendas: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    revision: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [departmentsRes, agendasRes] = await Promise.all([
        api.get("/departments"),
        api.get("/agendas"),
      ]);

      const departments = departmentsRes.data.departments || [];
      const agendas = agendasRes.data.agendas || [];

      setStats({
        departments: departments.length,
        allAgendas: agendas.length,
        pending: agendas.filter((a) => a.status === "pending").length,
        approved: agendas.filter((a) => a.status === "approved").length,
        rejected: agendas.filter((a) => a.status === "rejected").length,
        revision: agendas.filter((a) => a.status === "needs_revision").length,
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Departments",
      value: stats.departments,
      icon: Building2,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "All Agendas",
      value: stats.allAgendas,
      icon: ClipboardList,
      color: "bg-slate-100 text-slate-700",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "bg-red-50 text-red-700",
    },
    {
      label: "Needs Revision",
      value: stats.revision,
      icon: RefreshCw,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-2">
              Monitor departments, agenda submissions, approvals, and revision requests.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-xl font-semibold text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="mt-8 text-slate-500">Loading dashboard...</p>
        ) : (
          <>
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <p className="text-slate-500 text-sm mt-5">{card.label}</p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-1">
                      {card.value}
                    </h2>
                  </div>
                );
              })}
            </section>

            <section className="grid lg:grid-cols-3 gap-5 mt-8">
              <Link
                to="/admin/pending-agendas"
                className="bg-slate-950 text-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <Clock className="w-8 h-8 text-emerald-400" />
                <h2 className="text-xl font-bold mt-5">Review Pending Agendas</h2>
                <p className="text-slate-300 text-sm mt-2">
                  Approve, reject, or request revision from department heads.
                </p>
              </Link>

              <Link
                to="/admin/departments"
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <Building2 className="w-8 h-8 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900 mt-5">
                  Manage Departments
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  Create departments and assign department heads.
                </p>
              </Link>

              <Link
                to="/agendas"
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <Users className="w-8 h-8 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900 mt-5">
                  View Public Portal
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  See approved agendas the way public users see them.
                </p>
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}