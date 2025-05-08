import axios from "axios";
import { Resume } from "@/context/ResumeContext";

const API_URL = import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337";

// Types for Strapi data
export interface StrapiUser {
  id: number;
  clerkUserId: string;
  name: string;
  email: string;
}

export interface StrapiResume {
  id: number;
  templateId: string;
  basicInfo: object;
  sections: object;
  user?: number | { id: number };
}

// Convert frontend Resume to Strapi format
const convertToStrapiResume = (
  resume: Resume,
  userId?: number
): Partial<StrapiResume> => {
  const {
    id,
    templateId,
    name,
    title,
    email,
    phone,
    location,
    website,
    summary,
    themeColor,
    profileImage,
    ...rest
  } = resume;

  return {
    templateId: templateId || "template-b",
    basicInfo: {
      name,
      title,
      email,
      phone,
      location,
      website,
      summary,
      themeColor,
      profileImage,
    },
    sections: {
      experiences: resume.experiences,
      education: resume.education,
      skills: resume.skills,
    },
    ...(userId && { user: userId }),
  };
};

// Convert Strapi Resume to frontend format
const convertToFrontendResume = (strapiResume: any): Resume => {
  const { id, templateId, basicInfo, sections } = strapiResume;
  const { experiences = [], education = [], skills = [] } = sections || {};
  const {
    name,
    title,
    email,
    phone,
    location,
    website,
    summary,
    themeColor,
    profileImage,
  } = basicInfo || {};

  return {
    id: `resume-${id}`,
    templateId: templateId || "template-b",
    name: name || "Untitled Resume",
    title: title || "",
    email: email || "",
    phone: phone || "",
    location: location || "",
    website: website || "",
    summary: summary || "",
    themeColor: themeColor || "#0EA5E9",
    profileImage: profileImage || undefined,
    experiences: experiences,
    education: education,
    skills: skills,
    lastUpdated: new Date().toISOString(),
  };
};

// Strapi API service
export const strapiService = {
  async getUserByClerkId(clerkUserId: string): Promise<StrapiUser | null> {
    console.log("Fetching user by Clerk ID:", clerkUserId);
    const res = await axios.get(
      `${API_URL}/api/app-users?filters[clerkUserId][$eq]=${clerkUserId}&populate=*`
    );
    const record = res.data.data?.[0];
    console.log("Fetched user data:", record);
    if (!record) return null;
    // record = { id: 5, attributes: { clerkUserId, name, email } }
    return { id: record.id, ...record.attributes };
  },
  // User operations
  // async getUserByClerkId(clerkUserId: string): Promise<StrapiUser | null> {
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/api/app-users?filters[clerkUserId][$eq]=${clerkUserId}&populate=*`
  //     );
  //     if (
  //       response.data &&
  //       response.data.data &&
  //       response.data.data.length > 0
  //     ) {
  //       return response.data.data[0];
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error("Error fetching user by clerk ID:", error);
  //     return null;
  //   }
  // },
  // Create a new AppUser
  async createUser(userData: {
    clerkUserId: string;
    name: string;
    email: string;
  }): Promise<StrapiUser | null> {
    try {
      const res = await axios.post(`${API_URL}/api/app-users`, {
        data: userData,
      });
      const record = res.data.data;
      return { id: record.id, ...record.attributes };
    } catch (error: any) {
      const err = error.response?.data?.error;
      // If the only error is “clerkUserId must be unique,”
      // re-call getUserByClerkId and return that instead:
      if (
        err?.name === "ValidationError" &&
        err.details?.errors?.some((e: any) => e.path[0] === "clerkUserId")
      ) {
        console.warn("AppUser already exists, fetching it instead");
        return this.getUserByClerkId(userData.clerkUserId);
      }
      console.error("Error creating AppUser:", err || error);
      return null;
    }
  },
  // async createUser(userData: {
  //   clerkUserId: string;
  //   name: string;
  //   email: string;
  // }): Promise<StrapiUser | null> {
  //   try {
  //     const response = await axios.post(`${API_URL}/api/app-users`, {
  //       data: userData,
  //     });
  //     return response.data.data;
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //     return null;
  //   }
  // },

  // Resume operations
  async getResumesByUserId(userId: number): Promise<Resume[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/resumes?filters[user][id][$eq]=${userId}&populate=*`
      );
      if (response.data && response.data.data) {
        return response.data.data.map(convertToFrontendResume);
      }
      return [];
    } catch (error) {
      console.error("Error fetching resumes:", error);
      return [];
    }
  },

  async createResume(resume: Resume, userId: number): Promise<Resume | null> {
    try {
      const strapiData = convertToStrapiResume(resume, userId);
      const response = await axios.post(`${API_URL}/api/resumes`, {
        data: strapiData,
      });
      return convertToFrontendResume(response.data.data);
    } catch (error) {
      console.error("Error creating resume:", error);
      return null;
    }
  },

  async updateResume(
    resume: Resume,
    strapiResumeId: number
  ): Promise<Resume | null> {
    try {
      const strapiData = convertToStrapiResume(resume);
      const response = await axios.put(
        `${API_URL}/api/resumes/${strapiResumeId}`,
        { data: strapiData }
      );
      return convertToFrontendResume(response.data.data);
    } catch (error) {
      console.error("Error updating resume:", error);
      return null;
    }
  },

  async deleteResume(strapiResumeId: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/api/resumes/${strapiResumeId}`);
      return true;
    } catch (error) {
      console.error("Error deleting resume:", error);
      return false;
    }
  },

  // Mock API for development without Strapi
  mock: {
    async getUserByClerkId(clerkUserId: string): Promise<StrapiUser> {
      console.log("Mock: Getting user with clerk ID", clerkUserId);
      return {
        id: 1,
        clerkUserId,
        name: "Demo User",
        email: "user@example.com",
      };
    },

    async createUser(userData: {
      clerkUserId: string;
      name: string;
      email: string;
    }): Promise<StrapiUser> {
      console.log("Mock: Creating user", userData);
      return {
        id: 1,
        ...userData,
      };
    },

    async getResumesByUserId(userId: number): Promise<Resume[]> {
      console.log("Mock: Getting resumes for user", userId);
      return [
        {
          id: "resume-1",
          name: "Software Engineer Resume",
          title: "Senior Software Engineer",
          email: "user@example.com",
          phone: "123-456-7890",
          location: "San Francisco, CA",
          website: "example.com",
          summary:
            "Experienced software engineer with a passion for building great products.",
          themeColor: "#0EA5E9",
          experiences: [],
          education: [],
          skills: [],
          lastUpdated: new Date().toISOString(),
          templateId: "template-b",
        },
        {
          id: "resume-2",
          name: "Product Manager Resume",
          title: "Product Manager",
          email: "user@example.com",
          phone: "123-456-7890",
          location: "New York, NY",
          website: "example.com",
          summary:
            "Product manager with a track record of shipping successful products.",
          themeColor: "#10B981",
          experiences: [],
          education: [],
          skills: [],
          lastUpdated: new Date().toISOString(),
          templateId: "template-a",
        },
      ];
    },

    async createResume(resume: Resume): Promise<Resume> {
      console.log("Mock: Creating resume", resume);
      return {
        ...resume,
        id: `resume-mock-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
      };
    },

    async updateResume(resume: Resume): Promise<Resume> {
      console.log("Mock: Updating resume", resume);
      return {
        ...resume,
        lastUpdated: new Date().toISOString(),
      };
    },

    async deleteResume(resumeId: number): Promise<boolean> {
      console.log("Mock: Deleting resume", resumeId);
      return true;
    },
  },
};

export default strapiService;
