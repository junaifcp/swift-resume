import React, { createContext, useContext, ReactNode } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";

/**
 * @interface AuthContextType
 * Defines the shape of the authentication context.
 * This is a simplified version that relies directly on Clerk's state.
 */
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @function useAuth
 * Custom hook to consume the AuthContext.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * @component AuthProvider
 * Provides authentication state to the entire application.
 * It no longer needs to manage its own state for users, as the new backend
 * handles user synchronization via webhooks.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { signOut: clerkSignOut } = useClerk();
  const { isLoaded, isSignedIn } = useUser();

  const handleSignOut = async () => {
    try {
      await clerkSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value: AuthContextType = {
    // `!!isSignedIn` ensures the value is always a boolean.
    isAuthenticated: !!isSignedIn,
    // The app is loading if Clerk hasn't determined the auth state yet.
    isLoading: !isLoaded,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
