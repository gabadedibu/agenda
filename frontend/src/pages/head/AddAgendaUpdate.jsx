import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import api from "../../api/axios";

export default function AddAgendaUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [file, setFile] = useState(null);
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

      const res = await api.post(`/agendas/${id}/updates`, form);
      const updateId = res.data.update._id;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("visibility", "public");

        await api.post(`/attachments/update/${updateId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Agenda update added successfully");
      navigate("/head/agendas");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/head/agendas"
          className="inline-flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to my agendas
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Add Agenda Update
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Add progress notes and optionally attach a receipt, PDF, or image.
          </p>

          {error && (
            <div className="mt-5 bg-red-50 text-red-600 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Update Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Receipt for nails purchased"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Update Details
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows="8"
                placeholder="Write the full update here..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Attach File Optional
              </label>

              <label className="flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-5 cursor-pointer hover:bg-slate-50">
                <Upload className="w-5 h-5 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {file ? file.name : "Choose PDF, PNG, JPG, or JPEG"}
                </span>

                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-950 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Adding Update..." : "Add Update"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}