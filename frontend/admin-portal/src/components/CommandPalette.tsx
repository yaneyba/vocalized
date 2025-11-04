import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Slash } from "lucide-react";
import { cn } from "../lib/utils";

export interface CommandPaletteItem {
  label: string;
  description?: string;
  shortcut?: string;
  href: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandPaletteItem[];
}

export function CommandPalette({ open, onClose, items }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const lower = query.toLowerCase();
    return items.filter((item) =>
      [item.label, item.description]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(lower)),
    );
  }, [items, query]);

  const handleSelect = (item: CommandPaletteItem) => {
    onClose();
    navigate(item.href);
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (open) {
      window.addEventListener("keydown", handler);
    }
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 py-12 backdrop-blur">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search actions, pages, or features"
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <div className="flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-400">
            <Slash className="h-3 w-3" />
            Esc
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-500">No results. Try another keyword.</p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {filtered.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-slate-200 transition hover:bg-slate-800/80"
                  >
                    <span>
                      <span className="font-semibold text-white">{item.label}</span>
                      {item.description ? (
                        <span className="ml-2 text-xs text-slate-500">{item.description}</span>
                      ) : null}
                    </span>
                    {item.shortcut ? (
                      <span className="rounded-lg border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-400">
                        {item.shortcut}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
