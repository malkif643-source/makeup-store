import express from 'express';
import { connectDB } from './config/db.js';
import { printMsg } from './middlewares/custom.js';
import productRouter from './routes/products.js';
// import userRouter from './routes/users.js';
import ordersRouter from './routes/orders.js';
import { errorHandler, pathNotFound } from './middlewares/errors.js';

const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(printMsg);

app.use('/products', productRouter);
// app.use('/users', userRouter);
app.use('/orders', ordersRouter);

app.use(pathNotFound);
app.use(errorHandler);

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});