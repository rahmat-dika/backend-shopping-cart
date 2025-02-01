import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

export const getAllCartItems = async (req: Request, res: Response) => {
    try{
        const cartItems = await prisma.cartItems.findMany({
            include:{
                Products: true,
            }
        });
        res.json(cartItems);
    }catch(error){
        res.status(500).json({error: "Error retrieving cartItems"});
    }   
};

export const getCartItemsById = async (req: Request, res: Response) => {
    try{
        const cartItemsId = parseInt(req.params.id);

        // Query ke database menggunakan findUnique
        const carts = await prisma.cartItems.findUnique({
            where: { CartItemID: cartItemsId }, // Pastikan field sesuai dengan nama di model Prisma
        });
        
        if (!carts) {
            res.status(404).json({ error: "Cart not found" });
        }
        res.json(carts);
    }catch(error){
        res.status(500).json({error: "Error retrieving carts"});
    }   
};


export const createCartItems = async (req: Request, res: Response) => {
    const {CartID, ProductID, Quantity} = req.body;
    try{
        const cart = await prisma.carts.findUnique({
            where: { CartID: CartID }, // Pastikan field sesuai dengan nama di model Prisma
        });
        const product = await prisma.products.findUnique({
            where: { ProductID: ProductID }, // Pastikan field sesuai dengan nama di model Prisma
        });

        if (!cart)  res.status(404).json({ message: 'Cart Not Found' });
        if (!product)  res.status(404).json({ message: 'Product Not Found' });

        // Cari item di keranjang dengan CartID dan ProductID yang sama
        const existingCartItem = await prisma.cartItems.findFirst({ where: { CartID, ProductID } });
        console.log(existingCartItem, product?.Stock || '');
        if (existingCartItem) {
            // Update quantity if the item exists
            const updatedQuantity = existingCartItem.Quantity + Quantity;
            const stockProduct = product?.Stock || '';
            // Check stock availability
            if (stockProduct <= updatedQuantity) {
                console.log('masuk');
                res.status(400).json({ message: 'Insufficient Stock' });
            } else {
                const updatedCartItem = await prisma.cartItems.update({
                    where: {
                        CartItemID: existingCartItem.CartItemID,
                    },
                    data: {
                        Quantity: updatedQuantity,
                    },
                });
                res.status(200).json({ message: 'Cart item updated', cartItem: updatedCartItem });
            }

        } else {
            // Cek Quantity
            const stockProduct = product?.Stock || '';
            if (stockProduct <= Quantity) {
                res.status(404).json({ message: 'Insufficient Stock' });
            } else {
                // Jika item belum ada, buat item baru
                const newCartItem = await prisma.cartItems.create({
                    data:{
                        CartID,
                        ProductID,
                        Quantity
                    },
                });
                res.status(201).json({ message: 'Cart item created', newCartItem });
            }

        }
        
    }catch(error){
        res.status(500).json({error: "Error creating cart Item"});
    }   
};

export const updateCartItems = async (req: Request, res: Response) => {
    const {CartID, ProductID, Quantity} = req.body;
    try{
       // Cek Quantity
       const quantity = Quantity;
       const product = await prisma.products.findUnique({
            where: { ProductID: ProductID }, // Pastikan field sesuai dengan nama di model Prisma
        });
       if (!quantity || !product){
            res.status(404).json({ message: 'Quantity & Product Not Found' });
       }else{
            if (product?.Stock <= quantity ){
                res.status(404).json({ message: 'Insufficient Stock' });
            } else {
                const updated = await prisma.cartItems.update({
                    where: {
                        CartItemID: parseInt(req.params.id)
                    },
                    data: {
                        CartID,
                        ProductID,
                        Quantity
                    },
                });
               const updatedCartItem = await prisma.cartItems.findUnique({ 
                    where: { CartItemID: parseInt(req.params.id) }, // Pastikan field sesuai dengan nama di model Prisma
               });
               res.json(updatedCartItem);
            }
       }
        
    }catch(error){
        res.status(500).json({error: "Error creating cart Item"});
    }   
};

export const deleteCartItem = async (req: Request, res: Response) => {
    try{
        const cartItemId = parseInt(req.params.id);
       
        const deleteCartItem = await prisma.cartItems.delete({
            where:{
            CartItemID: cartItemId
        }});
        if (!deleteCartItem) {
            res.status(404).json({ error: "Cart Item not found" });
        }
        res.status(201).json({message: `cart Item deleted succesfully`});
    }catch(error){
        res.status(500).json({error: "Error deleted cart"});
    }   
};

