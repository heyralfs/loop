import Button from "../button";
import Modal from "../modal";
import styles from "./index.module.css";
import { useTranslations } from "../../i18n";

interface Props {
  open: boolean;
  onClose: () => void;
}

// A one-time "New: swipe to move" nudge for returning players.
function SwipeAnnouncement({ open, onClose }: Props) {
  const t = useTranslations();

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t.swipeNews.heading}</h2>
        <p className={styles.body}>{t.swipeNews.body}</p>
        <Button className={styles.button} onClick={onClose}>
          {t.swipeNews.cta}
        </Button>
      </div>
    </Modal>
  );
}

export default SwipeAnnouncement;
