import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* NAV */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* LOGO AREA */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
             <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            </div>
         
          </div>

          <Link
            to="/login"
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Staff Login
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        {/* LOGO BIG */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-bold">
            
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 max-w-3xl mx-auto">
          Public Departmental Agenda Portal
        </h1>

        <p className="text-slate-600 mt-5 max-w-2xl mx-auto leading-7">
          Access approved departmental agendas and verified updates in one
          transparent and centralized platform.
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
    </main>
  );
}