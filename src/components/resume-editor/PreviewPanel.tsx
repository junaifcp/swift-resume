
import React from 'react';
import { Resume } from '@/context/ResumeContext';
import ResumePreview from './ResumePreview';
import MobilePreviewToggle from './MobilePreviewToggle';

type PreviewPanelProps = {
  resume: Resume;
  showPreview: boolean;
  togglePreview: () => void;
  isMobile: boolean;
};

const PreviewPanel = ({ resume, showPreview, togglePreview, isMobile }: PreviewPanelProps) => {
  if (!showPreview && !isMobile) {
    return null;
  }
  
  return (
    <div 
      className={`${
        isMobile ? 'fixed inset-x-0 bottom-0 top-auto p-4 h-auto z-10' : 'w-1/2 border-l p-6'
      }`}
    >
      {isMobile ? (
        <div className="relative">
          <MobilePreviewToggle showPreview={showPreview} togglePreview={togglePreview} />
          
          {showPreview && (
            <div className="pt-4 h-[40vh] overflow-auto bg-white rounded-t-xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
              <div className="px-4">
                <ResumePreview resume={resume} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full overflow-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">Preview</h2>
            <span className="text-sm text-muted-foreground">
              {resume.templateId === 'template-a' 
                ? 'Template A' 
                : resume.templateId === 'template-b' 
                ? 'Template B'
                : resume.templateId === 'template-c' 
                ? 'Template C (ATS-Friendly)'
                : 'Template D (Plain)'}
            </span>
          </div>
          <div className="animate-fade-in">
            <ResumePreview resume={resume} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
