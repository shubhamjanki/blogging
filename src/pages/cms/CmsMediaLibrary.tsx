import { useState } from "react";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import { useCms } from "@/contexts/CmsContext";
import { toast } from "sonner";

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };

export default function CmsMediaLibrary() {
  const { state, dispatch, addActivity } = useCms();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleUpload = () => {
    const idx = Math.floor(Math.random() * 100) + 50;
    const media = {
      id: crypto.randomUUID(),
      name: `upload-${Date.now()}.jpg`,
      url: `https://picsum.photos/seed/${idx}/600/400`,
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
      date: new Date().toISOString().split("T")[0],
    };
    dispatch({ type: "ADD_MEDIA", payload: media });
    addActivity("Uploaded", media.name);
    toast.success("Image uploaded!");
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    toast.success("URL copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const item = state.media.find(m => m.id === deleteId);
    dispatch({ type: "DELETE_MEDIA", payload: deleteId });
    addActivity("Deleted media", item?.name || "file");
    toast.success("Media deleted");
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={handleUpload} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-transform active:scale-[0.97]" style={{ background: "#f59e0b", color: "#0f1117" }}>
          <Upload className="w-4 h-4" /> Upload Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {state.media.map(m => (
          <div key={m.id} className="rounded-xl overflow-hidden group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg" style={cardStyle}>
            <div className="aspect-video relative overflow-hidden">
              <img src={m.url} alt={m.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => handleCopy(m.url, m.id)} className="p-2 rounded-lg bg-black/60 hover:bg-black/80 transition-colors" aria-label="Copy URL">
                  {copied === m.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => setDeleteId(m.id)} className="p-2 rounded-lg bg-black/60 hover:bg-red-600/80 transition-colors" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium truncate">{m.name}</p>
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: "#6b7280" }}>{m.size}</span>
                <span className="text-xs" style={{ color: "#6b7280" }}>{m.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div onClick={e => e.stopPropagation()} className="rounded-xl p-6 max-w-sm w-full" style={{ background: "#1a1d27", border: "1px solid #2a2d3e" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Delete Media?</h3>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>This file will be permanently removed.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg text-sm" style={{ border: "1px solid #2a2d3e" }}>Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "#ef4444", color: "#fff" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
