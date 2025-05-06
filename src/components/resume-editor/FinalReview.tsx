
import React from 'react';
import { Button } from '@/components/ui/button';
import { Resume } from '@/context/ResumeContext';
import { Download, Link2, CheckCircle, AlertCircle } from 'lucide-react';
import { usePdfExport } from '@/hooks/usePdfExport';
import { toast } from 'sonner';

type FinalReviewProps = {
  resume: Resume;
};

const FinalReview = ({ resume }: FinalReviewProps) => {
  const { exportToPdf, isExporting } = usePdfExport();
  
  const handleDownload = () => {
    exportToPdf('resume-preview', resume.name || 'resume');
  };

  const handleShareLink = () => {
    // In a real app, this would generate a shareable link
    // For now, just copy the current URL
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  // Check resume completeness
  const checkCompleteness = () => {
    const checks = [
      { name: 'Personal Information', passed: !!(resume.name && resume.title), required: true },
      { name: 'Contact Information', passed: !!(resume.email || resume.phone), required: true },
      { name: 'Professional Summary', passed: !!resume.summary, required: true },
      { name: 'Work Experience', passed: resume.experiences.length > 0, required: false },
      { name: 'Education', passed: resume.education.length > 0, required: false },
      { name: 'Skills', passed: resume.skills.length > 0, required: false },
    ];
    
    return checks;
  };

  const completenessChecks = checkCompleteness();
  const isComplete = completenessChecks.filter(check => check.required).every(check => check.passed);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Review Your Resume</h3>
        <p className="text-muted-foreground">
          Make sure all information is correct before downloading or sharing your resume.
        </p>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h4 className="font-medium mb-4">Resume Completeness</h4>
        <div className="space-y-3">
          {completenessChecks.map((check, index) => (
            <div key={index} className="flex items-center">
              {check.passed ? (
                <CheckCircle className="text-green-500 mr-2 shrink-0" size={18} />
              ) : (
                <AlertCircle className={`mr-2 shrink-0 ${check.required ? 'text-red-500' : 'text-amber-500'}`} size={18} />
              )}
              <div>
                <span className={check.passed ? '' : (check.required ? 'text-red-500' : 'text-amber-500')}>
                  {check.name}
                </span>
                {!check.passed && check.required && (
                  <span className="text-xs text-red-500 ml-2">(Required)</span>
                )}
                {!check.passed && !check.required && (
                  <span className="text-xs text-amber-500 ml-2">(Recommended)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Button 
          onClick={handleDownload}
          disabled={isExporting || !isComplete}
          className="flex-1 flex items-center gap-2"
          size="lg"
        >
          <Download size={16} />
          <span>{isExporting ? 'Downloading...' : 'Download PDF'}</span>
        </Button>
        
        <Button 
          onClick={handleShareLink}
          disabled={!isComplete}
          variant="outline"
          className="flex-1 flex items-center gap-2"
          size="lg"
        >
          <Link2 size={16} />
          <span>Copy Shareable Link</span>
        </Button>
      </div>

      {!isComplete && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 text-sm">
          Please complete all required sections before downloading or sharing your resume.
        </div>
      )}
    </div>
  );
};

export default FinalReview;
