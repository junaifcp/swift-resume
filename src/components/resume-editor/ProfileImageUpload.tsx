
import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

type ProfileImageUploadProps = {
  currentImage?: string;
  onImageChange: (imageBase64: string | undefined) => void;
};

const ProfileImageUpload = ({ currentImage, onImageChange }: ProfileImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.size > 1024 * 1024 * 2) { // 2MB limit
      toast.error('Image must be smaller than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      onImageChange(base64String);
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    onImageChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Profile Photo</h3>
        {previewUrl && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive" 
            onClick={handleRemoveImage}
          >
            <X size={16} className="mr-1" /> Remove
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <Avatar className="w-24 h-24">
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt="Profile" />
            ) : (
              <AvatarFallback className="text-4xl bg-muted">
                {/* User initial or icon */}
                👤
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div className="space-y-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={triggerFileInput}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            <span>{previewUrl ? 'Change Photo' : 'Upload Photo'}</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/gif"
            className="hidden"
            onChange={handleImageChange}
          />
          <p className="text-xs text-muted-foreground">
            Recommended: Square JPG or PNG, max 2MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
