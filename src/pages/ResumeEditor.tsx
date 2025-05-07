
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResumeEditor } from '@/hooks/useResumeEditor';
import EditorHeader from '@/components/resume-editor/EditorHeader';
import EditorTabs from '@/components/resume-editor/EditorTabs';
import PreviewPanel from '@/components/resume-editor/PreviewPanel';
import MobilePreviewToggle from '@/components/resume-editor/MobilePreviewToggle';

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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
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
      <div className={`flex h-[calc(100vh-73px)] overflow-hidden ${!showPreview && !isMobile ? 'justify-center' : ''}`}>
        {/* Editor Panel */}
        <div className={`${showPreview && !isMobile ? 'w-1/2' : 'w-full'} overflow-auto p-6 md:p-12`}>
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
        />
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobilePreviewToggle showPreview={showPreview} togglePreview={togglePreview} />}
    </div>
  );
};

export default ResumeEditor;
