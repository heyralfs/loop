import { useState } from "react";
import {
  useCanInstall,
  promptInstall,
  snoozeInstall,
  wasRecentlyDismissed,
} from "../../pwa/install";
import { useTranslations } from "../../i18n";
import { track } from "../../analytics";
import styles from "./index.module.css";

function InstallBanner() {
  const canInstall = useCanInstall();
  const t = useTranslations();
  const [hidden, setHidden] = useState(() => wasRecentlyDismissed());

  if (!canInstall || hidden) {
    return null;
  }

  const install = async () => {
    const outcome = await promptInstall();

    if (outcome === "accepted") {
      track("pwa-install-accepted", "PWA installed");
    } else if (outcome === "dismissed") {
      track("pwa-install-declined", "PWA install declined");
    }

    if (outcome !== "unavailable") {
      snoozeInstall();
      setHidden(true);
    }
  };

  const dismiss = () => {
    snoozeInstall();
    setHidden(true);
  };

  return (
    <div
      className={styles.bar}
      role="region"
      aria-labelledby="install-banner-heading"
    >
      <div className={styles.banner}>
        <span id="install-banner-heading" className={styles.text}>
          {t.installPrompt}
        </span>
        <div className={styles.actions}>
          <button type="button" className={styles.install} onClick={install}>
            {t.install}
          </button>
          <button
            type="button"
            className={styles.dismiss}
            onClick={dismiss}
            aria-label={t.dismiss}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallBanner;
