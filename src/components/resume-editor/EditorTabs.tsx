
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfo from './BasicInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Projects from './Projects';
import Declaration from './Declaration';
import FinalReview from './FinalReview';
import ProfileImageUpload from './ProfileImageUpload';
import { Resume } from '@/context/ResumeContext';
import { FileText, Briefcase, GraduationCap, FolderKanban, Award, FileSignature, CheckCircle } from 'lucide-react';

type EditorTabsProps = {
  resume: Resume;
  updateResume: (data: Partial<Resume>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const EditorTabs = ({ resume, updateResume, activeTab, setActiveTab }: EditorTabsProps) => {
  const handleProfileImageChange = (imageBase64: string | undefined) => {
    updateResume({ profileImage: imageBase64 });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="overflow-x-auto pb-1 -mx-6 px-6 md:px-0 md:mx-0">
        <TabsList className="mb-8 grid grid-cols-7 w-max md:w-full">
          <TabsTrigger value="basic-info" className="flex items-center gap-1.5 px-2 sm:px-3">
            <FileText className="h-4 w-4" />
            <span className="hidden xs:inline">Basic Info</span>
          </TabsTrigger>
          
          <TabsTrigger value="experience" className="flex items-center gap-1.5 px-2 sm:px-3">
            <Briefcase className="h-4 w-4" />
            <span className="hidden xs:inline">Experience</span>
          </TabsTrigger>
          
          <TabsTrigger value="education" className="flex items-center gap-1.5 px-2 sm:px-3">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden xs:inline">Education</span>
          </TabsTrigger>
          
          <TabsTrigger value="projects" className="flex items-center gap-1.5 px-2 sm:px-3">
            <FolderKanban className="h-4 w-4" />
            <span className="hidden xs:inline">Projects</span>
          </TabsTrigger>
          
          <TabsTrigger value="skills" className="flex items-center gap-1.5 px-2 sm:px-3">
            <Award className="h-4 w-4" />
            <span className="hidden xs:inline">Skills</span>
          </TabsTrigger>
          
          <TabsTrigger value="declaration" className="flex items-center gap-1.5 px-2 sm:px-3">
            <FileSignature className="h-4 w-4" />
            <span className="hidden xs:inline">Declaration</span>
          </TabsTrigger>
          
          <TabsTrigger value="final" className="flex items-center gap-1.5 px-2 sm:px-3">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden xs:inline">Review</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="pb-24">
        <TabsContent value="basic-info" className="mt-0">
          {/* Show profile image upload only for template-a */}
          {resume.templateId === 'template-a' && (
            <div className="mb-8 pb-8 border-b">
              <ProfileImageUpload 
                currentImage={resume.profileImage} 
                onImageChange={handleProfileImageChange} 
              />
            </div>
          )}
          <BasicInfo resume={resume} updateResume={updateResume} />
        </TabsContent>
        
        <TabsContent value="experience" className="mt-0">
          <Experience resume={resume} updateResume={updateResume} />
        </TabsContent>
        
        <TabsContent value="education" className="mt-0">
          <Education resume={resume} updateResume={updateResume} />
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          <Projects resume={resume} updateResume={updateResume} />
        </TabsContent>
        
        <TabsContent value="skills" className="mt-0">
          <Skills resume={resume} updateResume={updateResume} />
        </TabsContent>

        <TabsContent value="declaration" className="mt-0">
          <Declaration resume={resume} updateResume={updateResume} />
        </TabsContent>
        
        <TabsContent value="final" className="mt-0">
          <FinalReview resume={resume} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default EditorTabs;
