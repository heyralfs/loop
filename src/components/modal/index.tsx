import { useEffect, useRef, type ReactNode } from "react";
import styles from "./index.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ open, onClose, children }: Props) {
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
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      {children}
    </dialog>
  );
}

export default Modal;
