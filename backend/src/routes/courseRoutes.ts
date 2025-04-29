import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// POST /register-course
router.post("/register-course", async (req: Request, res: Response): Promise<void> => {
  const { email, subjectId, semester, grade } = req.body;

  if (!email || !subjectId || !semester) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  try {
    // Find the user by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // If user doesn't exist, create a new user
      user = await prisma.user.create({
        data: { email, password: "" },
      });
    }

    // Find the subject by subjectId
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      res.status(400).json({ error: "Subject not found" });
      return;
    }

    // Create a new registered course entry linking the user and subject
    const registeredCourse = await prisma.registeredCourse.create({
      data: {
        semester,
        grade,
        userId: user.id,
        courseId: subject.courseId, // Link to the course of the subject
        name: subject.name, // Add the subject name here
      },
    });

    res.status(201).json(registeredCourse); // Respond with the created registered course
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register subject." });
  }
});

// DELETE /remove-course

router.get("/courses/:email", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        courses: {
          include: {
            course: {
              include: {
                subjects: true, 
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const masterOfCS = user.courses?.find((course) => course.course.name === "Master of Computer Science");

    if (!masterOfCS) {
      res.status(404).json({ error: "Master of Computer Science course not found." });
      return;
    }

    res.json(masterOfCS.course.subjects); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses." });
  }
});

// NEW: GET /all-courses
router.get("/all-courses", async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching all courses:", error);
    res.status(500).json({ error: "Failed to fetch courses." });
  }
});

export default router;
