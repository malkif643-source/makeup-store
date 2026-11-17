import { isValidObjectId } from "mongoose";
import Order from "../models/orders.js";
import Product from "../models/products.js";
import { AppError } from "../utils/AppError.js";

export const getAllOrders = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
        throw new AppError("page and limit must be positive integers", 400, "validation-error");
    }

    const [orders, total] = await Promise.all([
        Order.find()
            .populate("userId", "fullName email")
            .skip((page - 1) * limit)
            .limit(limit),
        Order.countDocuments(),
    ]);

    return res.json({ data: orders, total });
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new AppError("order not found", 404, "not-found");
    }

    const order = await Order.findById(id)
        .populate("userId", "fullName email phone")
        .populate("items.productId", "name category subCategory imageUrl");

    if (!order) {
        throw new AppError("order not found", 404, "not-found");
    }

    return res.json(order);
};

export const addOrder = async (req, res) => {
    const { userId, items, shippingAddress, paymentStatus } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new AppError("order must contain at least one item", 400, "validation-error");
    }

    const productIds = items.map(({ productId }) => productId.toLowerCase());
    const products = await Product.find({ _id: { $in: productIds } });
    const productsById = new Map(products.map((product) => [product.id.toLowerCase(), product]));

    if (productsById.size !== new Set(productIds).size) {
        throw new AppError("one or more products were not found", 404, "not-found");
    }

    let calculatedTotalAmount = 0;

    const formattedItems = items.map(({ productId, quantity }) => {
        const product = productsById.get(productId.toLowerCase());

        if (!product.inStock || product.stockQuantity < quantity) {
            throw new AppError(`product ${product.name} is out of stock`, 400, "out-of-stock");
        }

        calculatedTotalAmount += product.price * quantity;

        return {
            productId: product._id,
            quantity,
            priceAtPurchase: product.price,
        };
    });

    const order = new Order({
        userId,
        items: formattedItems,
        totalAmount: calculatedTotalAmount,
        shippingAddress,
        paymentStatus: paymentStatus ?? "ממתין לאישור",
        orderStatus: "התקבלה",
        orderDate: new Date(),
    });

    await order.save();

    return res.status(201).json(order);
};

export const updateOrder = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new AppError("order not found", 404, "not-found");
    }

    const { orderStatus, paymentStatus, shippingAddress } = req.body;

    const updates = {};
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (shippingAddress) updates.shippingAddress = shippingAddress;

    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    );

    if (!updatedOrder) {
        throw new AppError("order not found", 404, "not-found");
    }

    return res.json(updatedOrder);
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new AppError("order not found", 404, "not-found");
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
        throw new AppError("order not found", 404, "not-found");
    }

    return res.status(204).send();
};