
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ChevronLeft } from 'lucide-react';

type MobilePreviewToggleProps = {
  showPreview: boolean;
  togglePreview: () => void;
};

const MobilePreviewToggle = ({ showPreview, togglePreview }: MobilePreviewToggleProps) => {
  return (
    <>
      {/* Mobile Preview Toggle Button */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-20">
        <Button 
          onClick={togglePreview} 
          className="shadow-lg flex items-center gap-2"
          variant={showPreview ? "secondary" : "default"}
        >
          <Eye size={16} />
          <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
        </Button>
      </div>
      
      {/* Mobile Preview Panel Toggle */}
      {showPreview && (
        <Button
          variant="outline"
          className="absolute top-2 right-2 z-20 rounded-full h-8 w-8 p-0"
          onClick={togglePreview}
        >
          <ChevronLeft size={16} className="rotate-90" />
        </Button>
      )}
    </>
  );
};

export default MobilePreviewToggle;
