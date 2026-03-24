import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };
const BUCKET = "avatars";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  date: string;
}

export default function CmsMediaLibrary() {
  const { user } = useAuth();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFolder = () => `${user!.id}/article-images`;

  const fetchMedia = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(getFolder(), { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (!error && data) {
      const items: MediaItem[] = data
        .filter(item => item.name !== ".emptyFolderPlaceholder")
        .map(item => {
          const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(`${getFolder()}/${item.name}`);
          return {
            id: item.id || item.name,
            name: item.name,
            url: urlData.publicUrl,
            size: item.metadata?.size ? `${(item.metadata.size / 1024 / 1024).toFixed(1)} MB` : "—",
            date: item.created_at ? item.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
          };
        });
      setMedia(items);
    }
    setLoading(false);
  };

  useEffect(() => { if (user) fetchMedia(); }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, and GIF images are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }

    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${getFolder()}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Image uploaded!");
      await fetchMedia();
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    toast.success("URL copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteId || !user) return;
    const item = media.find(m => m.id === deleteId);
    if (!item) return;

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([`${getFolder()}/${item.name}`]);

    if (error) {
      toast.error(error.message);
      return;
    }
    setMedia(prev => prev.filter(m => m.id !== deleteId));
    toast.success("Media deleted");
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          id="media-upload"
        />
        <label
          htmlFor="media-upload"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-transform active:scale-[0.97] cursor-pointer select-none"
          style={{ background: uploading ? "#4b5563" : "#f59e0b", color: "#0f1117", pointerEvents: uploading ? "none" : "auto" }}
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Image"}
        </label>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "#6b7280" }}>Loading media...</div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={cardStyle}>
          <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: "#4b5563" }} />
          <p className="text-sm" style={{ color: "#6b7280" }}>No images yet. Click "Upload Image" to add your first image.</p>
          <p className="text-xs mt-1" style={{ color: "#4b5563" }}>Supported: JPEG, PNG, WebP, GIF — max 10 MB</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(m => (
            <div key={m.id} className="rounded-xl overflow-hidden group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg" style={cardStyle}>
              <div className="aspect-video relative overflow-hidden">
                <img src={m.url} alt={m.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleCopy(m.url, m.id)} className="p-2 rounded-lg bg-black/60 hover:bg-black/80 transition-colors" aria-label="Copy URL">
                    {copied === m.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setDeleteId(m.id)} className="p-2 rounded-lg bg-black/60 hover:bg-red-600/80 transition-colors" aria-label="Delete">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium truncate" title={m.name}>{m.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{m.size} · {m.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div onClick={e => e.stopPropagation()} className="rounded-xl p-6 max-w-sm w-full" style={{ background: "#1a1d27", border: "1px solid #2a2d3e" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Delete Image?</h3>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>This will permanently remove the image from storage.</p>
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
