import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

export const getAllCarts = async (req: Request, res: Response) => {
    try{
        const carts = await prisma.carts.findMany();
        res.json(carts);
    }catch(error){
        res.status(500).json({error: "Error retrieving carts"});
    }   
};

export const getCartsById = async (req: Request, res: Response) => {
    try{
        const cartId = parseInt(req.params.id);

        // Query ke database menggunakan findUnique
        const carts = await prisma.carts.findUnique({
            where: { CartID: cartId }, // Pastikan field sesuai dengan nama di model Prisma
        });
        if (!carts) {
            res.status(404).json({ error: "Cart not found" });
        }
        res.json(carts);
    }catch(error){
        res.status(500).json({error: "Error retrieving carts"});
    }   
};


export const createCart = async (req: Request, res: Response) => {
    try{
        const newCart = await prisma.carts.create({
            data:{
            },
        });
        res.status(201).json(newCart);
    }catch(error){
        res.status(500).json({error: "Error creating cart"});
    }   
};

// export const updateCart = async (req: Request, res: Response) => {
//   const { IsActive } = req.body;

//     try{
//         const id = parseInt(req.params.id);
//         const updateCart = await prisma.carts.update({
//             where:{
//                 CartID: id,
//             },
//             data:{
//                 IsActive
//             }
//         });
//         res.status(201).json(updateCart);
//     }catch(error){
//         res.status(500).json({error: "Error updated cart"});
//     }   
// };

export const deleteCart = async (req: Request, res: Response) => {
    try{
        const cartId = parseInt(req.params.id);
        const deleteCart = await prisma.carts.delete({
            where:{
                CartID: cartId
            }
        });
        if (!deleteCart) {
            res.status(404).json({ error: "Cart not found" });
        }
        res.status(201).json({message: "Cart deleted Succesfully"});
    }catch(error){
        res.status(500).json({error: "Error deleted cart"});
    }   
};

export const valDeleteCart = async (req: Request, res: Response) => {
    try{
        const cartId = parseInt(req.params.id);
        const cartItem = await prisma.cartItems.findMany({ where: { CartID: cartId } });
        const address = await prisma.addresses.findMany({ where: { CartID: cartId } });
        if (cartItem || address) {
            res.status(201).json({ message: "Apakah Anda ingin menghapus cart beserta cart item dan address?" });
        } else {
            res.status(201).json({ message: "Apakah Anda ingin menghapus cart?" });

        }
        res.status(201).json({message: "Cart deleted Succesfully"});
    }catch(error){
        res.status(500).json({error: "Error deleted cart"});
    }   
};

