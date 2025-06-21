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

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { useClerk, useUser } from "@clerk/clerk-react";
// import { strapiService, StrapiUser } from "@/services/strapiService";
// import { useToast } from "@/components/ui/use-toast";

// interface AuthContextType {
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   strapiUser: StrapiUser | null;
//   strapiUserId: number | null;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   isLoading: true,
//   strapiUser: null,
//   strapiUserId: null,
//   signOut: async () => {},
// });

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const { signOut } = useClerk();
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [strapiUser, setStrapiUser] = useState<StrapiUser | null>(null);
//   const [isLoadingStrapi, setIsLoadingStrapi] = useState<boolean>(true);
//   const { toast } = useToast();

//   // Check if we are using mock mode (no Strapi server)
//   const useMockMode = !import.meta.env.VITE_STRAPI_API_URL;

//   useEffect(() => {
//     const fetchOrCreateStrapiUser = async () => {
//       if (!isLoaded || !isSignedIn || !user) {
//         setIsLoadingStrapi(false);
//         return;
//       }

//       try {
//         setIsLoadingStrapi(true);

//         // choose real or mock service
//         const service = useMockMode ? strapiService.mock : strapiService;

//         // try fetching by Clerk ID
//         let existingStrapiUser = await service.getUserByClerkId(user.id);

//         // if not found, attempt to create
//         if (!existingStrapiUser) {
//           const created = await service.createUser({
//             clerkUserId: user.id,
//             name:
//               `${user.firstName} ${user.lastName}`.trim() ||
//               user.username ||
//               "User",
//             email: user.primaryEmailAddress?.emailAddress || "",
//           });

//           if (created) {
//             toast({
//               title: "Welcome!",
//               description: "Your account has been created successfully.",
//             });
//             existingStrapiUser = created;
//           }
//         }

//         // only proceed if we now have a valid Strapi user
//         if (existingStrapiUser) {
//           console.log("👉 Using Strapi AppUser ID:", existingStrapiUser.id);
//           setStrapiUser(existingStrapiUser);
//         } else {
//           // both fetch and create failed
//           toast({
//             title: "Error",
//             description: "Unable to fetch or create your Strapi user account.",
//             variant: "destructive",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching/creating Strapi user:", error);
//         toast({
//           title: "Error",
//           description:
//             "There was an error setting up your account. Please try again.",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoadingStrapi(false);
//       }
//     };

//     fetchOrCreateStrapiUser();
//   }, [isLoaded, isSignedIn, user, toast, useMockMode]);

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       setStrapiUser(null);
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   const value: AuthContextType = {
//     isAuthenticated: isSignedIn,
//     isLoading: !isLoaded || isLoadingStrapi,
//     strapiUser,
//     strapiUserId: strapiUser?.id ?? null,
//     signOut: handleSignOut,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthContext;
