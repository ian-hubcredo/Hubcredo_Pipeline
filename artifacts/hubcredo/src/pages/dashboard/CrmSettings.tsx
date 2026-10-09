// src/pages/dashboard/CrmSettings.tsx
// Since ATTIO_API_KEY is set in Replit Secrets, this page just shows
// connection status and explains the sync behaviour. No API key input needed.

import { useState, useEffect } from "react";
import {
  CheckCircle2, RefreshCw, Link2, Clock,
  AlertCircle, Loader2, Building2,
} from "lucide-react";

interface ConnectionStatus {
  connected: boolean;
  workspace_id?: string;
  workspace_name?: string;
}

export function CrmSettings() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/crm/connection", {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((r) => r.json())
      .then((d) => setStatus(d.connected ? d : null))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-[rgba(22,163,74,.1)] border border-[rgba(22,163,74,.2)] flex items-center justify-center shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="2" fill="#16A34A" />
            <rect x="13" y="3" width="8" height="8" rx="2" fill="#16A34A" opacity="0.5" />
            <rect x="3" y="13" width="8" height="8" rx="2" fill="#16A34A" opacity="0.5" />
            <rect x="13" y="13" width="8" height="8" rx="2" fill="#16A34A" opacity="0.25" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-semibold text-base leading-tight">Attio CRM</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Sync approved leads as contacts in Attio. Configured via server secrets.
          </p>
        </div>
      </div>

      {/* Connection status */}
      {loading ? (
        <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#6B5CE7]" />
          <p className="text-sm text-gray-500">Checking connection…</p>
        </div>
      ) : status?.connected ? (
        <div className="flex items-center gap-3 p-4 bg-[rgba(22,163,74,.08)] border border-[rgba(22,163,74,.2)] rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-700">Attio is connected</p>
            {status.workspace_name && (
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Workspace: {status.workspace_name}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-600">Attio not connected</p>
            <p className="text-xs text-red-500 mt-0.5">
              Add{" "}
              <code className="bg-red-100 border border-red-200 px-1 rounded text-red-600">
                ATTIO_API_KEY
              </code>{" "}
              to your Replit Secrets and restart the server.
            </p>
          </div>
        </div>
      )}

      {/* How CRM sync works */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
            title: "On approval",
            desc: "Lead synced as Attio People contact",
            accent: "rgba(22,163,74,.08)",
            border: "rgba(22,163,74,.2)",
          },
          {
            icon: <RefreshCw className="w-4 h-4 text-[#6B5CE7]" />,
            title: "On reply",
            desc: "Note pushed to Attio contact",
            accent: "rgba(107,92,231,.08)",
            border: "rgba(107,92,231,.2)",
          },
          {
            icon: <Link2 className="w-4 h-4 text-[#7C6FE0]" />,
            title: "Sync badge",
            desc: "Shows synced, error, or pending",
            accent: "rgba(124,111,224,.08)",
            border: "rgba(124,111,224,.2)",
          },
          {
            icon: <Clock className="w-4 h-4 text-orange-500" />,
            title: "Manual sync",
            desc: "Re-sync from any lead card",
            accent: "rgba(234,88,12,.08)",
            border: "rgba(234,88,12,.2)",
          },
        ].map(({ icon, title, desc, accent, border }) => (
          <div
            key={title}
            className="p-3.5 rounded-xl bg-white shadow-sm"
            style={{
              background: accent,
              border: `1px solid ${border}`,
            }}
          >
            <div className="mb-2">{icon}</div>
            <p className="text-xs font-semibold text-gray-800">{title}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{desc}</p>
          </div>
        ))}
      </div>

      {/* Setup instructions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-800">Setup</h4>
        <ol className="space-y-2">
          {[
            <>
              In Attio:{" "}
              <strong className="text-gray-900 font-semibold">
                Workspace Settings → Developers → New access token
              </strong>
              . Enable{" "}
              <code className="text-xs bg-gray-100 border border-gray-200 px-1 rounded text-gray-700">
                record_permission:read-write
              </code>{" "}
              and{" "}
              <code className="text-xs bg-gray-100 border border-gray-200 px-1 rounded text-gray-700">
                note:read-write
              </code>
              .
            </>,
            <>
              In Replit: open{" "}
              <strong className="text-gray-900 font-semibold">Secrets</strong> (lock icon) → add key{" "}
              <code className="text-xs bg-gray-100 border border-gray-200 px-1 rounded text-gray-700">
                ATTIO_API_KEY
              </code>{" "}
              → paste your token.
            </>,
            <span className="text-gray-500">
              Restart the Replit server. The status above will turn green.
            </span>,
          ].map((text, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#6B5CE7] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}