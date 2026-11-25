import User from "../models/users.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/jwt.js";

// הרשמה
// export const  register =async(req,res ,next)=>{
//     const user =new User(req.body);
//     await user.save()
//         res.status(201).json(user)
// };
export const register = async (req, res) => {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) throw new AppError("email already in use", 409, "duplicate");

    const user = await User.create({ ...req.body, role: "user" });
    return res.status(201).json({ user, token: generateToken(user) });
};
// התחברות
export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })//פה בפנים לשים את מה שהחלטנו שיהיה בהתחברות ואפשר לבדוק יותר ממשהו אחד
    // if(!user)
    //     throw new AppError('invalid username or passeord',404);
    // const result= await user.comparePassword(req.body.password)
    // if(!result)
    //     throw new AppError('invalid username or passeord',404);
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError("invalid email or password", 401, "unauthorized");
    }
    return res.json({ user, token: generateToken(user) });
};
//עדכון
const updatePassword = (req, res, next) => { };