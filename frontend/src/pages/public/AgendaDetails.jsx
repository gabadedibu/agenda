import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Calendar,
  Building2,
  Download,
  FileText,
  Clock,
  ArrowLeft,
  Eye,
} from "lucide-react";
import api from "../../api/axios";

export default function AgendaDetails() {
  const { id } = useParams();
  const [agenda, setAgenda] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fileBaseUrl = import.meta.env.VITE_API_URL;

  const fetchDetails = async () => {
    try {
      setLoading(true);

      const agendaRes = await api.get(`/agendas/public/${id}`);
      setAgenda(agendaRes.data.agenda);
      setUpdates(agendaRes.data.updates || []);

      const filesRes = await api.get(`/attachments/agenda/${id}`);
      setAttachments(filesRes.data.attachments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-slate-500">Loading agenda details...</p>
      </main>
    );
  }

  if (!agenda) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-slate-600">Agenda not found.</p>
      </main>
    );
  }

  const FileActions = ({ file }) => (
    <div className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl p-3 hover:bg-slate-50">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <span className="text-sm text-slate-700 truncate">
          {file.fileName}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href={`${fileBaseUrl}/attachments/preview/${file._id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </a>

        <a
          href={`${fileBaseUrl}/attachments/download/${file._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-lg"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/agendas"
            className="inline-flex items-center gap-2 text-emerald-400 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to agendas
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-emerald-400 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to homepage
          </Link>

          <div className="mt-8">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
              Approved
            </span>

            <h1 className="text-3xl md:text-5xl font-bold mt-4">
              {agenda.title}
            </h1>

            <p className="text-slate-300 mt-4 max-w-3xl">
              {agenda.summary}
            </p>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {agenda.departmentId?.name}
              </span>

              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {agenda.proposedDate
                  ? new Date(agenda.proposedDate).toLocaleDateString()
                  : "No proposed date"}
              </span>

              <span className="capitalize">Priority: {agenda.priority}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-xl text-slate-900">
              Agenda Description
            </h2>

            <p className="text-slate-600 mt-4 leading-7 whitespace-pre-line">
              {agenda.description}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-xl text-slate-900">
              Progress Updates
            </h2>

            {updates.length === 0 ? (
              <p className="text-slate-500 mt-4 text-sm">
                No public updates yet.
              </p>
            ) : (
              <div className="mt-6 space-y-5">
                {updates.map((update) => (
                  <div
                    key={update._id}
                    className="relative pl-8 pb-5 border-l border-slate-200"
                  >
                    <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      {update.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(update.createdAt).toLocaleString()}
                    </p>

                    <p className="text-slate-600 text-sm mt-3 leading-6 whitespace-pre-line">
                      {update.content}
                    </p>

                    {update.attachments && update.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-bold text-slate-500">
                          Attached Files
                        </p>

                        {update.attachments.map((file) => (
                          <FileActions key={file._id} file={file} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-900">Downloads</h2>

            {attachments.length === 0 ? (
              <p className="text-sm text-slate-500 mt-3">
                No public files available.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {attachments.map((file) => (
                  <FileActions key={file._id} file={file} />
                ))}
              </div>
            )}
          </div>
        </aside> */}
      </section>
    </main>
  );
}