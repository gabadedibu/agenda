import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, Building2, Flag } from "lucide-react";
import api from "../../api/axios";

export default function Agendas() {
  const [agendas, setAgendas] = useState([]);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAgendas = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (priority) params.append("priority", priority);

      const res = await api.get(`/agendas/public?${params.toString()}`);
      setAgendas(res.data.agendas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, [priority]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAgendas();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-950 text-white px-4 md:px-6 py-10 md:py-12">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="text-sm text-emerald-400">
            ← Back home
          </Link>

          <h1 className="text-2xl md:text-5xl font-bold mt-5">
            Approved Agendas
          </h1>

          <p className="text-slate-300 mt-3 max-w-xl text-sm md:text-base">
            Browse approved departmental agendas, public updates, and documents.
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3"
        >
          <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agendas..."
              className="w-full py-3 outline-none text-sm"
            />
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-3 text-sm w-full md:w-auto"
          >
            <option value="">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>

          <button className="bg-slate-950 text-white px-6 py-3 rounded-xl font-semibold w-full md:w-auto">
            Search
          </button>
        </form>

        {/* CONTENT */}
        {loading ? (
          <p className="mt-8 text-slate-500">Loading agendas...</p>
        ) : agendas.length === 0 ? (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-600 font-semibold">
              No approved agenda found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-6">
            {agendas.map((agenda) => (
              <Link
                key={agenda._id}
                to={`/agendas/${agenda._id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    Approved
                  </span>

                  <span className="text-xs capitalize px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    {agenda.priority}
                  </span>
                </div>

                <h2 className="font-bold text-base md:text-lg text-slate-900 mt-4 line-clamp-2">
                  {agenda.title}
                </h2>

                <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                  {agenda.summary}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <p className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {agenda.departmentId?.name || "Department"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {agenda.proposedDate
                      ? new Date(agenda.proposedDate).toLocaleDateString()
                      : "No proposed date"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    {agenda.priority} priority
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}