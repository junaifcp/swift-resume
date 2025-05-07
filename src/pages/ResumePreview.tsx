
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResume } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Edit } from 'lucide-react';
import ResumePreview from '@/components/resume-editor/ResumePreview';
import { usePdfExport } from '@/hooks/usePdfExport';
import { toast } from 'sonner';

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
    return <div>Loading...</div>;
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b bg-white">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-mono text-lg md:text-xl font-bold">
            {resume.name}
          </h1>
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            {getTemplateLabel()}
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to={`/editor/${resume.id}`}>
              <Edit size={16} />
              <span>Edit</span>
            </Link>
          </Button>
          
          <Button onClick={handleDownload} disabled={isExporting} className="flex items-center gap-2">
            <Download size={16} />
            <span>{isExporting ? 'Downloading...' : 'Download PDF'}</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-6 md:px-12">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
};

export default PreviewPage;
