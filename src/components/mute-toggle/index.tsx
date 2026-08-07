import { useState } from "react";
import { isMuted, persistMuted, play } from "../../audio/sounds";
import IconButton from "../icon-button";

function MuteToggle() {
  const [muted, setMuted] = useState(() => isMuted());

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    persistMuted(next);
    if (!next) play("click");
  };

  return (
    <IconButton
      label={muted ? "Unmute sound" : "Mute sound"}
      pressed={muted}
      onClick={toggle}
    >
      {/* speaker body — shared by both states */}
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {muted ? (
        /* an X — sound off */
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        /* sound waves — sound on */
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      )}
    </IconButton>
  );
}

export default MuteToggle;
