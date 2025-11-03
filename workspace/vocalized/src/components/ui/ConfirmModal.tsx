import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { ShieldAlert, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon = <ShieldAlert className="h-5 w-5 text-primary" />,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="rounded-full bg-primary/10 p-2">{icon}</div>
            <h3 className="text-base font-semibold">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close confirm modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-6 px-6 py-6 text-sm text-slate-600">
          <p>{description}</p>
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost border border-slate-200"
            >
              {cancelLabel}
            </button>
            <button type="button" className="btn-primary" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

