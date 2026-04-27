import { useEffect, useState } from "react";
import { CheckCircle, XCircle, RefreshCw, FileWarning } from "lucide-react";
import api from "../../api/axios";

export default function PendingAgendas() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingAgendas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/agendas?status=pending");
      setAgendas(res.data.agendas || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load pending agendas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAgendas();
  }, []);

  const reviewAgenda = async (agendaId, action) => {
    try {
      setActionLoading(true);

      await api.patch(`/agendas/${agendaId}/review`, {
        action,
        feedback,
      });

      setAgendas((prev) => prev.filter((agenda) => agenda._id !== agendaId));
      setSelectedAgenda(null);
      setFeedback("");

      alert(`Agenda ${action} successful`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Review failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Pending Agenda Reviews
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review, approve, reject, or request corrections from departments.
            </p>
          </div>

          <button
            onClick={fetchPendingAgendas}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="mt-8 text-slate-500">Loading pending agendas...</p>
        ) : agendas.length === 0 ? (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <FileWarning className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 mt-3">
              No pending agenda found
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-5 mt-8">
            <section className="lg:col-span-1 space-y-3">
              {agendas.map((agenda) => (
                <button
                  key={agenda._id}
                  onClick={() => {
                    setSelectedAgenda(agenda);
                    setFeedback("");
                  }}
                  className={`w-full text-left bg-white rounded-2xl border p-4 transition ${
                    selectedAgenda?._id === agenda._id
                      ? "border-slate-900 shadow-md"
                      : "border-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-700">
                    Pending
                  </span>

                  <h2 className="font-bold text-slate-900 mt-3 line-clamp-2">
                    {agenda.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {agenda.summary}
                  </p>

                  <p className="text-xs text-slate-400 mt-3">
                    {agenda.departmentId?.name || "Department"} •{" "}
                    {agenda.priority} priority
                  </p>
                </button>
              ))}
            </section>

            <section className="lg:col-span-2">
              {!selectedAgenda ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                  <p className="text-slate-500">
                    Select an agenda to review details.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-700">
                      Pending Approval
                    </span>

                    <span className="text-xs capitalize px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      {selectedAgenda.priority}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mt-5">
                    {selectedAgenda.title}
                  </h2>

                  <p className="text-slate-500 mt-2">
                    {selectedAgenda.summary}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mt-5 text-sm">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-slate-400">Department</p>
                      <p className="font-semibold text-slate-800">
                        {selectedAgenda.departmentId?.name || "N/A"}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-slate-400">Submitted By</p>
                      <p className="font-semibold text-slate-800">
                        {selectedAgenda.createdBy?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold text-slate-900">Full Description</h3>
                    <p className="text-slate-600 leading-7 mt-3 whitespace-pre-line">
                      {selectedAgenda.description}
                    </p>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Admin Feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write approval note, rejection reason, or revision instruction..."
                      className="w-full min-h-28 border border-slate-200 rounded-xl p-4 outline-none text-sm"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 mt-5">
                    <button
                      disabled={actionLoading}
                      onClick={() => reviewAgenda(selectedAgenda._id, "approve")}
                      className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => reviewAgenda(selectedAgenda._id, "revision")}
                      className="flex items-center justify-center gap-2 bg-amber-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Revision
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => reviewAgenda(selectedAgenda._id, "reject")}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}