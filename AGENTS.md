# AGENTS.md - הנחיות ארכיטקטורה ומוסכמות קוד לפרויקט

## 1. סקירה כללית וטכנולוגיות
* **תיאור הפרויקט:** מערכת צד שרת (Backend API) לחנות מסחר אלקטרוני למוצרי איפור, טיפוח ובשמים[cite: 1].
* **סביבת ריצה ופריימוורק:** Node.js (ES Modules - `"type": "module"`) עם Express (גרסה 5)[cite: 1, 7].
* **מסד נתונים:** MongoDB באמצעות Mongoose[cite: 1].
* **בדיקות תקינות (Validation):** ספריית Joi.

---

## 2. מבנה התיקיות והקבצים
הפרויקט מחולק לשכבות לפי תחומי אחריות:
* `config/db.js` – הגדרת החיבור למסד הנתונים (`connectDB`)[cite: 2].
* `models/` – סכימות Mongoose (`products.js`, `users.js`, `orders.js`)[cite: 1, 2].
* `conrollers/` – לוגיקה עסקית וטיפול בבקשות (`products.js`, `users.js`, `orders.js`)[cite: 2].
* `routes/` – הגדרת נתיבי ה-API וחיבור לולידציות ולקונטרולרים (`products.js`, `users.js`, `orders.js`)[cite: 2].
* `validations/` – סכימות Joi לבדיקת תקינות הקלט (`products.js`, `users.js`, `orders.js`)[cite: 2].
* `middlewares/` – פונקציות ביניים: `validatejoi.js` (`validateBody`), `errors.js` (`errorHandler`, `pathNotFound`), `custom.js` (`printMsg`)[cite: 2, 6].
* `utils/AppError.js` – מחלקת שגיאות מותאמת אישית היורשת מ-`Error`.
* `app.js` – נקודת הכניסה הראשית של השרת[cite: 2].

---

## 3. מוסכמות קוד וייבוא (Conventions)
* **ייבוא קבצים:** יש להשתמש תמיד בתחביר ES Modules (`import` / `export`) ולציין סיומת `.js` מלאה בכל נתיב מקומי.
* **טיפול בשגיאות (Express 5):** אין לעטוף כל פונקציה בקונטרולר בבלוק `try-catch` ידני. במקרה של שגיאה עסקית או ולידציה, יש לזרוק שגיאה באמצעות `throw new AppError(message, status, type)` שתועבר אוטומטית ל-`errorHandler` המרכזי[cite: 7].
* **ולידציה:** כל בקשת `POST` או `PUT` המכילה גוף בקשה (`req.body`) תעבור דרך ה-Middleware הכללי `validateBody(schema)` ברמת ה-Router[cite: 6].

---

## 4. מבנה מסד הנתונים וקשרי גומלין (MongoDB)
* **אוספים (Collections):** `products`, `users`, `orders`[cite: 1].
* **שילוב `ref` ו-`embedded`:**
  * באוסף `orders`, השדות `userId` ו-`items.productId` נשמרים כהפניות (`ObjectId` עם `ref`) לטבלאות המקור[cite: 1, 7].
  * פרטי המשלוח (`shippingAddress`) והמחיר בעת הרכישה (`priceAtPurchase`) נשמרים כמידע מוטמע (`embedded`) בתוך מסמך ההזמנה כדי לשמור על היסטוריה מדויקת שאינה מושפעת משינויים עתידיים בקטלוג או בפרופיל המשתמש[cite: 1, 7].
* **שימוש ב-`populate`:** יבוצע רק בפונקציות שליפה ממוקדות (`getAllOrders`, `getOrderById`) ולא באופן גורף[cite: 7].
* **אבטחת מחירים:** הסכום הכולל להזמנה (`totalAmount`) מחושב תמיד בצד השרת מתוך מחירי המוצרים במסד הנתונים ולא מתוך קלט הלקוח[cite: 1].

---

## 5. נהלי עבודה ב-Git ו-GitHub
* חל איסור לבצע `push` ישיר לענף `main`[cite: 7].
* כל פיצ'ר חדש או תיקון באג יפותחו בענף (`branch`) נפרד[cite: 7].
* מיזוג לענף `main` יתבצע אך ורק דרך פתיחת `Pull Request` (PR) ולאחר ביצוע `Code Review` ואישור של השותפה לפרויקט[cite: 7].