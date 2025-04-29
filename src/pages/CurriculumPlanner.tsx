import { useEffect, useState } from "react";
import PomodoroTimer from "./PomodoroTimer";

import { format, isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";

interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  category: string;
  completed: boolean;
  notes: string;
}

const CurriculumPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("daily");
  const [noteModal, setNoteModal] = useState<{
    open: boolean;
    taskId: number | null;
  }>({
    open: false,
    taskId: null,
  });
  const [noteInput, setNoteInput] = useState("");

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length
    ? (completedCount / tasks.length) * 100
    : 0;

  const handleAddTask = () => {
    if (!title || !date || !time) return alert("Please fill all fields");

    const newTask: Task = {
      id: Date.now(),
      title,
      date,
      time,
      category,
      completed: false,
      notes: "",
    };

    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDate("");
    setTime("");
    setCategory("daily");
  };

  const toggleTaskStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveNote = () => {
    if (noteModal.taskId !== null) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === noteModal.taskId ? { ...t, notes: noteInput } : t
        )
      );
      setNoteModal({ open: false, taskId: null });
      setNoteInput("");
    }
  };

  const filteredTasks = (type: string) => {
    return tasks.filter((t) => {
      const taskDate = parseISO(t.date);
      if (type === "daily") return isToday(taskDate);
      if (type === "weekly") return isThisWeek(taskDate);
      if (type === "monthly") return isThisMonth(taskDate);
      return true;
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📚 Curriculum Planner</h2>

      {/* Input section */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <button
        onClick={handleAddTask}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ➕ Add Task
      </button>

      {/* Progress */}
      <div className="mt-6">
        <p className="font-semibold mb-1">
          Progress: {Math.round(progressPercent)}%
        </p>
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-4">
          <div
            className="bg-green-500 h-4"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        {progressPercent === 100 && (
          <div className="text-green-600 text-lg font-bold mb-4">
            🎉 All tasks completed!
          </div>
        )}
      </div>

      {/* Filtered Task Lists */}
      {["daily", "weekly", "monthly"].map((filter) => (
        <div key={filter} className="mb-6">
          <h3 className="text-xl font-bold capitalize mb-2">{filter} Tasks</h3>
          {filteredTasks(filter).length === 0 ? (
            <p>No tasks for this period.</p>
          ) : (
            <ul className="space-y-3">
              {filteredTasks(filter).map((task) => (
                <li
                  key={task.id}
                  className="bg-white shadow border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {task.title} - {format(parseISO(task.date), "PPP")} @{" "}
                      {task.time}
                    </p>
                    {task.notes && (
                      <p className="text-sm text-gray-500">📝 {task.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`px-3 py-1 rounded text-white text-sm ${
                        task.completed ? "bg-gray-500" : "bg-green-600"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </button>
                    <button
                      onClick={() => {
                        setNoteModal({ open: true, taskId: task.id });
                        setNoteInput(task.notes || "");
                      }}
                      className="text-yellow-600 hover:underline text-sm"
                    >
                      📝
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Notes Modal */}
      {noteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-semibold mb-2">Add Notes</h3>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setNoteModal({ open: false, taskId: null })}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pomodoro */}
      <div className="mt-10">
        <PomodoroTimer />
      </div>
    </div>
  );
};

export default CurriculumPlanner;
