import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

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
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
          placeholder="Department name"
        />

        <input
          name="code"
          value={editForm.code}
          onChange={handleEditChange}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm uppercase"
          placeholder="Department code"
        />

        <textarea
          name="description"
          value={editForm.description}
          onChange={handleEditChange}
          rows="3"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none"
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