import type { PropsWithChildren, ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, CircleX } from "lucide-react";
import { createPortal } from "react-dom";

export type ToastVariant = "success" | "error" | "info";

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ReactNode;
}

interface Toast extends ToastOptions {
  id: string;
  createdAt: number;
}

interface ToastContextValue {
  pushToast: (options: ToastOptions) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastIcons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  error: <CircleX className="h-4 w-4 text-rose-500" />,
  info: <CircleAlert className="h-4 w-4 text-primary" />,
};

const variantClasses: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50",
  error: "border-rose-200 bg-rose-50",
  info: "border-primary/10 bg-primary/5",
};

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? crypto.randomUUID();
      const variant = options.variant ?? "info";
      const toast: Toast = {
        ...options,
        id,
        variant,
        duration: options.duration ?? 5000,
        createdAt: Date.now(),
      };

      setToasts((current) => [...current.filter((t) => t.id !== id), toast]);

      window.setTimeout(() => dismissToast(id), toast.duration);
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ pushToast, dismissToast }), [pushToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-sm ${variantClasses[toast.variant ?? "info"]}`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-1">{toastIcons[toast.variant ?? "info"]}</span>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                  {toast.description ? (
                    <p className="text-sm text-slate-600">{toast.description}</p>
                  ) : null}
                  {toast.action ? <div>{toast.action}</div> : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <CircleX className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

