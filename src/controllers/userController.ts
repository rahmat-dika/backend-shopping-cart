import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient";
import { verify } from "jsonwebtoken";

const SECRET_KEY = "@patria2025";

export const registerUser = async (req: Request, res: Response) => {
  const { Email, Password, Name, Role = "user" } = req.body;
  try {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!Password || !passwordRegex.test(Password)) {
      res.status(400).json({ error: "Password must be at least 8 characters, contain uppercase letters, numbers, and unique characters." });
    }

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
      return;
    }

    const isPasswordValid = await bcrypt.compare(Password, user?.Password || '');
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user?.UserID || '' }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      res.status(404).json({
        message: "Unauthorized"
      });
      return;
    }
    const [prefix, token] = authorization.split(" ");
    if (!(prefix === "Bearer" && token)) {
      res.status(404).json({
        message: "Unauthorized"
      });
      return;
    }
    const decoded = verify(token, SECRET_KEY) as {
      userId: number;
    }
    const user = await prisma.users.findFirst({ where: { UserID: decoded.userId }});

    res.status(200).json({
      message: "Success get profile",
      data: {
        name: user?.Name,
        email: user?.Email,
        role: user?.Role,
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error get profile" } );
  }
}