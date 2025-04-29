import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { format, isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";

const HealthTracker = () => {
  const [glasses, setGlasses] = useState(0);
  const [filter, setFilter] = useState("all");

  // Trigger confetti when 10 glasses are hit
  useEffect(() => {
    if (glasses === 10) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }, [glasses]);

  const handleAddGlass = () => {
    if (glasses < 10) setGlasses(glasses + 1);
  };

  const handleRemoveGlass = () => {
    if (glasses > 0) setGlasses(glasses - 1);
  };

  const filteredGlasses = glasses;

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-3xl font-bold">💪 Health Tracker</h2>

      {/* Water Intake */}
      <div className="bg-blue-50 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">
          💧 Water Intake (10 Glasses)
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-6 h-10 rounded-md border ${
                i < glasses ? "bg-blue-500" : "bg-white"
              }`}
            />
          ))}
        </div>
        <div className="space-x-3">
          <button
            onClick={handleAddGlass}
            className="px-4 py-1 bg-blue-600 text-white rounded"
          >
            Add Glass
          </button>
          <button
            onClick={handleRemoveGlass}
            className="px-4 py-1 bg-gray-400 text-white rounded"
          >
            Remove Glass
          </button>
        </div>
      </div>

      {/* Health Videos */}
      <div className="bg-yellow-50 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">📺 Health Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "https://www.youtube.com/embed/qHJ992N-Dhs",
            "https://www.youtube.com/embed/2pLT-olgUJs",
            "https://www.youtube.com/embed/tybOi4hjZFQ",
          ].map((url, i) => (
            <iframe
              key={i}
              className="w-full h-56 rounded shadow"
              src={url}
              title={`Health Video ${i + 1}`}
              allowFullScreen
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;
