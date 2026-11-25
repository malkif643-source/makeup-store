import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const userSchema = new Schema({
    fullName: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    phone: String,
    address: {
        street: String,
        houseNumber: String,
        city: String,
        zipCode: String
    },
    role: { type: String
        , enum: ['admin', 'user'], default: 'user' },
    creatAt: {type:Date ,default:Date.now}
});
//פונקציה זו מתבצעת לפני כל עדכון ושמירה
userSchema.pre('save', async function () {
    //  אם לא שינתי את הסיסמא 
    if (!this.isModified('password')) return;
    // להצפנה כמה סיבובים נעשה
    const saltRounds = +process.env.SALT_ROUNDS || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    //הצפנה
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
});
//יש לנו user ונבדוק 
userSchema.methods.comparePassword = async function (password) {
    //השוואה בין הסיסמאות אם הסיסמא ששלחנו זהה לסיסמא המוצפנת
    return await bcrypt.compare(password, this.password);
}
userSchema.set("toJSON", {
    transform: (doc, ret) => { delete ret.password; return ret; }
});
const User = model('users', userSchema);

export default User;