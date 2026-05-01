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
  Trash2,
  RotateCcw,
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

  // 🔥 ARCHIVE
  const archiveAgenda = async (id) => {
    if (!confirm("Archive this agenda?")) return;

    try {
      await api.patch(`/agendas/${id}/archive`);
      fetchAgendas();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // 🔥 UNARCHIVE (reuse update)
  const unarchiveAgenda = async (id) => {
    if (!confirm("Unarchive this agenda?")) return;

    try {
      await api.patch(`/agendas/${id}`, { status: "approved", publicVisible: true });
      fetchAgendas();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // 🔥 DELETE (only archived)
  const deleteAgenda = async (id) => {
    if (!confirm("Delete permanently? This cannot be undone")) return;

    try {
      await api.delete(`/agendas/${id}`);
      setAgendas((prev) => prev.filter((a) => a._id !== id));
      alert("Deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const filtered = agendas.filter((a) => {
    const text = `${a.title} ${a.summary}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">All Agendas</h1>

          <button onClick={fetchAgendas} className="bg-white px-4 py-2 rounded-xl border">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border px-4 py-2 rounded-xl w-full"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-4 py-2 rounded-xl"
          >
            <option value="">All</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((agenda) => {
            const Icon = statusIcon[agenda.status];

            return (
              <div key={agenda._id} className="bg-white p-4 rounded-xl border">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-bold">{agenda.title}</h2>
                    <p className="text-sm text-gray-500">{agenda.summary}</p>
                  </div>

                  <span className={`px-3 py-1 text-xs rounded ${statusStyle[agenda.status]}`}>
                    <Icon className="inline w-3 h-3 mr-1" />
                    {agenda.status}
                  </span>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {agenda.status !== "archived" && (
                    <button
                      onClick={() => archiveAgenda(agenda._id)}
                      className="bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs"
                    >
                      <Archive className="w-3 h-3 inline mr-1" />
                      Archive
                    </button>
                  )}

                  {agenda.status === "archived" && (
                    <>
                      <button
                        onClick={() => unarchiveAgenda(agenda._id)}
                        className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs"
                      >
                        <RotateCcw className="w-3 h-3 inline mr-1" />
                        Unarchive
                      </button>

                      <button
                        onClick={() => deleteAgenda(agenda._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-xl text-xs"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete
                      </button>
                    </>
                  )}

                  <Link
                    to={`/agendas/${agenda._id}`}
                    className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs"
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}