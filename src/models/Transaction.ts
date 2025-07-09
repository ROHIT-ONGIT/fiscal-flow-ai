import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: string;
  date: Date;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['income', 'expense'],
  },
  status: {
    type: String,
    default: 'Completed',
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
TransactionSchema.index({ userId: 1, date: -1 });

// Ensure we don't re-compile the model if it already exists
const Transaction = mongoose.models?.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
