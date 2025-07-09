"use client"

import * as React from "react"
import { useToast } from "./use-toast"

interface UserProfile {
  balance: number
  totalIncome: number
  totalExpenses: number
  transactionCount: number
}

interface AuthUser {
  id: string
  email: string
  displayName: string
}

interface AuthContextType {
  user: AuthUser | null
  userProfile: UserProfile | null
  loading: boolean
  signOut: () => void
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)
  const [loading, setLoading] = React.useState(true)

  const refreshUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const { profile } = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const { user: userData } = await response.json();
          setUser(userData);
          
          // Load user profile
          const profileResponse = await fetch('/api/user/profile');
          if (profileResponse.ok) {
            const { profile } = await profileResponse.json();
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setUserProfile(null);
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const { user: userData } = await response.json();
      setUser(userData);
      
      // Load user profile
      const profileResponse = await fetch('/api/user/profile');
      if (profileResponse.ok) {
        const { profile } = await profileResponse.json();
        setUserProfile(profile);
      }
      
      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${userData.displayName}`,
      });
      
      // Force a small delay to ensure state is properly updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error: any) {
      console.error("Error signing in: ", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "There was an issue signing you in. Please try again.",
      });
      throw error;
    }
  }

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const { user: userData } = await response.json();
      setUser(userData);
      
      // Load user profile
      const profileResponse = await fetch('/api/user/profile');
      if (profileResponse.ok) {
        const { profile } = await profileResponse.json();
        setUserProfile(profile);
      }
      
      toast({
        title: "Welcome!",
        description: `Account created successfully. Welcome, ${userData.displayName}!`,
      });
      
      // Force a small delay to ensure state is properly updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error: any) {
      console.error("Error signing up: ", error);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "There was an issue creating your account. Please try again.",
      });
      throw error;
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    refreshUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
