'use client';

import { connectToDatabase } from '@/lib/mongodb';
import Transaction, { ITransaction } from '@/models/Transaction';
import { updateUserStats } from './userMongo';

export type TransactionType = {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: string;
  date: Date;
};

let currentUserId: string | null = null;

export function setCurrentUserId(userId: string) {
  currentUserId = userId;
}

export async function getTransactions(): Promise<TransactionType[]> {
  if (!currentUserId) {
    console.warn('No current user ID set');
    return [];
  }

  try {
    await connectToDatabase();
    const transactions = await Transaction.find({ userId: currentUserId })
      .sort({ date: -1 })
      .lean();

    return transactions.map((transaction: any) => ({
      id: transaction._id.toString(),
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      status: transaction.status,
      date: transaction.date,
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function addTransaction(transaction: {
  description: string;
  amount: number;
  date: Date;
  category: string;
  type: 'income' | 'expense';
}): Promise<string> {
  if (!currentUserId) {
    throw new Error('User not authenticated');
  }

  try {
    await connectToDatabase();
    
    const newTransaction = new Transaction({
      userId: currentUserId,
      ...transaction,
      status: 'Completed',
    });
    
    const savedTransaction = await newTransaction.save();
    
    // Update user stats
    await updateUserStats(currentUserId, transaction.amount, transaction.type);
    
    return savedTransaction._id.toString();
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  if (!currentUserId) {
    throw new Error('User not authenticated');
  }

  try {
    await connectToDatabase();
    
    const transaction = await Transaction.findOne({ 
      _id: transactionId, 
      userId: currentUserId 
    });
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    await Transaction.findByIdAndDelete(transactionId);
    
    // Update user stats (reverse the transaction)
    await updateUserStats(
      currentUserId, 
      transaction.amount, 
      transaction.type, 
      true // isDelete = true
    );
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}
