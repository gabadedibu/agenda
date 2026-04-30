import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  RefreshCw,
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Archive,
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
  archived: Archive,
};

export default function AllAgendas() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchAgendas = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const res = await api.get(`/agendas?${params.toString()}`);
      setAgendas(res.data.agendas || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load agendas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, [status]);

  const archiveAgenda = async (agendaId) => {
    const confirmArchive = confirm(
      "Archive this agenda? It will no longer appear on the public page."
    );

    if (!confirmArchive) return;

    try {
      await api.patch(`/agendas/${agendaId}/archive`);

      setAgendas((prev) =>
        prev.map((agenda) =>
          agenda._id === agendaId
            ? { ...agenda, status: "archived", publicVisible: false }
            : agenda
        )
      );

      alert("Agenda archived successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to archive agenda");
    }
  };

  const filteredAgendas = agendas.filter((agenda) => {
    const text = `${agenda.title} ${agenda.summary} ${agenda.departmentId?.name} ${agenda.createdBy?.name}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Agendas</h1>
            <p className="text-slate-500 mt-2">
              Monitor all departmental agendas across every status.
            </p>
          </div>

          <button
            onClick={fetchAgendas}
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-xl font-semibold text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, department, or creator..."
              className="w-full py-3 outline-none text-sm"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needs_revision">Needs Revision</option>
            <option value="archived">Archived</option>
          </select>
        </section>

        {loading ? (
          <p className="mt-8 text-slate-500">Loading agendas...</p>
        ) : filteredAgendas.length === 0 ? (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <ClipboardList className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700 mt-3">
              No agenda found
            </p>
          </div>
        ) : (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
              <div className="col-span-4">Agenda</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-2">Creator</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredAgendas.map((agenda) => {
                const Icon = statusIcon[agenda.status] || AlertCircle;

                return (
                  <div
                    key={agenda._id}
                    className="grid md:grid-cols-12 gap-4 px-5 py-4 items-center"
                  >
                    <div className="md:col-span-4">
                      <h2 className="font-bold text-slate-900">
                        {agenda.title}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {agenda.summary}
                      </p>
                    </div>

                    <div className="md:col-span-2 text-sm text-slate-600">
                      {agenda.departmentId?.name || "N/A"}
                    </div>

                    <div className="md:col-span-2 text-sm text-slate-600">
                      {agenda.createdBy?.name || "N/A"}
                    </div>

                    <div className="md:col-span-2">
                      <span
                        className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${
                          statusStyle[agenda.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {agenda.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="md:col-span-1 text-sm capitalize text-slate-600">
                      {agenda.priority}
                    </div>

                    <div className="md:col-span-1 md:text-right flex md:justify-end gap-2 flex-wrap">
                      {agenda.status === "pending" ? (
                        <Link
                          to="/admin/pending-agendas"
                          className="inline-flex items-center justify-center gap-1 bg-slate-950 text-white px-3 py-2 rounded-xl text-xs font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review
                        </Link>
                      ) : agenda.status === "approved" ? (
                        <Link
                          to={`/agendas/${agenda._id}`}
                          className="inline-flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Public
                        </Link>
                      ) : null}

                      {agenda.status !== "archived" && (
                        <button
                          onClick={() => archiveAgenda(agenda._id)}
                          className="inline-flex items-center justify-center gap-1 bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}