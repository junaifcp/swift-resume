import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/services/apiService"; // Import the new apiService
import { toast } from "sonner";

// --- TYPE DEFINITIONS (Unchanged) ---
export type ExperienceItem = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  bulletPoints: string[];
};

export type EducationItem = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  bulletPoints: string[];
  url?: string;
};

export type SkillItem = {
  id: string;
  name: string;
  proficiency: number;
};

export type Template =
  | "template-a"
  | "template-b"
  | "template-c"
  | "template-d";

export type HeaderAlignment = "left" | "center" | "right";

// --- RESUME TYPE (Updated) ---
// Replaced 'strapiId' with '_id' to match MongoDB's document ID.
export type Resume = {
  _id?: string; // The database ID from MongoDB
  id: string; // The client-side or UUID from the backend
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  themeColor: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  lastUpdated: string;
  templateId: Template;
  headerAlignment: HeaderAlignment;
  profileImage?: string;
  declaration?: string;
};

// --- CONTEXT TYPE ---
type ResumeContextType = {
  resumes: Resume[];
  currentResumeId: string | null;
  isLoading: boolean;
  setCurrentResumeId: (id: string | null) => void;
  getResumeById: (id: string) => Resume | undefined;
  createResume: () => Promise<Resume | null>;
  updateResume: (resumeData: Resume) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  duplicateResume: (id: string) => Promise<void>;
};

// --- DEFAULT STATE ---
const defaultResume: Partial<Resume> = {
  name: "Untitled Resume",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  themeColor: "#0EA5E9",
  experiences: [],
  education: [],
  projects: [],
  skills: [],
  templateId: "template-b",
  headerAlignment: "left",
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};

// --- PROVIDER COMPONENT (Refactored) ---
export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Load resumes when authentication state is resolved
  useEffect(() => {
    const loadResumes = async () => {
      if (isAuthLoading) return; // Wait until Clerk has loaded

      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const fetchedResumes = await apiService.getResumes();
          setResumes(fetchedResumes);
        } catch (error) {
          console.error("Error loading resumes:", error);
          toast.error("Failed to load your resumes. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // If not authenticated, clear any existing resume data
        setResumes([]);
        setIsLoading(false);
      }
    };

    loadResumes();
  }, [isAuthenticated, isAuthLoading]);

  const getResumeById = (id: string) => {
    return resumes.find((resume) => resume.id === id);
  };

  const createResume = async (): Promise<Resume | null> => {
    if (!isAuthenticated) {
      toast.error("You must be signed in to create a resume.");
      return null;
    }

    try {
      const createdResume = await apiService.createResume(defaultResume);
      if (createdResume) {
        setResumes((prev) => [...prev, createdResume]);
        setCurrentResumeId(createdResume.id);
        toast.success("New resume created!");
        return createdResume;
      }
      return null;
    } catch (error) {
      console.error("Error creating resume:", error);
      toast.error("Failed to create a new resume.");
      return null;
    }
  };

  const updateResume = async (resumeData: Resume): Promise<void> => {
    if (!isAuthenticated || !resumeData._id) return;

    try {
      const updatedData = {
        ...resumeData,
        lastUpdated: new Date().toISOString(),
      };
      const updatedResume = await apiService.updateResume(
        resumeData._id,
        updatedData
      );
      setResumes(
        resumes.map((r) => (r._id === updatedResume._id ? updatedResume : r))
      );
      toast.success("Resume saved successfully");
    } catch (error) {
      console.error("Error updating resume:", error);
      toast.error("Failed to save changes.");
    }
  };

  const deleteResume = async (id: string): Promise<void> => {
    const resumeToDelete = resumes.find((r) => r.id === id);
    if (!isAuthenticated || !resumeToDelete?._id) return;

    try {
      await apiService.deleteResume(resumeToDelete._id);
      setResumes(resumes.filter((r) => r.id !== id));
      if (currentResumeId === id) {
        setCurrentResumeId(null);
      }
      toast.success("Resume deleted.");
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume.");
    }
  };

  const duplicateResume = async (id: string): Promise<void> => {
    const resumeToDuplicate = resumes.find((r) => r.id === id);
    if (!isAuthenticated || !resumeToDuplicate?._id) return;

    try {
      const duplicated = await apiService.duplicateResume(
        resumeToDuplicate._id
      );
      setResumes((prev) => [...prev, duplicated]);
      setCurrentResumeId(duplicated.id);
      toast.success("Resume duplicated successfully!");
    } catch (error) {
      console.error("Error duplicating resume:", error);
      toast.error("Failed to duplicate resume.");
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResumeId,
        isLoading,
        setCurrentResumeId,
        getResumeById,
        createResume,
        updateResume,
        deleteResume,
        duplicateResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

// import {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react";
// import { strapiService } from "@/services/strapiService";
// import { useAuth } from "@/context/AuthContext";
// import { toast } from "sonner";

// export type ExperienceItem = {
//   id: string;
//   company: string;
//   position: string;
//   startDate: string;
//   endDate: string;
//   description: string;
//   bulletPoints: string[];
// };

// export type EducationItem = {
//   id: string;
//   institution: string;
//   degree: string;
//   field: string;
//   startDate: string;
//   endDate: string;
//   description: string;
// };

// export type ProjectItem = {
//   id: string;
//   name: string;
//   role: string;
//   startDate: string;
//   endDate: string;
//   description: string;
//   bulletPoints: string[];
//   url?: string;
// };

// export type SkillItem = {
//   id: string;
//   name: string;
//   proficiency: number;
// };

// export type Template =
//   | "template-a"
//   | "template-b"
//   | "template-c"
//   | "template-d";

// export type HeaderAlignment = "left" | "center" | "right";

// export type Resume = {
//   id: string;
//   name: string;
//   title: string;
//   email: string;
//   phone: string;
//   location: string;
//   website: string;
//   summary: string;
//   themeColor: string;
//   experiences: ExperienceItem[];
//   education: EducationItem[];
//   projects: ProjectItem[];
//   skills: SkillItem[];
//   lastUpdated: string;
//   templateId: Template;
//   headerAlignment: HeaderAlignment;
//   profileImage?: string;
//   strapiId?: number;
//   declaration?: string; // Added declaration field which is optional
// };

// type ResumeContextType = {
//   resumes: Resume[];
//   currentResumeId: string | null;
//   isLoading: boolean;
//   setCurrentResumeId: (id: string | null) => void;
//   getResumeById: (id: string) => Resume | undefined;
//   createResume: () => Promise<Resume>;
//   updateResume: (resumeData: Resume) => Promise<void>;
//   deleteResume: (id: string) => Promise<void>;
// };

// const defaultResume: Resume = {
//   id: "",
//   name: "",
//   title: "",
//   email: "",
//   phone: "",
//   location: "",
//   website: "",
//   summary: "",
//   themeColor: "#0EA5E9",
//   experiences: [],
//   education: [],
//   projects: [],
//   skills: [],
//   lastUpdated: "",
//   templateId: "template-b",
//   headerAlignment: "left", // Default to left alignment
// };

// const ResumeContext = createContext<ResumeContextType>({
//   resumes: [],
//   currentResumeId: null,
//   isLoading: false,
//   setCurrentResumeId: () => {},
//   getResumeById: () => undefined,
//   createResume: async () => defaultResume,
//   updateResume: async () => {},
//   deleteResume: async () => {},
// });

// export const useResume = () => useContext(ResumeContext);

// export const ResumeProvider = ({ children }: { children: ReactNode }) => {
//   const [resumes, setResumes] = useState<Resume[]>([]);
//   const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const { isAuthenticated, strapiUserId, isLoading: isAuthLoading } = useAuth();
//   console.log("strapiUserId", strapiUserId);

//   // Check if we are using mock mode (no Strapi server)
//   const useMockMode = !import.meta.env.VITE_STRAPI_API_URL;

//   // Load resumes when authentication state changes
//   useEffect(() => {
//     const loadResumes = async () => {
//       if (isAuthLoading) return;

//       try {
//         setIsLoading(true);

//         if (isAuthenticated && strapiUserId) {
//           // Use either real or mock service based on environment
//           const service = useMockMode ? strapiService.mock : strapiService;

//           // Fetch resumes from Strapi
//           const fetchedResumes = await service.getResumesByUserId(strapiUserId);
//           setResumes(fetchedResumes);
//         } else {
//           // If not authenticated, load from localStorage as fallback
//           const savedResumes = localStorage.getItem("resumes");
//           setResumes(savedResumes ? JSON.parse(savedResumes) : []);
//         }
//       } catch (error) {
//         console.error("Error loading resumes:", error);
//         toast.error("Failed to load your resumes. Please try again.");

//         // Fallback to localStorage
//         const savedResumes = localStorage.getItem("resumes");
//         setResumes(savedResumes ? JSON.parse(savedResumes) : []);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadResumes();
//   }, [isAuthenticated, strapiUserId, isAuthLoading, useMockMode]);

//   const saveResumesToStorage = (updatedResumes: Resume[]) => {
//     // Only save to localStorage if not authenticated
//     if (!isAuthenticated) {
//       localStorage.setItem("resumes", JSON.stringify(updatedResumes));
//     }
//   };

//   const getResumeById = (id: string) => {
//     return resumes.find((resume) => resume.id === id);
//   };

//   const createResume = async (): Promise<Resume> => {
//     const newResume: Resume = {
//       ...defaultResume,
//       id: `resume-${Date.now()}`,
//       name: "Untitled Resume",
//       lastUpdated: new Date().toISOString(),
//     };

//     try {
//       let createdResume = newResume;

//       // If authenticated, create resume in Strapi
//       if (isAuthenticated && strapiUserId) {
//         const service = useMockMode ? strapiService.mock : strapiService;
//         // Fixed TypeScript error by ensuring strapiUserId is a number
//         if (typeof strapiUserId === 'number') {
//           const strapiResume = await service.createResume(newResume, strapiUserId);

//           if (strapiResume) {
//             createdResume = strapiResume;
//           }
//         }
//       }

//       const updatedResumes = [...resumes, createdResume];
//       setResumes(updatedResumes);
//       saveResumesToStorage(updatedResumes);
//       setCurrentResumeId(createdResume.id);

//       return createdResume;
//     } catch (error) {
//       console.error("Error creating resume:", error);
//       toast.error("Failed to create a new resume. Please try again.");

//       // Fallback to local creation
//       const updatedResumes = [...resumes, newResume];
//       setResumes(updatedResumes);
//       saveResumesToStorage(updatedResumes);
//       setCurrentResumeId(newResume.id);

//       return newResume;
//     }
//   };

//   const updateResume = async (resumeData: Resume): Promise<void> => {
//     try {
//       let updatedResume = {
//         ...resumeData,
//         lastUpdated: new Date().toISOString(),
//       };

//       // If authenticated and resume has strapiId, update in Strapi
//       if (isAuthenticated && strapiUserId && resumeData.strapiId) {
//         const service = useMockMode ? strapiService.mock : strapiService;
//         const strapiResume = await service.updateResume(
//           resumeData,
//           resumeData.strapiId
//         );

//         if (strapiResume) {
//           updatedResume = strapiResume;
//         }
//       } else if (isAuthenticated && strapiUserId && !resumeData.strapiId) {
//         // If the resume doesn't have a strapiId yet but user is authenticated, create it in Strapi
//         const service = useMockMode ? strapiService.mock : strapiService;
//         // Fixed TypeScript error by ensuring strapiUserId is a number
//         if (typeof strapiUserId === 'number') {
//           const strapiResume = await service.createResume(resumeData, strapiUserId);
//           if (strapiResume) {
//             updatedResume = strapiResume;
//           }
//         }
//       }

//       const updatedResumes = resumes.map((resume) =>
//         resume.id === resumeData.id ? updatedResume : resume
//       );

//       setResumes(updatedResumes);
//       saveResumesToStorage(updatedResumes);
//       toast.success("Resume saved successfully");
//     } catch (error) {
//       console.error("Error updating resume:", error);
//       toast.error("Failed to save changes. Please try again.");

//       // Update locally even if Strapi fails
//       const updatedResumes = resumes.map((resume) =>
//         resume.id === resumeData.id
//           ? { ...resumeData, lastUpdated: new Date().toISOString() }
//           : resume
//       );

//       setResumes(updatedResumes);
//       saveResumesToStorage(updatedResumes);
//     }
//   };

//   const deleteResume = async (id: string): Promise<void> => {
//     try {
//       const resumeToDelete = resumes.find((resume) => resume.id === id);

//       // If authenticated and resume has strapiId, delete from Strapi
//       if (isAuthenticated && resumeToDelete?.strapiId) {
//         const service = useMockMode ? strapiService.mock : strapiService;
//         await service.deleteResume(resumeToDelete.strapiId);
//       }

//       const updatedResumes = resumes.filter((resume) => resume.id !== id);
//       setResumes(updatedResumes);
//       saveResumesToStorage(updatedResumes);

//       if (currentResumeId === id) {
//         setCurrentResumeId(null);
//       }
//     } catch (error) {
//       console.error("Error deleting resume:", error);
//       toast.error("Failed to delete resume. Please try again.");

//       // Delete locally even if Strapi fails
//       const updatedResumes = resumes.filter((resume) => resume.id !== id);
//       setResumes(updatedResumes);
//       saveResumesToStorage(updatedResumes);

//       if (currentResumeId === id) {
//         setCurrentResumeId(null);
//       }
//     }
//   };

//   return (
//     <ResumeContext.Provider
//       value={{
//         resumes,
//         currentResumeId,
//         isLoading,
//         setCurrentResumeId,
//         getResumeById,
//         createResume,
//         updateResume,
//         deleteResume,
//       }}
//     >
//       {children}
//     </ResumeContext.Provider>
//   );
// };
