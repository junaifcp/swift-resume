
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfo from './BasicInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import FinalReview from './FinalReview';
import ProfileImageUpload from './ProfileImageUpload';
import { Resume } from '@/context/ResumeContext';

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
        
        <TabsContent value="skills" className="mt-0">
          <Skills resume={resume} updateResume={updateResume} />
        </TabsContent>
        
        <TabsContent value="final" className="mt-0">
          <FinalReview resume={resume} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default EditorTabs;
