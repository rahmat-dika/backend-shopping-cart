import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

export const getAllAddress = async (req: Request, res: Response) => {
  try {
    const addresses = await prisma.addresses.findMany();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Error retriviying addresses" });
  }
}

export const createAddress = async (req: Request, res: Response) => {
  const { CartID, AddressLine1, AddressLine2, City, State, ZipCode } = req.body;

  try {
    const cekCart = await prisma.carts.findUnique({ where: { CartID: CartID },});
    if (!cekCart) {
      res.status(404).json({ error: "Cart not found" });
    }

    const newAddress = await prisma.addresses.create({
      data: {
        CartID,
        AddressLine1,
        AddressLine2,
        City,
        State,
        ZipCode
      }
    });

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: "Error creating addresses" });
  }
}

export const getAddressByID = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const address = await prisma.addresses.findUnique({ where: { AddressID: id },});
    if (!address) {
      res.status(404).json({ error: "Address not found" });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ error: "Error retriviying address" });
  }
}

export const updateAddress = async (req: Request, res: Response) => {
  const { CartID, AddressLine1, AddressLine2, City, State, ZipCode } = req.body;

  try {
    const id = parseInt(req.params.id);
    
    const cekCart = await prisma.carts.findUnique({ where: { CartID: CartID },});
    if (!cekCart) {
      res.status(404).json({ error: "Cart not found" });
    }
    
    const updateAddresss = await prisma.addresses.update({
      where: {
        AddressID: id
      },
      data: {
        CartID,
        AddressLine1,
        AddressLine2,
        City,
        State,
        ZipCode
      }
    });

    res.status(201).json(updateAddresss);
  } catch (error) {
    res.status(500).json({ message: "Error updating addresses", error });
  }
}

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deletedAddresss = await prisma.addresses.delete({
      where: { AddressID: id }
    });
    if (!deletedAddresss) {
      res.status(404).json({ error: "Address not found" });
    }

    res.status(201).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error retriviying addresses" });
  }
}