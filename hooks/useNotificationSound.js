import { useEffect, useState } from "react";

export const useNotificationSound = (src) => {
  const [audio, setAudio] = useState(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const sound = new Audio(src); // make sure this path is correct
    setAudio(sound);
  }, []);

  const unlockAudio = () => {
    if (audio) {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        setCanPlay(true);
      }).catch(() => {
        console.warn("🔇 User has not interacted yet. Can't unlock audio.");
      });
    }
  };

  const playSound = () => {
    if (canPlay && audio) {
      audio.play().catch(err => {
        console.error("🔈 Failed to play sound:", err);
      });
    }
  };

  return { unlockAudio, playSound, canPlay };
};
