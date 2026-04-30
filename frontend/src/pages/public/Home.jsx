import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900">
              Agenda Management System
            </span>
          </div>

          <Link
            to="/login"
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Staff Login
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 max-w-3xl mx-auto">
          Public Departmental Agenda Portal
        </h1>

        <p className="text-slate-600 mt-5 max-w-2xl mx-auto leading-7">
          View approved departmental agendas, progress updates, and supporting
          public documents from one central platform.
        </p>

        <div className="mt-8">
          <Link
            to="/agendas"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            View Approved Agendas
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-5">
        {[
          "Approved agendas only",
          "Progress updates",
          "Downloadable public documents",
        ].map((item) => (
          <div
            key={item}
            className="bg-white border border-slate-200 rounded-2xl p-6 text-center"
          >
            <p className="font-semibold text-slate-800">{item}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
