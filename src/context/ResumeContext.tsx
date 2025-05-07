
import { createContext, useContext, useState, ReactNode } from 'react';

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

export type SkillItem = {
  id: string;
  name: string;
  proficiency: number;
};

export type Template = 'template-a' | 'template-b' | 'template-c' | 'template-d';

export type Resume = {
  id: string;
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
  skills: SkillItem[];
  lastUpdated: string;
  templateId: Template;
  profileImage?: string;
};

type ResumeContextType = {
  resumes: Resume[];
  currentResumeId: string | null;
  setCurrentResumeId: (id: string | null) => void;
  getResumeById: (id: string) => Resume | undefined;
  createResume: () => Resume;
  updateResume: (resumeData: Resume) => void;
  deleteResume: (id: string) => void;
};

const defaultResume: Resume = {
  id: '',
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  summary: '',
  themeColor: '#0EA5E9',
  experiences: [],
  education: [],
  skills: [],
  lastUpdated: '',
  templateId: 'template-b', // Default template is text-only
};

const ResumeContext = createContext<ResumeContextType>({
  resumes: [],
  currentResumeId: null,
  setCurrentResumeId: () => {},
  getResumeById: () => undefined,
  createResume: () => defaultResume,
  updateResume: () => {},
  deleteResume: () => {},
});

export const useResume = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumes, setResumes] = useState<Resume[]>(() => {
    const savedResumes = localStorage.getItem('resumes');
    return savedResumes ? JSON.parse(savedResumes) : [];
  });
  
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  const saveResumesToStorage = (updatedResumes: Resume[]) => {
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
  };

  const getResumeById = (id: string) => {
    return resumes.find(resume => resume.id === id);
  };

  const createResume = () => {
    const newResume: Resume = {
      ...defaultResume,
      id: `resume-${Date.now()}`,
      name: 'Untitled Resume',
      lastUpdated: new Date().toISOString(),
    };
    
    const updatedResumes = [...resumes, newResume];
    setResumes(updatedResumes);
    saveResumesToStorage(updatedResumes);
    setCurrentResumeId(newResume.id);
    
    return newResume;
  };

  const updateResume = (resumeData: Resume) => {
    const updatedResumes = resumes.map(resume => 
      resume.id === resumeData.id 
        ? { ...resumeData, lastUpdated: new Date().toISOString() } 
        : resume
    );
    
    setResumes(updatedResumes);
    saveResumesToStorage(updatedResumes);
  };

  const deleteResume = (id: string) => {
    const updatedResumes = resumes.filter(resume => resume.id !== id);
    setResumes(updatedResumes);
    saveResumesToStorage(updatedResumes);
    
    if (currentResumeId === id) {
      setCurrentResumeId(null);
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResumeId,
        setCurrentResumeId,
        getResumeById,
        createResume,
        updateResume,
        deleteResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
