import { useEffect, useState, useRef } from "react";

const PomodoroTimer = () => {
  const [duration, setDuration] = useState(25 * 60); // 25 mins default
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            audioRef.current?.play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setRemaining(duration);
  };

  const handleChangeDuration = (mins: number) => {
    pauseTimer();
    const seconds = mins * 60;
    setDuration(seconds);
    setRemaining(seconds);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-pink-200 via-red-200 to-yellow-200 p-6 rounded-lg shadow-md w-full max-w-md mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">🍅 Pomodoro Focus Timer</h2>
      <div className="text-5xl font-mono bg-white text-black p-4 rounded-lg border-4 border-red-500 inline-block mb-4">
        {formatTime(remaining)}
      </div>
      <div className="space-x-3 mb-4">
        <button
          onClick={startTimer}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Start
        </button>
        <button
          onClick={pauseTimer}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Pause
        </button>
        <button
          onClick={resetTimer}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      <div className="space-x-2">
        <button
          onClick={() => handleChangeDuration(25)}
          className="text-sm px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
        >
          Pomodoro (25)
        </button>
        <button
          onClick={() => handleChangeDuration(5)}
          className="text-sm px-3 py-1 bg-green-200 rounded hover:bg-green-300"
        >
          Short Break (5)
        </button>
        <button
          onClick={() => handleChangeDuration(15)}
          className="text-sm px-3 py-1 bg-purple-200 rounded hover:bg-purple-300"
        >
          Long Break (15)
        </button>
      </div>

      <audio ref={audioRef}>
        <source
          src="https://www.soundjay.com/buttons/beep-07.wav"
          type="audio/wav"
        />
      </audio>
    </div>
  );
};

export default PomodoroTimer;
