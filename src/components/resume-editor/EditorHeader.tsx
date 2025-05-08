
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
    <header className="py-3 px-4 md:px-6 lg:px-12 flex flex-wrap md:flex-nowrap gap-2 justify-between items-center border-b bg-white">
      <div className="flex items-center space-x-2">
        <Link to="/dashboard" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          <span className="hidden xs:inline">Back</span>
          <span className="hidden sm:inline"> to Dashboard</span>
        </Link>
      </div>
      
      <h1 className="font-mono text-base md:text-lg lg:text-xl font-bold truncate max-w-[150px] sm:max-w-xs">
        {resumeName}
      </h1>
      
      <div className="flex gap-2 ml-auto">
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1 px-2 sm:px-4">
              <FileText size={16} />
              <span className="hidden xs:inline">Template</span>
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
          <Button variant="outline" size="sm" onClick={togglePreview} className="flex items-center gap-1 px-2 sm:px-4">
            <Eye size={16} />
            <span className="hidden xs:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
          </Button>
        )}
        
        <Button onClick={handleSaveChanges} disabled={!isDirty} size="sm" className="flex items-center gap-1 px-2 sm:px-4">
          <Save size={16} />
          <span className="hidden xs:inline">Save</span>
        </Button>
      </div>
    </header>
  );
};

export default EditorHeader;
