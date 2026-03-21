import { useState } from "react";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { useCms, CmsCategory, CmsTag } from "@/contexts/CmsContext";
import { toast } from "sonner";

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };
const inputStyle = "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/30";
const inputBg = { background: "#0f1117", border: "1px solid #2a2d3e", color: "#f1f0eb" };
const genSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function CmsCategoriesTags({ mode }: { mode: "categories" | "tags" }) {
  const { state, dispatch, addActivity } = useCms();
  const items = mode === "categories" ? state.categories : state.tags;
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const item = { id: crypto.randomUUID(), name: newName.trim(), slug: genSlug(newName), postCount: 0 };
    if (mode === "categories") dispatch({ type: "ADD_CATEGORY", payload: item as CmsCategory });
    else dispatch({ type: "ADD_TAG", payload: item as CmsTag });
    addActivity("Created " + mode.slice(0, -1), newName);
    toast.success(`${mode === "categories" ? "Category" : "Tag"} added`);
    setNewName("");
  };

  const handleSave = () => {
    if (!editId || !editName.trim()) return;
    const existing = items.find(i => i.id === editId)!;
    const updated = { ...existing, name: editName.trim(), slug: genSlug(editName) };
    if (mode === "categories") dispatch({ type: "UPDATE_CATEGORY", payload: updated as CmsCategory });
    else dispatch({ type: "UPDATE_TAG", payload: updated as CmsTag });
    addActivity("Updated " + mode.slice(0, -1), editName);
    toast.success("Updated!");
    setEditId(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    if (mode === "categories") dispatch({ type: "DELETE_CATEGORY", payload: deleteId });
    else dispatch({ type: "DELETE_TAG", payload: deleteId });
    addActivity("Deleted " + mode.slice(0, -1), items.find(i => i.id === deleteId)?.name || "");
    toast.success("Deleted!");
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      {/* Add new */}
      <div className="flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} placeholder={`New ${mode === "categories" ? "category" : "tag"} name`} className={`${inputStyle} flex-1`} style={inputBg} />
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-transform active:scale-[0.97] shrink-0" style={{ background: "#f59e0b", color: "#0f1117" }}>
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2d3e" }}>
              {["Name", "Slug", "Posts", "Actions"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium" style={{ color: "#6b7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #2a2d3e22" }}>
                <td className="py-2.5 px-4">
                  {editId === item.id ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSave()} className={`${inputStyle} w-40`} style={inputBg} autoFocus />
                  ) : (
                    <span className="font-medium">{item.name}</span>
                  )}
                </td>
                <td className="py-2.5 px-4" style={{ color: "#9ca3af" }}>{editId === item.id ? genSlug(editName) : item.slug}</td>
                <td className="py-2.5 px-4" style={{ color: "#9ca3af" }}>{item.postCount}</td>
                <td className="py-2.5 px-4">
                  {editId === item.id ? (
                    <div className="flex gap-1">
                      <button onClick={handleSave} className="p-1.5 rounded hover:bg-green-500/10" style={{ color: "#22c55e" }} aria-label="Save"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditId(null)} className="p-1.5 rounded hover:bg-white/10" aria-label="Cancel"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => { setEditId(item.id); setEditName(item.name); }} className="p-1.5 rounded hover:bg-white/10" aria-label="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded hover:bg-red-500/10" style={{ color: "#ef4444" }} aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div onClick={e => e.stopPropagation()} className="rounded-xl p-6 max-w-sm w-full" style={{ background: "#1a1d27", border: "1px solid #2a2d3e" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Delete {mode === "categories" ? "Category" : "Tag"}?</h3>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>This will permanently remove it.</p>
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
