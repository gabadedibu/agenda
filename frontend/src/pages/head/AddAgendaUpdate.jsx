import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, Pencil, Trash2, Save, X } from "lucide-react";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

export default function AddAgendaUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [updates, setUpdates] = useState([]);
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUpdates = async () => {
    try {
      setUpdatesLoading(true);
      const res = await api.get(`/agendas/public/${id}`);
      setUpdates(res.data.updates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatesLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [id]);

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

      setForm({
        title: "",
        content: "",
      });
      setFile(null);

      fetchUpdates();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add update");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (update) => {
    setEditingUpdateId(update._id);
    setEditForm({
      title: update.title,
      content: update.content,
    });
  };

  const cancelEdit = () => {
    setEditingUpdateId(null);
    setEditForm({
      title: "",
      content: "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveEdit = async (updateId) => {
    try {
      await api.patch(`/agendas/updates/${updateId}`, editForm);

      alert("Update edited successfully");
      setEditingUpdateId(null);
      fetchUpdates();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to edit update");
    }
  };

  const deleteUpdate = async (updateId) => {
    const confirmDelete = confirm(
      "Delete this update? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/agendas/updates/${updateId}`);

      alert("Update deleted successfully");
      setUpdates((prev) => prev.filter((update) => update._id !== updateId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete update");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton label="Back to my agendas" />

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
                rows="6"
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

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
          <h2 className="text-xl font-bold text-slate-900">
            Existing Updates
          </h2>

          {updatesLoading ? (
            <p className="text-slate-500 mt-4">Loading updates...</p>
          ) : updates.length === 0 ? (
            <p className="text-slate-500 mt-4">No updates added yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {updates.map((update) => (
                <div
                  key={update._id}
                  className="border border-slate-200 rounded-2xl p-4"
                >
                  {editingUpdateId === update._id ? (
                    <div className="space-y-3">
                      <input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
                      />

                      <textarea
                        name="content"
                        value={editForm.content}
                        onChange={handleEditChange}
                        rows="4"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm resize-none"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => saveEdit(update._id)}
                          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-slate-900">
                        {update.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(update.createdAt).toLocaleString()}
                      </p>

                      <p className="text-sm text-slate-600 mt-3 whitespace-pre-line">
                        {update.content}
                      </p>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => startEdit(update)}
                          className="inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => deleteUpdate(update._id)}
                          className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}