import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const router = express.Router();
const prisma = new PrismaClient();

// POST /register-course
router.post("/register-course", async (req: Request, res: Response): Promise<void> => {
    const { email, name, semester, grade } = req.body;
  
    if (!email || !name || !semester) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }
  
    try {
      let user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        user = await prisma.user.create({ data: { email } });
      }
  
      const course = await prisma.registeredCourse.create({
        data: { name, semester, grade, userId: user.id },
      });
  
      res.status(201).json(course);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to register course." });
    }
  });

// ✅ GET /courses/:email
router.get("/courses/:email", async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;
  
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { courses: true },
      });
  
      if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
      }
  
      res.json(user.courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch courses." });
    }
  });
  

export default router;
