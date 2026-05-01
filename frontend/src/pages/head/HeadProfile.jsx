import { useEffect, useState } from "react";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

export default function HeadProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");

      setForm((prev) => ({
        ...prev,
        name: res.data.user.name || "",
        email: res.data.user.email || "",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateName = async (e) => {
    e.preventDefault();

    try {
      setSavingName(true);

      await api.patch("/auth/me", {
        name: form.name,
      });

      alert("Name updated successfully");
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword) {
      alert("Please enter current password and new password");
      return;
    }

    try {
      setSavingPassword(true);

      await api.patch("/auth/me", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert("Password changed successfully");

      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <main className="p-6">Loading profile...</main>;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-xl mx-auto">
        <BackButton />

        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-2">
            Update your profile name or change your password separately.
          </p>

          <form onSubmit={updateName} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                value={form.email}
                disabled
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 text-slate-500"
              />
            </div>

            <button
              disabled={savingName}
              className="w-full bg-slate-950 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {savingName ? "Saving Name..." : "Update Name"}
            </button>
          </form>

          <form
            onSubmit={updatePassword}
            className="mt-8 border-t border-slate-100 pt-6 space-y-4"
          >
            <div>
              <h2 className="font-bold text-slate-900">Change Password</h2>
              <p className="text-sm text-slate-500 mt-1">
                Fill both fields only when you want to change your password.
              </p>
            </div>

            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="Current password"
            />

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="New password"
            />

            <button
              disabled={savingPassword}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {savingPassword ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}