import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";
export default function EditAgenda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    proposedDate: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const res = await api.get("/agendas/my");
        const agenda = res.data.agendas.find((item) => item._id === id);

        if (!agenda) {
          alert("Agenda not found");
          navigate("/head/agendas");
          return;
        }

        if (!["draft", "rejected", "needs_revision"].includes(agenda.status)) {
          alert("This agenda cannot be edited now");
          navigate("/head/agendas");
          return;
        }

        setForm({
          title: agenda.title || "",
          summary: agenda.summary || "",
          description: agenda.description || "",
          proposedDate: agenda.proposedDate
            ? agenda.proposedDate.slice(0, 10)
            : "",
          priority: agenda.priority || "medium",
        });
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load agenda");
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await api.patch(`/agendas/${id}`, form);

      alert("Agenda updated successfully");
      navigate("/head/agendas");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update agenda");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="p-6">Loading agenda...</main>;
  <BackButton />

  return (
    <main className="min-h-screen bg-slate-50 p-6">
        <BackButton label="Back to my agendas" />
      <div className="max-w-3xl mx-auto">
        <Link
          to="/head/agendas"
          className="inline-flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to my agendas
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Edit Agenda</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Agenda title"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
            />

            <input
              name="summary"
              value={form.summary}
              onChange={handleChange}
              required
              placeholder="Agenda summary"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="7"
              placeholder="Full description"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="date"
                name="proposedDate"
                value={form.proposedDate}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
              />

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button
              disabled={saving}
              className="w-full bg-slate-950 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}