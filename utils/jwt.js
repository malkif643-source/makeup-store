import jwt from 'jsonwebtoken';

// פונקציה שיוצרת טוקן לפי נתוני הרשאה
export const generateToken =(user) => 
     jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
);