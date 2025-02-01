import express, { Application } from "express";
import bodyParser from "body-parser";
import productRoutes from "./routes/productRoutes";
import addressRoutes from "./routes/addressRoutes";
import userRoutes from "./routes/userRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartItemsRoutes from "./routes/cartItemsRoutes";

const app: Application = express();

app.use(bodyParser.json());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart-items', cartItemsRoutes);

export default app;