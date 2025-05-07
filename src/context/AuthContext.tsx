
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { strapiService, StrapiUser } from '@/services/strapiService';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  strapiUser: StrapiUser | null;
  strapiUserId: number | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  strapiUser: null,
  strapiUserId: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const [strapiUser, setStrapiUser] = useState<StrapiUser | null>(null);
  const [isLoadingStrapi, setIsLoadingStrapi] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if we are using mock mode (no Strapi server)
  const useMockMode = !import.meta.env.VITE_STRAPI_API_URL;
  
  useEffect(() => {
    const fetchOrCreateStrapiUser = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setIsLoadingStrapi(false);
        return;
      }

      try {
        setIsLoadingStrapi(true);
        
        // Use real or mock service based on environment
        const service = useMockMode ? strapiService.mock : strapiService;
        
        // Try to fetch existing Strapi user
        let existingStrapiUser = await service.getUserByClerkId(user.id);
        
        // If user doesn't exist, create one
        if (!existingStrapiUser) {
          existingStrapiUser = await service.createUser({
            clerkUserId: user.id,
            name: `${user.firstName} ${user.lastName}`.trim() || user.username || 'User',
            email: user.primaryEmailAddress?.emailAddress || '',
          });
          
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
        }
        
        setStrapiUser(existingStrapiUser);
      } catch (error) {
        console.error("Error fetching/creating Strapi user:", error);
        toast({
          title: "Error",
          description: "There was an error setting up your account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStrapi(false);
      }
    };

    fetchOrCreateStrapiUser();
  }, [isLoaded, isSignedIn, user, toast, useMockMode]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setStrapiUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    isAuthenticated: isSignedIn || false,
    isLoading: !isLoaded || isLoadingStrapi,
    strapiUser,
    strapiUserId: strapiUser?.id || null,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
