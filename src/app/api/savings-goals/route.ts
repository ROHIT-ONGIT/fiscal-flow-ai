import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import mongoose, { Document, Schema } from 'mongoose';

// Define SavingsGoal interface and model inline since we don't have a separate model file
interface ISavingsGoal extends Document {
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  createdAt: Date;
}

const SavingsGoalSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount must be positive'],
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount must be positive'],
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SavingsGoal = mongoose.models.SavingsGoal || mongoose.model<ISavingsGoal>('SavingsGoal', SavingsGoalSchema);

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const goals = await SavingsGoal.find({ userId: user.userId }).sort({ createdAt: -1 });
    
    // Transform the data to match the expected format
    const formattedGoals = goals.map((goal: any) => ({
      _id: goal._id.toString(),
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate.toISOString(),
    }));

    return NextResponse.json(formattedGoals);
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, targetAmount, currentAmount, targetDate } = await request.json();

    const goal = new SavingsGoal({
      userId: user.userId,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      targetDate: new Date(targetDate),
    });

    await goal.save();

    // Return formatted goal
    const formattedGoal = {
      _id: goal._id.toString(),
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate.toISOString(),
    };

    return NextResponse.json(formattedGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating savings goal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
