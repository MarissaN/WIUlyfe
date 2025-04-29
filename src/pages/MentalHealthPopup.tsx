import { useEffect, useState } from "react";

const MentalHealthPopup = () => {
  const [showTip, setShowTip] = useState(false);
  const [tip, setTip] = useState("");

  const tips = [
    "Take a short walk to clear your mind.",
    "Drink water and stay hydrated.",
    "Celebrate small wins today!",
    "Breathe deeply and relax your shoulders.",
    "It's okay to take breaks.",
    "Talk to someone you trust.",
  ];

  let timer: ReturnType<typeof setTimeout>;
  let interval: ReturnType<typeof setInterval>;

  useEffect(() => {
    const showRandomTip = () => {
      setTip(tips[Math.floor(Math.random() * tips.length)]);
      setShowTip(true);

      timer = setTimeout(() => {
        setShowTip(false);
      }, 2 * 60 * 1000);
    };

    showRandomTip();

    interval = setInterval(showRandomTip, 30 * 1000); // every 30 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!showTip) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 text-gray-800 p-4 rounded-lg shadow-lg max-w-xs animate-fadeIn">
      <div className="flex justify-between items-center mb-2">
        <strong>Mental Health Tip 💡</strong>
        <button
          onClick={() => setShowTip(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      </div>
      <p className="text-sm">{tip}</p>
    </div>
  );
};

export default MentalHealthPopup;
