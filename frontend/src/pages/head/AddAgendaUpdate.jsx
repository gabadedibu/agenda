import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Upload, Pencil, Trash2, Save, X } from "lucide-react";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

export default function AddAgendaUpdate() {
  const { id } = useParams();

  const [form, setForm] = useState({ title: "", content: "" });
  const [updates, setUpdates] = useState([]);
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUpdates = async () => {
    try {
      setUpdatesLoading(true);
      const res = await api.get(`/agendas/public/${id}`);
      setUpdates(res.data.updates || []);
    } finally {
      setUpdatesLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await api.post(`/agendas/${id}/updates`, form);
      const updateId = res.data.update._id;

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("visibility", "public");

        await api.post(`/attachments/update/${updateId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Agenda update added successfully");
      setForm({ title: "", content: "" });
      setFiles([]);
      fetchUpdates();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add update");
    } finally {
      setLoading(false);
    }
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
    if (!confirm("Delete this update?")) return;

    try {
      await api.delete(`/agendas/updates/${updateId}`);
      setUpdates((prev) => prev.filter((update) => update._id !== updateId));
      alert("Update deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete update");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton label="Back to my agendas" />

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Add Agenda Update</h1>

          {error && (
            <div className="mt-5 bg-red-50 text-red-600 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <input
              name="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Update title"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
            />

            <textarea
              name="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows="6"
              placeholder="Write the update here..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm resize-none"
            />

            <label className="flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-5 cursor-pointer hover:bg-slate-50">
              <Upload className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-600">
                {files.length > 0
                  ? `${files.length} file(s) selected`
                  : "Choose PDF, PNG, JPG, or JPEG"}
              </span>

              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className="hidden"
              />
            </label>

            <button
              disabled={loading}
              className="w-full bg-slate-950 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Adding Update..." : "Add Update"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
          <h2 className="text-xl font-bold text-slate-900">Existing Updates</h2>

          {updatesLoading ? (
            <p className="text-slate-500 mt-4">Loading updates...</p>
          ) : updates.length === 0 ? (
            <p className="text-slate-500 mt-4">No updates added yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {updates.map((update) => (
                <div key={update._id} className="border border-slate-200 rounded-2xl p-4">
                  {editingUpdateId === update._id ? (
                    <div className="space-y-3">
                      <input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                      />

                      <textarea
                        value={editForm.content}
                        onChange={(e) =>
                          setEditForm({ ...editForm, content: e.target.value })
                        }
                        rows="4"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none"
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
                          onClick={() => setEditingUpdateId(null)}
                          className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-slate-900">{update.title}</h3>
                      <p className="text-sm text-slate-600 mt-3 whitespace-pre-line">
                        {update.content}
                      </p>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => {
                            setEditingUpdateId(update._id);
                            setEditForm({
                              title: update.title,
                              content: update.content,
                            });
                          }}
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