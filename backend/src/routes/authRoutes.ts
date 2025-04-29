import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

interface AuthUser {
  id: number;
  email: string;
  password: string;
}

// Register Route
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email.endsWith("@wiu.edu")) {
    res.status(400).json({ error: "Only WIU emails allowed" });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    message: "User registered",
    user: { id: user.id, email: user.email },
  });
});

// Login Route
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  }) as AuthUser | null;

  if (!user || !user.password) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, "mySecretKey", { expiresIn: "1d" });

  res.status(200).json({
    message: "Login successful",
    token,
    user: { id: user.id, email: user.email },
  });
});

export default router;
