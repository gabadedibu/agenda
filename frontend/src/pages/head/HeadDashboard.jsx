import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  User,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "../../api/axios";

export default function HeadDashboard() {
  const [agendas, setAgendas] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [agendaRes, profileRes] = await Promise.all([
        api.get("/agendas/my"),
        api.get("/auth/me"),
      ]);

      setAgendas(agendaRes.data.agendas || []);
      setProfile(profileRes.data.user);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = {
    total: agendas.length,
    draft: agendas.filter((a) => a.status === "draft").length,
    pending: agendas.filter((a) => a.status === "pending").length,
    approved: agendas.filter((a) => a.status === "approved").length,
    rejected: agendas.filter((a) => a.status === "rejected").length,
    revision: agendas.filter((a) => a.status === "needs_revision").length,
  };

  const cards = [
    {
      label: "Total Agendas",
      value: stats.total,
      icon: ClipboardList,
      color: "bg-slate-100 text-slate-700",
    },
    {
      label: "Drafts",
      value: stats.draft,
      icon: AlertCircle,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending Approval",
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

  const recentAgendas = agendas.slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Department Head Panel
            </p>
            <h1 className="text-3xl font-bold text-slate-900 mt-1">
              Welcome{profile?.name ? `, ${profile.name}` : ""}
            </h1>
            <p className="text-slate-500 mt-2">
              Create agendas, track approvals, and publish public updates.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
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

                    <p className="text-slate-500 text-sm mt-5">
                      {card.label}
                    </p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-1">
                      {card.value}
                    </h2>
                  </div>
                );
              })}
            </section>

            <section className="grid lg:grid-cols-3 gap-5 mt-8">
              <Link
                to="/head/create-agenda"
                className="bg-slate-950 text-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <Plus className="w-8 h-8 text-emerald-400" />
                <h2 className="text-xl font-bold mt-5">Create New Agenda</h2>
                <p className="text-slate-300 text-sm mt-2">
                  Draft a new departmental agenda and submit it for approval.
                </p>
              </Link>

              <Link
                to="/head/agendas"
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <ClipboardList className="w-8 h-8 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900 mt-5">
                  Manage My Agendas
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  View drafts, pending agendas, approved agendas, and feedback.
                </p>
              </Link>

              <Link
                to="/head/profile"
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <User className="w-8 h-8 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900 mt-5">
                  Edit Profile
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  Update your name and change your account password.
                </p>
              </Link>
            </section>

            <section className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-slate-900">Recent Agendas</h2>
                <Link
                  to="/head/agendas"
                  className="text-sm font-semibold text-emerald-700"
                >
                  View all
                </Link>
              </div>

              {recentAgendas.length === 0 ? (
                <p className="text-slate-500 text-sm mt-5">
                  No agenda created yet.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {recentAgendas.map((agenda) => (
                    <div
                      key={agenda._id}
                      className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {agenda.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {agenda.summary}
                        </p>
                      </div>

                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                        {agenda.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}