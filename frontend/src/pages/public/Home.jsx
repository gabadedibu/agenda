import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-emerald-400 font-semibold mb-3">
            Transparent Departmental Planning
          </p>

          <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
            Agenda Management System
          </h1>

          <p className="text-slate-300 mt-5 max-w-2xl">
            View approved departmental agendas, progress updates, receipts,
            reports, and supporting documents in one secure public portal.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/agendas"
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              View Agendas
            </Link>

            <Link
              to="/login"
              className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}