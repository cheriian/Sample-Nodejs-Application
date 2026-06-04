import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  customerId: string;
  name: string;
  email: string;
  city: string;
}

const CustomerSchema: Schema = new Schema({
  customerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] // Regex validation
  },
  city: { type: String, required: true }
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);