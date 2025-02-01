import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient";

const SECRET_KEY = "@patria2025";

export const registerUser = async (req: Request, res: Response) => {
  const { Email, Password, Name, Role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = await prisma.users.create({ data: {Email, Password: hashedPassword, Name, Role}});

    res.status(201).json({ message: "User registered successfully", user});
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { Email, Password } = req.body;

  try {
    const user = await prisma.users.findFirst({ where: {Email}});
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(Password, user?.Password || '');
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user?.UserID || '' }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};