import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext({ notify: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const seq = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message) => {
      if (!message) return;
      seq.current += 1;
      const id = seq.current;
      setToasts((list) => [...list.slice(-2), { id, message }]);
      window.setTimeout(() => dismiss(id), 2400);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <span className="toast__dot" aria-hidden="true" />
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
