
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResume } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Edit } from 'lucide-react';
import ResumePreview from '@/components/resume-editor/ResumePreview';
import { usePdfExport } from '@/hooks/usePdfExport';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

const PreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getResumeById } = useResume();
  const resumeWithTemplate = getResumeById(id || '');
  const [resume, setResume] = useState(resumeWithTemplate ? {
    ...resumeWithTemplate,
    templateId: resumeWithTemplate.templateId || 'template-b'
  } : undefined);
  const { exportToPdf, isExporting } = usePdfExport();

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    const resumeData = getResumeById(id);
    if (!resumeData) {
      toast.error("Resume not found");
      navigate('/dashboard');
      return;
    }

    // Ensure templateId exists
    setResume({
      ...resumeData,
      templateId: resumeData.templateId || 'template-b'
    });
  }, [id, getResumeById, navigate]);

  const handleDownload = () => {
    if (resume) {
      exportToPdf('resume-preview', resume.name || 'resume');
    }
  };

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getTemplateLabel = () => {
    switch (resume.templateId) {
      case 'template-a':
        return 'Template A';
      case 'template-b':
        return 'Template B';
      case 'template-c':
        return 'Template C (ATS-Friendly)';
      case 'template-d':
        return 'Template D (Plain)';
      default:
        return 'Template B';
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Page Header */}
      <header className="py-3 px-4 md:px-6 lg:px-12 flex flex-wrap md:flex-nowrap gap-2 justify-between items-center border-b bg-white">
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            <span className="hidden xs:inline">Back</span>
            <span className="hidden sm:inline"> to Dashboard</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <h1 className="font-mono text-base md:text-lg lg:text-xl font-bold truncate max-w-[120px] sm:max-w-xs">
            {resume.name}
          </h1>
          <span className="text-xs text-muted-foreground hidden md:inline-block">
            {getTemplateLabel()}
          </span>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" asChild className="flex items-center gap-1 px-2 sm:px-4">
            <Link to={`/editor/${resume.id}`}>
              <Edit size={16} />
              <span className="hidden xs:inline">Edit</span>
            </Link>
          </Button>
          
          <Button 
            onClick={handleDownload} 
            disabled={isExporting} 
            size="sm" 
            className="flex items-center gap-1 px-2 sm:px-4"
          >
            <Download size={16} />
            <span className="hidden xs:inline">{isExporting ? 'Downloading...' : 'Download'}</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12 w-full overflow-x-hidden">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
};

export default PreviewPage;
