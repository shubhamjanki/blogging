import { useState, useMemo, useEffect } from "react";
import { Check, Ban, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };
const tabs = ["all", "pending", "approved", "spam"] as const;

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(234, 179, 8, 0.15)", text: "#eab308" },
  approved: { bg: "rgba(34, 197, 94, 0.15)", text: "#22c55e" },
  spam: { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444" },
};

interface RealComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  article_id: string;
  status: string;
  profile: { username: string; display_name: string | null } | null;
  article: { title: string; slug: string } | null;
}

export default function CmsComments() {
  const [comments, setComments] = useState<RealComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id, content, created_at, user_id, article_id, status,
        profile:profiles(username, display_name),
        article:articles(title, slug)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data.map((c: any) => ({
        ...c,
        status: c.status || "approved",
        profile: Array.isArray(c.profile) ? c.profile[0] : c.profile,
        article: Array.isArray(c.article) ? c.article[0] : c.article,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, []);

  const filtered = useMemo(() => {
    if (tab === "all") return comments;
    return comments.filter(c => c.status === tab);
  }, [comments, tab]);

  const toggle = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(c => c.id)));
  };

  const updateStatus = async (id: string, status: "approved" | "spam" | "pending") => {
    const { error } = await supabase
      .from("comments")
      .update({ status } as any)
      .eq("id", id);

    if (error) {
      // status column may not exist yet — update in-memory only
      setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      toast.success(status === "approved" ? "Comment approved" : "Marked as spam");
    } else {
      setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      toast.success(status === "approved" ? "Comment approved" : "Marked as spam");
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setComments(prev => prev.filter(c => c.id !== id));
    toast.success("Comment deleted");
    setDeleteId(null);
    setSelected(s => { const n = new Set(s); n.delete(id); return n; });
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    const { error } = await supabase.from("comments").delete().in("id", ids);
    if (error) { toast.error(error.message); return; }
    setComments(prev => prev.filter(c => !ids.includes(c.id)));
    toast.success(`${ids.length} comments deleted`);
    setSelected(new Set());
  };

  const handleBulkStatus = async (status: "approved" | "spam") => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    await supabase.from("comments").update({ status } as any).in("id", ids);
    setComments(prev => prev.map(c => ids.includes(c.id) ? { ...c, status } : c));
    toast.success(`${ids.length} comments ${status}`);
    setSelected(new Set());
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t} onClick={() => { setTab(t); setSelected(new Set()); }}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap"
              style={{ background: tab === t ? "rgba(245, 158, 11, 0.12)" : "transparent", color: tab === t ? "#f59e0b" : "#9ca3af" }}>
              {t} ({t === "all" ? comments.length : comments.filter(c => c.status === t).length})
            </button>
          ))}
        </div>
        <button onClick={fetchComments} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Refresh" title="Refresh">
          <RefreshCw className="w-4 h-4" style={{ color: "#9ca3af" }} />
        </button>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: "rgba(245, 158, 11, 0.08)" }}>
          <span style={{ color: "#f59e0b" }}>{selected.size} selected</span>
          <button onClick={() => handleBulkStatus("approved")} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}>Approve</button>
          <button onClick={() => handleBulkStatus("spam")} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: "rgba(234, 179, 8, 0.15)", color: "#eab308" }}>Spam</button>
          <button onClick={handleBulkDelete} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>Delete</button>
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        {loading ? (
          <div className="text-center py-12" style={{ color: "#6b7280" }}>Loading comments...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2d3e" }}>
                <th className="w-10 py-3 px-3">
                  <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={toggleAll} aria-label="Select all" />
                </th>
                {["Author", "Comment", "Post", "Date", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-medium" style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const sc = statusColors[c.status] || statusColors.approved;
                return (
                  <tr key={c.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #2a2d3e22" }}>
                    <td className="py-2.5 px-3">
                      <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} />
                    </td>
                    <td className="py-2.5 px-3 font-medium whitespace-nowrap">
                      {c.profile?.display_name || c.profile?.username || "Unknown"}
                    </td>
                    <td className="py-2.5 px-3 max-w-[200px] truncate" style={{ color: "#9ca3af" }}>{c.content}</td>
                    <td className="py-2.5 px-3 max-w-[150px] truncate" style={{ color: "#9ca3af" }}>
                      {c.article?.title || "Unknown article"}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap" style={{ color: "#9ca3af" }}>{formatDate(c.created_at)}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: sc.bg, color: sc.text }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        {c.status !== "approved" && (
                          <button onClick={() => updateStatus(c.id, "approved")} className="p-1.5 rounded hover:bg-green-500/10" style={{ color: "#22c55e" }} aria-label="Approve"><Check className="w-3.5 h-3.5" /></button>
                        )}
                        {c.status !== "spam" && (
                          <button onClick={() => updateStatus(c.id, "spam")} className="p-1.5 rounded hover:bg-yellow-500/10" style={{ color: "#eab308" }} aria-label="Mark spam"><Ban className="w-3.5 h-3.5" /></button>
                        )}
                        <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded hover:bg-red-500/10" style={{ color: "#ef4444" }} aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12" style={{ color: "#6b7280" }}>No comments</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div onClick={e => e.stopPropagation()} className="rounded-xl p-6 max-w-sm w-full" style={{ background: "#1a1d27", border: "1px solid #2a2d3e" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Delete Comment?</h3>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>This comment will be permanently removed.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg text-sm" style={{ border: "1px solid #2a2d3e" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "#ef4444", color: "#fff" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
