import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../api/axios";

export default function CreateAgenda() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    proposedDate: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.post("/agendas", form);

      alert("Agenda draft created successfully");
      navigate("/head/agendas");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create agenda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/head"
          className="inline-flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Create New Agenda
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Save your departmental agenda as a draft before submitting it for
            approval.
          </p>

          {error && (
            <div className="mt-5 bg-red-50 text-red-600 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Agenda Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Road Maintenance Project"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Summary
              </label>
              <input
                name="summary"
                value={form.summary}
                onChange={handleChange}
                required
                placeholder="Short summary of this agenda"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="7"
                placeholder="Explain the agenda details, purpose, expected outcome, and important notes..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Proposed Date
                </label>
                <input
                  type="date"
                  name="proposedDate"
                  value={form.proposedDate}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-950 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Draft Agenda"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}