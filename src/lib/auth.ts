import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-this-in-production') {
    throw new Error('JWT_SECRET is not properly configured');
  }
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign({ userId }, JWT_SECRET, options);
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function registerUser(email: string, password: string, displayName: string): Promise<{ user: AuthUser; token: string }> {
  try {
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName,
      balance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: 0,
    });
    
    const savedUser = await user.save();
    
    // Generate token
    const token = generateToken(savedUser._id.toString());
    
    return {
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        displayName: savedUser.displayName,
      },
      token,
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  try {
    await connectToDatabase();
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Update last login
    user.lastLoginAt = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
      },
      token,
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }
    
    await connectToDatabase();
    const user = await User.findById(decoded.userId);
    if (!user) {
      return null;
    }
    
    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    };
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}
