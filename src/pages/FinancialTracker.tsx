import { useState } from "react";
import { format, parseISO } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import api from "../api/api";

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
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddExpense = async () => {
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

    try {
      const email = localStorage.getItem("email");
      if (!email) {
        console.error("No email found.");
        return;
      }

      await api.post("/expense", { ...newExpense, email });
    } catch (err) {
      console.error("Error adding expense", err);
    }
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Expenses Report", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Amount ($)", "Description", "Category", "Date"]],
      body: expenses.map((exp) => [
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
      expenses.map((exp) => ({
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
      <h2 className="text-2xl font-bold mb-4">💰 Financial Manager</h2>

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

      <div className="mb-4 font-semibold text-gray-700">
        Total Spent: $
        {expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
      </div>

      {expenses.length === 0 ? (
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
            {expenses.map((exp) => (
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
