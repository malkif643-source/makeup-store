import Joi from "joi";

export const orderSchema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
    shippingAddress: Joi.object({
        street: Joi.string().required(),
        houseNumber: Joi.string().required(),
        city: Joi.string().required(),
        zipCode: Joi.string(),
    }).required(),
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().hex().length(24).required(),
            quantity: Joi.number().integer().positive().required(),
        })
    ).min(1).required(),
    paymentStatus: Joi.string().valid("שולם", "ממתין לאישור"),
});
