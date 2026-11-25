import Joi from "joi";

// sign in - התחברות של משתמש קיים (לפי האפיון ההתחברות מתבצעת באמצעות אימייל)
// {email, password}
export const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// register (sign up) - הרשמת לקוח חדש
// {fullName, email, password, repeatPassword, phone, address, role}
export const registerSchema = Joi.object({
    fullName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.string().valid(Joi.ref("password")).required(),
    phone: Joi.string().pattern(/^05\d-?\d{7}$/).required(),
    address: Joi.object({
        street: Joi.string().required(),
        houseNumber: Joi.string().required(),
        city: Joi.string().required(),
        zipCode: Joi.string().allow("", null),
    }).required(),
    role: Joi.string().valid("user", "admin").default("user"),
});

// update password - עדכון סיסמה
// {password, repeatPassword}
export const updatePasswordSchema = Joi.object({
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.string().valid(Joi.ref("password")).required(),
});


