
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResumeEditor } from '@/hooks/useResumeEditor';
import EditorHeader from '@/components/resume-editor/EditorHeader';
import EditorTabs from '@/components/resume-editor/EditorTabs';
import PreviewPanel from '@/components/resume-editor/PreviewPanel';
import MobilePreviewToggle from '@/components/resume-editor/MobilePreviewToggle';
import Navigation from '@/components/Navigation';

const ResumeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const {
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
  } = useResumeEditor(id, navigate);

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Editor Header */}
      <EditorHeader 
        resumeName={resumeData.name}
        isDirty={isDirty}
        showPreview={showPreview}
        togglePreview={togglePreview}
        handleSaveChanges={handleSaveChanges}
        templateDialogOpen={templateDialogOpen}
        setTemplateDialogOpen={setTemplateDialogOpen}
        selectedTemplate={resumeData.templateId || 'template-b'}
        handleTemplateChange={handleTemplateChange}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className={`flex flex-grow h-[calc(100vh-120px)] overflow-hidden ${!showPreview && !isMobile ? 'justify-center' : ''}`}>
        {/* Editor Panel */}
        <div className={`${showPreview && !isMobile ? 'w-full md:w-1/2' : 'w-full'} overflow-auto p-4 md:p-6 lg:p-12`}>
          <EditorTabs 
            resume={resumeData}
            updateResume={updateResume}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Preview Panel */}
        <PreviewPanel 
          resume={resumeData}
          showPreview={showPreview}
          togglePreview={togglePreview}
          isMobile={isMobile}
          updateResume={updateResume}
        />
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobilePreviewToggle showPreview={showPreview} togglePreview={togglePreview} />}
    </div>
  );
};

export default ResumeEditor;
