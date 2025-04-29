import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import { pool } from "./db"; 

const app = express();
const PORT = 5050;

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

// Body parser
app.use(express.json());

// All routes
app.use("/auth", authRoutes);     
app.use("/courses", courseRoutes);
app.use("/expense", expenseRoutes);

// DELETE route
app.delete('/courses/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM registered_courses WHERE id = $1', [id]);
    res.status(200).json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
