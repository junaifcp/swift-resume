import axios from "axios";
import { Resume } from "@/context/ResumeContext"; // Assuming this type is still valid

// Extend the Window interface to include Clerk
declare global {
  interface Window {
    Clerk: any;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://95c3-2a09-bac1-36c0-38-00-2a5-c2.ngrok-free.app/api";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Interceptor to add the JWT token from Clerk to every outgoing request.
 * This is crucial for authenticating the user on the backend.
 */
apiClient.interceptors.request.use(async (config) => {
  // We need to get the token from Clerk's useAuth hook.
  // Since this is not a React component, we'll manage the token via a function
  // that can be called from within our components/context.
  // For now, let's assume we have a way to get the token.
  const token = window.Clerk.session?.getToken
    ? await window.Clerk.session.getToken()
    : null;
  if (token) {
    console.log("Adding Authorization header with token:", token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * @description The new API service to interact with the Node.js backend.
 */
export const apiService = {
  // Resume operations
  async getResumes(): Promise<Resume[]> {
    const response = await apiClient.get("/resumes");
    // The new backend returns resumes that match the frontend format directly.
    // We just need to ensure the ID mapping is correct (_id from MongoDB).
    return response.data.map((resume: any) => ({
      ...resume,
      strapiId: resume._id, // Keep a reference to the database ID
    }));
  },

  async getResumeById(id: string): Promise<Resume> {
    const response = await apiClient.get(`/resumes/${id}`);
    return {
      ...response.data,
      strapiId: response.data._id,
    };
  },

  async createResume(resumeData: Partial<Resume>): Promise<Resume> {
    const response = await apiClient.post("/resumes", resumeData);
    return {
      ...response.data,
      strapiId: response.data._id,
    };
  },

  async updateResume(id: string, resumeData: Partial<Resume>): Promise<Resume> {
    const response = await apiClient.put(`/resumes/${id}`, resumeData);
    return {
      ...response.data,
      strapiId: response.data._id,
    };
  },

  async deleteResume(id: string): Promise<boolean> {
    await apiClient.delete(`/resumes/${id}`);
    return true;
  },

  async duplicateResume(id: string): Promise<Resume> {
    const response = await apiClient.post(`/resumes/${id}/duplicate`);
    return {
      ...response.data,
      strapiId: response.data._id,
    };
  },

  // File upload operations
  async uploadProfileImage(file: File): Promise<{ filePath: string }> {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await apiClient.post("/upload/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Subscription operations
  async getSubscriptionPlans() {
    // This endpoint is public, so it can be called without a token.
    const response = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
    return response.data;
  },

  async createSubscription(planId: string) {
    const response = await apiClient.post("/subscriptions/create", { planId });
    return response.data;
  },

  async verifySubscription(paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const response = await apiClient.post(
      "/subscriptions/verify",
      paymentDetails
    );
    return response.data;
  },
};

export default apiService;

// import axios from "axios";
// import { Resume } from "@/context/ResumeContext";

// const API_URL = import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337";

// // Types for Strapi data
// export interface StrapiUser {
//   id: number;
//   clerkUserId: string;
//   name: string;
//   email: string;
// }

// export interface StrapiResume {
//   id: number;
//   templateId: string;
//   basicInfo: object;
//   sections: object;
//   user?: number | { id: number };
// }

// // Convert frontend Resume to Strapi format
// const convertToStrapiResume = (
//   resume: Resume,
//   userId?: number
// ): Partial<StrapiResume> => {
//   const {
//     id,
//     templateId,
//     name,
//     title,
//     email,
//     phone,
//     location,
//     website,
//     summary,
//     themeColor,
//     profileImage,
//     declaration,
//     headerAlignment,
//     ...rest
//   } = resume;

//   return {
//     templateId: templateId || "template-b",
//     basicInfo: {
//       name,
//       title,
//       email,
//       phone,
//       location,
//       website,
//       summary,
//       themeColor,
//       profileImage,
//       declaration,
//       headerAlignment,
//     },
//     sections: {
//       experiences: resume.experiences,
//       education: resume.education,
//       projects: resume.projects,
//       skills: resume.skills,
//     },
//     ...(userId && { user: userId }),
//   };
// };

// // Convert Strapi Resume to frontend format
// const convertToFrontendResume = (strapiResume: any): Resume => {
//   const { id, templateId, basicInfo, sections } = strapiResume;
//   const {
//     experiences = [],
//     education = [],
//     projects = [],
//     skills = [],
//   } = sections || {};
//   const {
//     name,
//     title,
//     email,
//     phone,
//     location,
//     website,
//     summary,
//     themeColor,
//     profileImage,
//     declaration,
//     headerAlignment,
//   } = basicInfo || {};

//   return {
//     id: `resume-${id}`,
//     templateId: templateId || "template-b",
//     name: name || "Untitled Resume",
//     title: title || "",
//     email: email || "",
//     phone: phone || "",
//     location: location || "",
//     website: website || "",
//     summary: summary || "",
//     themeColor: themeColor || "#0EA5E9",
//     profileImage: profileImage || undefined,
//     declaration: declaration || "",
//     headerAlignment: headerAlignment || "left",
//     experiences: experiences,
//     education: education,
//     projects: projects || [],
//     skills: skills,
//     lastUpdated: new Date().toISOString(),
//     strapiId: id,
//   };
// };

// // Strapi API service
// export const strapiService = {
//   async getUserByClerkId(clerkUserId: string): Promise<StrapiUser | null> {
//     console.log("Fetching user by Clerk ID:", clerkUserId);
//     const res = await axios.get(
//       `${API_URL}/api/app-users?filters[clerkUserId][$eq]=${clerkUserId}&populate=*`
//     );
//     const record = res.data.data?.[0];
//     console.log("Fetched user data:", record);
//     if (!record) return null;
//     // record = { id: 5, attributes: { clerkUserId, name, email } }
//     return { id: record.id, ...record.attributes };
//   },
//   // User operations
//   // async getUserByClerkId(clerkUserId: string): Promise<StrapiUser | null> {
//   //   try {
//   //     const response = await axios.get(
//   //       `${API_URL}/api/app-users?filters[clerkUserId][$eq]=${clerkUserId}&populate=*`
//   //     );
//   //     if (
//   //       response.data &&
//   //       response.data.data &&
//   //       response.data.data.length > 0
//   //     ) {
//   //       return response.data.data[0];
//   //     }
//   //     return null;
//   //   } catch (error) {
//   //     console.error("Error fetching user by clerk ID:", error);
//   //     return null;
//   //   }
//   // },
//   // Create a new AppUser
//   async createUser(userData: {
//     clerkUserId: string;
//     name: string;
//     email: string;
//   }): Promise<StrapiUser | null> {
//     try {
//       const res = await axios.post(`${API_URL}/api/app-users`, {
//         data: userData,
//       });
//       const record = res.data.data;
//       return { id: record.id, ...record.attributes };
//     } catch (error: any) {
//       const err = error.response?.data?.error;
//       // If the only error is “clerkUserId must be unique,”
//       // re-call getUserByClerkId and return that instead:
//       if (
//         err?.name === "ValidationError" &&
//         err.details?.errors?.some((e: any) => e.path[0] === "clerkUserId")
//       ) {
//         console.warn("AppUser already exists, fetching it instead");
//         return this.getUserByClerkId(userData.clerkUserId);
//       }
//       console.error("Error creating AppUser:", err || error);
//       return null;
//     }
//   },
//   // async createUser(userData: {
//   //   clerkUserId: string;
//   //   name: string;
//   //   email: string;
//   // }): Promise<StrapiUser | null> {
//   //   try {
//   //     const response = await axios.post(`${API_URL}/api/app-users`, {
//   //       data: userData,
//   //     });
//   //     return response.data.data;
//   //   } catch (error) {
//   //     console.error("Error creating user:", error);
//   //     return null;
//   //   }
//   // },

//   // Resume operations
//   async getResumesByUserId(userId: number): Promise<Resume[]> {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/resumes?filters[user][id][$eq]=${userId}&populate=*`
//       );
//       if (response.data && response.data.data) {
//         return response.data.data.map(convertToFrontendResume);
//       }
//       return [];
//     } catch (error) {
//       console.error("Error fetching resumes:", error);
//       return [];
//     }
//   },

//   async createResume(resume: Resume, userId: number): Promise<Resume | null> {
//     try {
//       const strapiData = convertToStrapiResume(resume, userId);
//       const response = await axios.post(`${API_URL}/api/resumes`, {
//         data: strapiData,
//       });
//       return convertToFrontendResume(response.data.data);
//     } catch (error) {
//       console.error("Error creating resume:", error);
//       return null;
//     }
//   },

//   async updateResume(
//     resume: Resume,
//     strapiResumeId: number
//   ): Promise<Resume | null> {
//     try {
//       const strapiData = convertToStrapiResume(resume);
//       const response = await axios.put(
//         `${API_URL}/api/resumes/${strapiResumeId}`,
//         { data: strapiData }
//       );
//       return convertToFrontendResume(response.data.data);
//     } catch (error) {
//       console.error("Error updating resume:", error);
//       return null;
//     }
//   },

//   async deleteResume(strapiResumeId: number): Promise<boolean> {
//     try {
//       await axios.delete(`${API_URL}/api/resumes/${strapiResumeId}`);
//       return true;
//     } catch (error) {
//       console.error("Error deleting resume:", error);
//       return false;
//     }
//   },

//   // Mock API for development without Strapi
//   mock: {
//     async getUserByClerkId(clerkUserId: string): Promise<StrapiUser> {
//       console.log("Mock: Getting user with clerk ID", clerkUserId);
//       return {
//         id: 1,
//         clerkUserId,
//         name: "Demo User",
//         email: "user@example.com",
//       };
//     },

//     async createUser(userData: {
//       clerkUserId: string;
//       name: string;
//       email: string;
//     }): Promise<StrapiUser> {
//       console.log("Mock: Creating user", userData);
//       return {
//         id: 1,
//         ...userData,
//       };
//     },

//     async getResumesByUserId(userId: number): Promise<Resume[]> {
//       console.log("Mock: Getting resumes for user", userId);
//       return [
//         {
//           id: "resume-1",
//           name: "Software Engineer Resume",
//           title: "Senior Software Engineer",
//           email: "user@example.com",
//           phone: "123-456-7890",
//           location: "San Francisco, CA",
//           website: "example.com",
//           summary:
//             "Experienced software engineer with a passion for building great products.",
//           themeColor: "#0EA5E9",
//           experiences: [],
//           education: [],
//           skills: [],
//           lastUpdated: new Date().toISOString(),
//           templateId: "template-b",
//           projects: [],
//           declaration: "",
//           headerAlignment: "left",
//         },
//         {
//           id: "resume-2",
//           name: "Product Manager Resume",
//           title: "Product Manager",
//           email: "user@example.com",
//           phone: "123-456-7890",
//           location: "New York, NY",
//           website: "example.com",
//           summary:
//             "Product manager with a track record of shipping successful products.",
//           themeColor: "#10B981",
//           experiences: [],
//           education: [],
//           skills: [],
//           lastUpdated: new Date().toISOString(),
//           templateId: "template-a",
//           projects: [],
//           declaration: "",
//           headerAlignment: "left",
//         },
//       ];
//     },

//     async createResume(resume: Resume): Promise<Resume> {
//       console.log("Mock: Creating resume", resume);
//       return {
//         ...resume,
//         id: `resume-mock-${Date.now()}`,
//         lastUpdated: new Date().toISOString(),
//       };
//     },

//     async updateResume(resume: Resume): Promise<Resume> {
//       console.log("Mock: Updating resume", resume);
//       return {
//         ...resume,
//         lastUpdated: new Date().toISOString(),
//       };
//     },

//     async deleteResume(resumeId: number): Promise<boolean> {
//       console.log("Mock: Deleting resume", resumeId);
//       return true;
//     },
//   },
// };

// export default strapiService;
