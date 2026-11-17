const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'חובה לציין מזהה משתמש']
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'הכמות חייבת להיות לפחות 1']
      },
      priceAtPurchase: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: [true, 'חובה לציין סכום כולל לתשלום'],
    min: 0
  },
  shippingAddress: {
    street: { type: String, required: true, trim: true },
    houseNumber: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    zipCode: { type: String, trim: true }
  },
  paymentStatus: {
    type: String,
    enum: ['שולם', 'ממתין לאישור'],
    default: 'ממתין לאישור'
  },
  orderStatus: {
    type: String,
    enum: ['התקבלה', 'נארזת', 'נשלחה', 'הושלמה'],
    default: 'התקבלה'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;