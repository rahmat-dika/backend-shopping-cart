import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import { Decimal } from '@prisma/client/runtime/library';
import moment from 'moment';

export const getAllOrder = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
          Carts: true,
      },
    });
    
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error retriviying orders" });
  }
}

export const createOrder = async (req: Request, res: Response) => {
  const { CartID } = req.body;

  try {
    const cekCart = await prisma.carts.findUnique({ where: { CartID: CartID },});
    if (!cekCart) {
      res.status(404).json({ error: "Cart not found" });
    }

    const cartItems = await prisma.cartItems.findMany({ where: { CartID } });
    let totalAmount = 0;

    await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const product = await tx.products.findUnique({
          where: { ProductID: item.ProductID }
        });
  
        if (!product) {
          throw new Error(`Product with ID ${item.ProductID} not found.`);
        }
  
        if (product.Stock < item.Quantity) {
          throw new Error(`Insufficient stock for product: ${product.Name}`);
        }
  
        // Kurangi stok produk
        await tx.products.update({
          where: { ProductID: item.ProductID },
          data: { Stock: product.Stock - item.Quantity },
        });

        const price = (product.Price as Decimal).toNumber();
    
        // Tambahkan ke total amount
        totalAmount +=  price  * item.Quantity;
      }

      await prisma.carts.update({ 
        where: { CartID: CartID },
        data: { isActive: false }
      });

      const newOrder = await (tx || prisma).orders.create({
        data: {
          CartID,
          TotalAmount: totalAmount
        }
      });

      res.status(201).json(newOrder);
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error creating orders" });
  }
}

export const getOrderByID = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const order = await prisma.orders.findUnique({ 
      where: { OrderID: id },
      include: { Carts: true }
    });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error retriviying order" });
  }
}

export const updateOrder = async (req: Request, res: Response) => {
  const { CartID, TotalAmount } = req.body;

  try {
    const cekCart = await prisma.carts.findUnique({ where: { CartID: CartID },});
    if (!cekCart) {
      res.status(404).json({ error: "Cart not found" });
    }

    const id = parseInt(req.params.id);

    const updateOrder = await prisma.orders.update({
      where: {
        OrderID: id
      },
      data: {
        CartID,
        TotalAmount,
      }
    });
    res.status(201).json(updateOrder);

  } catch (error) {
    res.status(500).json({ message: "Error updating order", error  });
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deletedOrder = await prisma.orders.delete({
      where: { OrderID: id }
    });
    if (!deletedOrder) {
      res.status(404).json({ error: "Order not found" });
    }

    res.status(201).json({ message: "Deleted successfully" });
  } catch (error) {    
    res.status(500).json({ error: "Error retriviying addresses" });
  }
}