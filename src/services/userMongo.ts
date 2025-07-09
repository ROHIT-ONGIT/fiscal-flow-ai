'use client';

import { connectToDatabase } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import Transaction from '@/models/Transaction';

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  createdAt: Date;
  lastLoginAt: Date;
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    
    if (!user) return null;
    
    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      balance: user.balance,
      totalIncome: user.totalIncome,
      totalExpenses: user.totalExpenses,
      transactionCount: user.transactionCount,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateUserStats(userId: string, amount: number, type: 'income' | 'expense', isDelete: boolean = false): Promise<void> {
  try {
    await connectToDatabase();
    
    const multiplier = isDelete ? -1 : 1;
    const updateData: any = {
      $inc: {
        transactionCount: multiplier,
      }
    };

    if (type === 'income') {
      updateData.$inc.totalIncome = amount * multiplier;
      updateData.$inc.balance = amount * multiplier;
    } else {
      updateData.$inc.totalExpenses = amount * multiplier;
      updateData.$inc.balance = -amount * multiplier;
    }

    await User.findByIdAndUpdate(userId, updateData);
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

export async function createUserProfile(userData: {
  email: string;
  displayName: string;
  password: string;
}): Promise<string> {
  try {
    await connectToDatabase();
    
    const user = new User({
      email: userData.email,
      displayName: userData.displayName,
      password: userData.password, // Note: Should be hashed before saving
      balance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: 0,
    });
    
    const savedUser = await user.save();
    return savedUser._id.toString();
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}
