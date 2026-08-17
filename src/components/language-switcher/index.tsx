import {
  useLanguage,
  useTranslations,
  setLanguage,
  type Language,
} from "../../i18n";
import styles from "./index.module.css";

const OPTIONS: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
];

function LanguageSwitcher() {
  const current = useLanguage();
  const t = useTranslations();

  return (
    <div className={styles.group} role="group" aria-label={t.language}>
      {OPTIONS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={styles.option}
          aria-pressed={current === code}
          onClick={() => setLanguage(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
