import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";

type ToastItem = {
  id: string;
  content: ReactNode;
};

const toastsAtom = atom<Array<ToastItem>>([]);

const addToastAtom = atom(null, (get, set, content: ToastItem["content"]) => {
  const toastId = uuidv4();
  const toast: ToastItem = { id: toastId, content };

  const toasts = get(toastsAtom);
  set(toastsAtom, [...toasts, toast]);

  return toastId;
});

const removeToastAtom = atom(null, (get, set, id: string) => {
  const toasts = get(toastsAtom);
  set(
    toastsAtom,
    toasts.filter((toast) => toast.id !== id),
  );
});

function useToast() {
  return useSetAtom(addToastAtom);
}

const TOAST_DURATION = 1000;

type ToastProps = {
  toast: ToastItem;
};

function Toast({ toast }: ToastProps) {
  const removeToast = useSetAtom(removeToastAtom);

  useEffect(() => {
    setTimeout(() => removeToast(toast.id), TOAST_DURATION);
    // should not clean up
  });

  return <div className="toast">{toast.content}</div>;
}

function ToastContainer() {
  const toastItems = useAtomValue(toastsAtom);

  return createPortal(
    <div className="toast-container">
      {toastItems.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  );
}

export default ToastContainer;
export { useToast };
