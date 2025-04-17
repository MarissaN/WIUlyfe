import express from "express";
import cors from "cors";
import courseRoutes from "./routes/courseRoutes";
import { pool } from './db'; // make sure the path is correct based on your project structure


const app = express();
const PORT = 5050;

// backend/src/index.ts or wherever your routes are
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


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // To read JSON body

// Use our course routes
app.use("/", courseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
