import { useState } from "react";
import { format, isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
}

const FinancialTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("General");
  const [filter, setFilter] = useState("all");
  const [budget, setBudget] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddExpense = () => {
    if (!amount || !description || !date) return;
    const newExpense: Expense = {
      id: editingId ?? Date.now(),
      amount: parseFloat(amount),
      description,
      date,
      category,
    };

    if (editingId) {
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === editingId ? newExpense : exp))
      );
      setEditingId(null);
    } else {
      setExpenses((prev) => [...prev, newExpense]);
    }

    setAmount("");
    setDescription("");
    setDate("");
    setCategory("General");
  };

  const handleDelete = (id: number) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleEdit = (exp: Expense) => {
    setAmount(String(exp.amount));
    setDescription(exp.description);
    setDate(exp.date);
    setCategory(exp.category);
    setEditingId(exp.id);
  };

  const filteredExpenses = expenses.filter((exp) => {
    const expDate = parseISO(exp.date);
    if (filter === "daily") return isToday(expDate);
    if (filter === "weekly") return isThisWeek(expDate);
    if (filter === "monthly") return isThisMonth(expDate);
    return true;
  });

  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const isOverBudget = budget !== null && totalSpent > budget;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Expenses Report", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Amount ($)", "Description", "Category", "Date"]],
      body: filteredExpenses.map((exp) => [
        exp.amount.toFixed(2),
        exp.description,
        exp.category,
        format(parseISO(exp.date), "PPP"),
      ]),
    });
    doc.save("expenses-report.pdf");
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(
      filteredExpenses.map((exp) => ({
        Amount: exp.amount,
        Description: exp.description,
        Category: exp.category,
        Date: exp.date,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">💰 Financial Tracker</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          type="number"
          placeholder="Amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option>General</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Books</option>
          <option>Rent</option>
          <option>Other</option>
        </select>
      </div>

      <button
        onClick={handleAddExpense}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        {editingId ? "Update" : "Add"} Expense
      </button>

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div>
          <label className="font-medium mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>

        <div>
          <label className="font-medium mr-2">Set Budget:</label>
          <input
            type="number"
            placeholder="Optional ($)"
            value={budget !== null ? budget : ""}
            onChange={(e) => setBudget(Number(e.target.value) || null)}
            className="border px-3 py-1 rounded"
          />
        </div>

        <button
          onClick={handleExportPDF}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Export PDF
        </button>

        <button
          onClick={handleExportCSV}
          className="bg-purple-500 text-white px-3 py-1 rounded"
        >
          Export CSV
        </button>
      </div>

      {isOverBudget && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
          ⚠️ Warning: You have exceeded your budget of ${budget} by $
          {(totalSpent - budget!).toFixed(2)}
        </div>
      )}

      <div className="mb-4 font-semibold text-gray-700">
        Total Spent: ${totalSpent.toFixed(2)}
        {budget !== null && (
          <span className="ml-4">
            Budget: ${budget.toFixed(2)}{" "}
            {!isOverBudget && (
              <span className="text-green-600 ml-2">✅ Within Budget</span>
            )}
          </span>
        )}
      </div>

      {filteredExpenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp.id}>
                <td className="p-2 border">${exp.amount.toFixed(2)}</td>
                <td className="p-2 border">{exp.description}</td>
                <td className="p-2 border">{exp.category}</td>
                <td className="p-2 border">
                  {format(parseISO(exp.date), "PPP")}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="bg-yellow-400 text-sm px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="bg-red-500 text-white text-sm px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FinancialTracker;
