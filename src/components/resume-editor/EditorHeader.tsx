
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Eye, FileText } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import TemplateChooser from './TemplateChooser';
import { Template } from '@/context/ResumeContext';
import { toast } from 'sonner';

type EditorHeaderProps = {
  resumeName: string;
  isDirty: boolean;
  showPreview: boolean;
  togglePreview: () => void;
  handleSaveChanges: () => void;
  templateDialogOpen: boolean;
  setTemplateDialogOpen: (open: boolean) => void;
  selectedTemplate: Template;
  handleTemplateChange: (template: Template) => void;
  isMobile: boolean;
};

const EditorHeader = ({
  resumeName,
  isDirty,
  showPreview,
  togglePreview,
  handleSaveChanges,
  templateDialogOpen,
  setTemplateDialogOpen,
  selectedTemplate,
  handleTemplateChange,
  isMobile
}: EditorHeaderProps) => {
  return (
    <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b bg-white">
      <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="font-mono text-lg md:text-xl font-bold hidden sm:block">
          {resumeName}
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
              selectedTemplate={selectedTemplate} 
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
  );
};

export default EditorHeader;
