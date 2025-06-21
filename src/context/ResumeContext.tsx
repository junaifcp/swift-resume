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
