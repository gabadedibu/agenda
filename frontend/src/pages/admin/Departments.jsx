import { useEffect, useState } from "react";
import { Building2, Plus, RefreshCw, UserPlus, Pencil } from "lucide-react";
import api from "../../api/axios";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    departmentName: "",
    departmentCode: "",
    departmentDescription: "",
    headName: "",
    headEmail: "",
    temporaryPassword: "",
  });

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true,
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/departments");
      setDepartments(res.data.departments || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setCreating(true);
      await api.post("/departments/create-with-head", form);

      setMessage("Department and department head created successfully.");

      setForm({
        departmentName: "",
        departmentCode: "",
        departmentDescription: "",
        headName: "",
        headEmail: "",
        temporaryPassword: "",
      });

      fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create department");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (department) => {
    setEditingDepartment(department);
    setEditForm({
      name: department.name,
      code: department.code,
      description: department.description || "",
      isActive: department.isActive,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/departments/${editingDepartment._id}`, editForm);

      alert("Department updated successfully");
      setEditingDepartment(null);
      fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update department");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Departments</h1>
            <p className="text-slate-500 mt-2">
              Create departments and register department heads.
            </p>
          </div>

          <button
            onClick={fetchDepartments}
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-xl font-semibold text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <section className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-950 text-white flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Add Department</h2>
                <p className="text-xs text-slate-500">
                  Create department + login account
                </p>
              </div>
            </div>

            {message && (
              <div className="mt-5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm p-3 rounded-xl">
                {message}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <input
                name="departmentName"
                value={form.departmentName}
                onChange={handleChange}
                required
                placeholder="Department Name"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
              />

              <input
                name="departmentCode"
                value={form.departmentCode}
                onChange={handleChange}
                required
                placeholder="Department Code"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none uppercase"
              />

              <textarea
                name="departmentDescription"
                value={form.departmentDescription}
                onChange={handleChange}
                rows="3"
                placeholder="Short department description"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none"
              />

              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-bold text-slate-900 mb-3">
                  Department Head Login
                </p>

                <div className="space-y-4">
                  <input
                    name="headName"
                    value={form.headName}
                    onChange={handleChange}
                    required
                    placeholder="Head full name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
                  />

                  <input
                    type="email"
                    name="headEmail"
                    value={form.headEmail}
                    onChange={handleChange}
                    required
                    placeholder="head@example.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
                  />

                  <input
                    type="text"
                    name="temporaryPassword"
                    value={form.temporaryPassword}
                    onChange={handleChange}
                    required
                    placeholder="Temporary password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <button
                disabled={creating}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-950 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {creating ? "Creating..." : "Create Department + Head"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">All Departments</h2>

              {loading ? (
                <p className="mt-5 text-slate-500">Loading departments...</p>
              ) : departments.length === 0 ? (
                <p className="mt-5 text-slate-500">No department created yet.</p>
              ) : (
                <div className="mt-5 space-y-3">
                  {departments.map((department) => (
                    <div
                      key={department._id}
                      className="border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                          <Building2 className="w-5 h-5" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            {department.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Code: {department.code}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            {department.description || "No description"}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm md:text-right">
                        <p className="font-semibold text-slate-700">
                          {department.headId?.name || "No head assigned"}
                        </p>
                        <p className="text-slate-500">
                          {department.headId?.email || ""}
                        </p>

                        <span
                          className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${
                            department.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {department.isActive ? "Active" : "Inactive"}
                        </span>

                        <button
                          onClick={() => startEdit(department)}
                          className="mt-3 inline-flex items-center justify-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {editingDepartment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-900">
              Edit Department
            </h2>

            <form onSubmit={handleUpdateDepartment} className="mt-5 space-y-4">
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
                placeholder="Department name"
              />

              <input
                name="code"
                value={editForm.code}
                onChange={handleEditChange}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none uppercase"
                placeholder="Department code"
              />

              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                rows="3"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                placeholder="Description"
              />

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editForm.isActive}
                  onChange={handleEditChange}
                />
                Department is active
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDepartment(null)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>

                <button className="flex-1 bg-slate-950 text-white py-3 rounded-xl font-semibold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}