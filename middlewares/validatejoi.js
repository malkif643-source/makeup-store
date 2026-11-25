import { AppError } from "../utils/AppError.js";

export const validateBody = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
        throw new AppError(error.message, 400, "validation-error");
    }

    req.body = value;
    next();
};