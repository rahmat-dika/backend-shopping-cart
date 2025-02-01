import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const products = await prisma.products.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error retriviying products" });
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const { Name, Description, Price, Stock } = req.body;

  try {
    const newProducts = await prisma.products.create({
      data: {
        Name,
        Description,
        Price,
        Stock
      }
    });
    res.status(201).json(newProducts);
  } catch (error) {
    res.status(500).json({ error: "Error creating products" });
  }
}

export const getProductByID = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const products = await prisma.products.findUnique({ where: { ProductID: id },});
    if (!products) {
      res.status(404).json({ error: "Product not found" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error retriviying products" });
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { Name, Description, Price, Stock } = req.body;

  try {
    const id = parseInt(req.params.id);
    const updateProducts = await prisma.products.update({
      where: {
        ProductID: id
      },
      data: {
        Name,
        Description,
        Price,
        Stock
      }
    });
    res.status(201).json(updateProducts);
  } catch (error) {
    res.status(500).json({ error: "Error creating products" });
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deletedProducts = await prisma.products.delete({
      where: { ProductID: id }
    });
    if (!deletedProducts) {
      res.status(404).json({ error: "Product not found" });
    }

    res.status(201).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error retriviying products" });
  }
}