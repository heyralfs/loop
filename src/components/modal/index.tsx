import { useEffect, useRef, type ReactNode } from "react";
import styles from "./index.module.css";
import { useTranslations } from "../../i18n";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ open, onClose, children }: Props) {
  const t = useTranslations();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop lands on the <dialog> itself (its content
        // fills the rest), so treat those as a request to close.
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label={t.close}
      >
        ✕
      </button>
      {children}
    </dialog>
  );
}

export default Modal;
