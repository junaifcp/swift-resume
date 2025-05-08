
import { useState, useEffect } from 'react';
import { useResume, Resume, Template } from '@/context/ResumeContext';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

export const useResumeEditor = (id: string | undefined, navigate: (path: string) => void) => {
  const { getResumeById, updateResume: saveResume, currentResumeId, setCurrentResumeId } = useResume();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [showPreview, setShowPreview] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const { toast: uiToast } = useToast();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  // If templateId is missing in the resume data, default to template-b
  const resumeWithTemplate = getResumeById(id || '');
  const [resumeData, setResumeData] = useState(resumeWithTemplate ? {
    ...resumeWithTemplate,
    templateId: resumeWithTemplate.templateId || 'template-b',
    projects: resumeWithTemplate.projects || [],
    declaration: resumeWithTemplate.declaration || ''
  } : undefined);

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    const resume = getResumeById(id);
    if (!resume) {
      uiToast({
        title: "Resume not found",
        description: "The resume you're looking for doesn't exist.",
      });
      navigate('/dashboard');
      return;
    }

    // Ensure required fields exist
    const resumeWithDefaults = {
      ...resume,
      templateId: resume.templateId || 'template-b',
      projects: resume.projects || [],
      declaration: resume.declaration || ''
    };

    setResumeData(resumeWithDefaults);
    setCurrentResumeId(id);
  }, [id, getResumeById, navigate, setCurrentResumeId]);

  useEffect(() => {
    // Reset "dirty" state when changing tabs
    if (resumeData && !isDirty) {
      const resume = getResumeById(id || '');
      if (resume) {
        setResumeData({
          ...resume,
          templateId: resume.templateId || 'template-b',
          projects: resume.projects || [],
          declaration: resume.declaration || ''
        });
      }
    }
  }, [activeTab, getResumeById, id, isDirty, resumeData]);

  const updateResume = (data: Partial<Resume>) => {
    if (!resumeData) return;
    
    const updatedResume = { ...resumeData, ...data };
    setResumeData(updatedResume);
    setIsDirty(true);
  };

  const handleSaveChanges = async () => {
    if (resumeData) {
      try {
        await saveResume(resumeData);
        setIsDirty(false);
        uiToast({
          title: "Changes saved",
          description: "Your resume has been updated successfully."
        });
      } catch (error) {
        console.error("Error saving resume:", error);
        uiToast({
          title: "Error saving",
          description: "There was a problem saving your resume. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleTemplateChange = (template: Template) => {
    if (!resumeData) return;

    const updatedResume = { 
      ...resumeData, 
      templateId: template 
    };
    setResumeData(updatedResume);
    setIsDirty(true);
    setTemplateDialogOpen(false);
    
    let templateName = "";
    switch (template) {
      case 'template-a':
        templateName = 'Template A';
        break;
      case 'template-b':
        templateName = 'Template B';
        break;
      case 'template-c':
        templateName = 'Template C (ATS-Friendly)';
        break;
      case 'template-d':
        templateName = 'Template D (Plain)';
        break;
    }
    
    toast.success(`Template updated—your resume now uses ${templateName}.`);
  };

  return {
    resumeData,
    activeTab,
    setActiveTab,
    showPreview,
    togglePreview,
    isDirty,
    updateResume,
    handleSaveChanges,
    templateDialogOpen,
    setTemplateDialogOpen,
    handleTemplateChange
  };
};
