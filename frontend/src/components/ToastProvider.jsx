import { createContext, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function show(message, type = "info") {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  const api = useMemo(
    () => ({
      success: (m) => show(m, "success"),
      error: (m) => show(m, "error"),
      info: (m) => show(m, "info"),
    }),
    []
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[999] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-[360px] px-4 py-3 rounded-xl border shadow-sm bg-white text-sm ${
              t.type === "success"
                ? "border-emerald-200"
                : t.type === "error"
                ? "border-red-200"
                : "border-slate-200"
            }`}
          >
            <div
              className={`font-semibold mb-1 ${
                t.type === "success"
                  ? "text-emerald-700"
                  : t.type === "error"
                  ? "text-red-700"
                  : "text-slate-700"
              }`}
            >
              {t.type === "success"
                ? "Success"
                : t.type === "error"
                ? "Error"
                : "Info"}
            </div>
            <div className="text-slate-700">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
