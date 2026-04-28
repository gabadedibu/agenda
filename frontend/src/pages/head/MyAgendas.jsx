import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Send,
  Plus,
} from "lucide-react";
import api from "../../api/axios";

const statusStyle = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-orange-100 text-orange-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  needs_revision: "bg-amber-100 text-amber-700",
  archived: "bg-gray-100 text-gray-700",
};

const statusIcon = {
  draft: AlertCircle,
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  needs_revision: AlertCircle,
  archived: AlertCircle,
};

export default function MyAgendas() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState("");

  const fetchAgendas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/agendas/my");
      setAgendas(res.data.agendas || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load agendas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  const submitAgenda = async (agendaId) => {
    const confirmSubmit = confirm(
      "Submit this agenda for admin approval?"
    );

    if (!confirmSubmit) return;

    try {
      setSubmitLoading(agendaId);
      await api.patch(`/agendas/${agendaId}/submit`);

      setAgendas((prev) =>
        prev.map((agenda) =>
          agenda._id === agendaId
            ? { ...agenda, status: "pending", adminFeedback: "" }
            : agenda
        )
      );

      alert("Agenda submitted for approval");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit agenda");
    } finally {
      setSubmitLoading("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/head"
          className="inline-flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Agendas
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage drafts, submissions, approvals, and revision feedback.
            </p>
          </div>

          <Link
            to="/head/create-agenda"
            className="inline-flex items-center justify-center gap-2 bg-slate-950 text-white px-5 py-3 rounded-xl font-semibold"
          >
            <Plus className="w-4 h-4" />
            New Agenda
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-slate-500">Loading your agendas...</p>
        ) : agendas.length === 0 ? (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="font-semibold text-slate-700">
              You have not created any agenda yet.
            </p>
            <Link
              to="/head/create-agenda"
              className="inline-flex items-center justify-center mt-5 bg-slate-950 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Create your first agenda
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            {agendas.map((agenda) => {
              const Icon = statusIcon[agenda.status] || AlertCircle;
              const canSubmit = ["draft", "rejected", "needs_revision"].includes(
                agenda.status
              );

              return (
                <div
                  key={agenda._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${
                        statusStyle[agenda.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {agenda.status.replace("_", " ")}
                    </span>

                    <span className="text-xs capitalize px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      {agenda.priority}
                    </span>
                  </div>

                  <h2 className="font-bold text-lg text-slate-900 mt-4">
                    {agenda.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2">
                    {agenda.summary}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {agenda.proposedDate
                      ? new Date(agenda.proposedDate).toLocaleDateString()
                      : "No proposed date"}
                  </div>

                  {agenda.adminFeedback && (
                    <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-700">
                        Admin Feedback
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        {agenda.adminFeedback}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex gap-3">
                    {canSubmit && (
                      <button
                        disabled={submitLoading === agenda._id}
                        onClick={() => submitAgenda(agenda._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        {submitLoading === agenda._id
                          ? "Submitting..."
                          : "Submit for Approval"}
                      </button>
                    )}

                  {agenda.status === "approved" && (
  <Link
    to={`/head/agendas/${agenda._id}/update`}
    className="flex-1 bg-slate-950 text-white px-4 py-3 rounded-xl font-semibold text-center"
  >
    Add Update
  </Link>
)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}