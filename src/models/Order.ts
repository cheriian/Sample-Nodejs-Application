import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customerId: string;
  product: string;
  amount: number;
  orderDate: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  product: { type: String, required: true },
  amount: { 
    type: Number, 
    required: true, 
    min: [1, 'Amount must be a positive number greater than zero'] // Validation
  },
  orderDate: { type: Date, required: true }
});

export default mongoose.model<IOrder>('Order', OrderSchema);