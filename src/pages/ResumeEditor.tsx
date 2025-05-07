
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResume, Template } from '@/context/ResumeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Eye, FileText } from 'lucide-react';
import BasicInfo from '@/components/resume-editor/BasicInfo';
import Experience from '@/components/resume-editor/Experience';
import Education from '@/components/resume-editor/Education';
import Skills from '@/components/resume-editor/Skills';
import FinalReview from '@/components/resume-editor/FinalReview';
import ResumePreview from '@/components/resume-editor/ResumePreview';
import TemplateChooser from '@/components/resume-editor/TemplateChooser';
import ProfileImageUpload from '@/components/resume-editor/ProfileImageUpload';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const ResumeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getResumeById, updateResume, currentResumeId, setCurrentResumeId } = useResume();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [showPreview, setShowPreview] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const { toast: uiToast } = useToast();
  const isMobile = useIsMobile();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  // If templateId is missing in the resume data, default to template-b
  const resumeWithTemplate = getResumeById(id || '');
  const [resumeData, setResumeData] = useState(resumeWithTemplate ? {
    ...resumeWithTemplate,
    templateId: resumeWithTemplate.templateId || 'template-b'
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

    // Ensure templateId exists
    const resumeWithTemplate = {
      ...resume,
      templateId: resume.templateId || 'template-b'
    };

    setResumeData(resumeWithTemplate);
    setCurrentResumeId(id);
  }, [id, getResumeById, navigate, setCurrentResumeId]);

  useEffect(() => {
    // Reset "dirty" state when changing tabs
    if (resumeData && !isDirty) {
      const resume = getResumeById(id || '');
      if (resume) {
        setResumeData({
          ...resume,
          templateId: resume.templateId || 'template-b'
        });
      }
    }
  }, [activeTab]);

  const handleUpdateResume = (data: Partial<typeof resumeData>) => {
    if (!resumeData) return;
    
    const updatedResume = { ...resumeData, ...data };
    setResumeData(updatedResume);
    setIsDirty(true);
  };

  const handleSaveChanges = () => {
    if (resumeData) {
      updateResume(resumeData);
      setIsDirty(false);
      uiToast({
        title: "Changes saved",
        description: "Your resume has been updated successfully."
      });
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

  const handleProfileImageChange = (imageBase64: string | undefined) => {
    if (!resumeData) return;

    const updatedResume = { 
      ...resumeData, 
      profileImage: imageBase64 
    };
    setResumeData(updatedResume);
    setIsDirty(true);
  };

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b bg-white">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-mono text-lg md:text-xl font-bold hidden sm:block">
            {resumeData.name}
          </h1>
        </div>
        <div className="flex gap-3">
          <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Change Template</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <TemplateChooser 
                selectedTemplate={resumeData.templateId || 'template-b'} 
                onSelectTemplate={handleTemplateChange} 
              />
            </DialogContent>
          </Dialog>

          {!isMobile && (
            <Button variant="outline" onClick={togglePreview} className="flex items-center gap-2">
              <Eye size={16} />
              <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </Button>
          )}
          
          <Button onClick={handleSaveChanges} disabled={!isDirty} className="flex items-center gap-2">
            <Save size={16} />
            <span>Save</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className={`flex h-[calc(100vh-73px)] overflow-hidden ${!showPreview && !isMobile ? 'justify-center' : ''}`}>
        {/* Editor Panel */}
        <div className={`${showPreview && !isMobile ? 'w-1/2' : 'w-full'} overflow-auto p-6 md:p-12`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 grid grid-cols-5 w-full">
              <TabsTrigger value="basic-info" className="text-xs md:text-sm">Basic Info</TabsTrigger>
              <TabsTrigger value="experience" className="text-xs md:text-sm">Experience</TabsTrigger>
              <TabsTrigger value="education" className="text-xs md:text-sm">Education</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs md:text-sm">Skills</TabsTrigger>
              <TabsTrigger value="final" className="text-xs md:text-sm">Review</TabsTrigger>
            </TabsList>
            
            <div className="pb-24">
              <TabsContent value="basic-info" className="mt-0">
                {/* Show profile image upload only for template-a */}
                {resumeData.templateId === 'template-a' && (
                  <div className="mb-8 pb-8 border-b">
                    <ProfileImageUpload 
                      currentImage={resumeData.profileImage} 
                      onImageChange={handleProfileImageChange} 
                    />
                  </div>
                )}
                <BasicInfo resume={resumeData} updateResume={handleUpdateResume} />
              </TabsContent>
              
              <TabsContent value="experience" className="mt-0">
                <Experience resume={resumeData} updateResume={handleUpdateResume} />
              </TabsContent>
              
              <TabsContent value="education" className="mt-0">
                <Education resume={resumeData} updateResume={handleUpdateResume} />
              </TabsContent>
              
              <TabsContent value="skills" className="mt-0">
                <Skills resume={resumeData} updateResume={handleUpdateResume} />
              </TabsContent>
              
              <TabsContent value="final" className="mt-0">
                <FinalReview resume={resumeData} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Preview Panel */}
        {(showPreview || isMobile) && (
          <div 
            className={`${
              isMobile ? 'fixed inset-x-0 bottom-0 top-auto p-4 h-auto z-10' : 'w-1/2 border-l p-6'
            }`}
          >
            {isMobile ? (
              <div className="relative">
                <Button
                  variant="outline"
                  className="absolute top-0 right-0 z-20 rounded-full h-10 w-10 p-0 mb-2"
                  onClick={togglePreview}
                >
                  <ChevronLeft size={16} className={showPreview ? 'rotate-90' : '-rotate-90'} />
                </Button>
                
                {showPreview && (
                  <div className="pt-4 h-[40vh] overflow-auto bg-white rounded-t-xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
                    <div className="px-4">
                      <ResumePreview resume={resumeData} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium">Preview</h2>
                  <span className="text-sm text-muted-foreground">
                    {resumeData.templateId === 'template-a' 
                      ? 'Template A' 
                      : resumeData.templateId === 'template-b' 
                      ? 'Template B'
                      : resumeData.templateId === 'template-c' 
                      ? 'Template C (ATS-Friendly)'
                      : 'Template D (Plain)'}
                  </span>
                </div>
                <div className="animate-fade-in">
                  <ResumePreview resume={resumeData} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Nav */}
      {isMobile && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-20">
          <Button 
            onClick={togglePreview} 
            className="shadow-lg flex items-center gap-2"
            variant={showPreview ? "secondary" : "default"}
          >
            <Eye size={16} />
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;
