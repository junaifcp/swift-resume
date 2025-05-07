
import React from 'react';
import { Check } from 'lucide-react';
import { Template } from '@/context/ResumeContext';

type TemplateChooserProps = {
  selectedTemplate: Template;
  onSelectTemplate: (template: Template) => void;
};

const TemplateChooser = ({ selectedTemplate, onSelectTemplate }: TemplateChooserProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose a Template</h3>
      <p className="text-muted-foreground mb-4">
        Select a template for your resume. You can change it at any time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className={`relative border-2 rounded-md overflow-hidden cursor-pointer hover:border-primary transition-all ${
            selectedTemplate === 'template-a' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
          }`}
          onClick={() => onSelectTemplate('template-a')}
        >
          {selectedTemplate === 'template-a' && (
            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
              <Check size={16} />
            </div>
          )}
          <div className="p-4 bg-gray-50 aspect-[3/4]">
            <div className="bg-white h-full rounded shadow-sm p-3">
              {/* Template A Preview */}
              <div className="flex items-center space-x-4 p-3 bg-blue-500 text-white rounded">
                <div className="w-16 h-16 bg-white/30 rounded-full flex-shrink-0"></div>
                <div>
                  <div className="h-4 w-32 bg-white/30 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-white/20 rounded"></div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                <div className="h-2 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
          <div className="p-3 text-center font-medium">
            Template A (With Profile Image)
          </div>
        </div>

        <div 
          className={`relative border-2 rounded-md overflow-hidden cursor-pointer hover:border-primary transition-all ${
            selectedTemplate === 'template-b' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
          }`}
          onClick={() => onSelectTemplate('template-b')}
        >
          {selectedTemplate === 'template-b' && (
            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
              <Check size={16} />
            </div>
          )}
          <div className="p-4 bg-gray-50 aspect-[3/4]">
            <div className="bg-white h-full rounded shadow-sm p-3">
              {/* Template B Preview */}
              <div className="p-3 bg-blue-500 text-white rounded">
                <div className="h-4 bg-white/30 rounded mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-5/6"></div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                <div className="h-2 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
          <div className="p-3 text-center font-medium">
            Template B (Text-Only Header)
          </div>
        </div>

        <div 
          className={`relative border-2 rounded-md overflow-hidden cursor-pointer hover:border-primary transition-all ${
            selectedTemplate === 'template-c' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
          }`}
          onClick={() => onSelectTemplate('template-c')}
        >
          {selectedTemplate === 'template-c' && (
            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
              <Check size={16} />
            </div>
          )}
          <div className="p-4 bg-gray-50 aspect-[3/4]">
            <div className="bg-white h-full rounded shadow-sm p-3">
              {/* Template C Preview */}
              <div className="p-3 bg-blue-500 text-white rounded">
                <div className="h-4 bg-white/30 rounded mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-5/6"></div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
          <div className="p-3 text-center font-medium">
            Template C (ATS-Friendly)
          </div>
        </div>

        <div 
          className={`relative border-2 rounded-md overflow-hidden cursor-pointer hover:border-primary transition-all ${
            selectedTemplate === 'template-d' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
          }`}
          onClick={() => onSelectTemplate('template-d')}
        >
          {selectedTemplate === 'template-d' && (
            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
              <Check size={16} />
            </div>
          )}
          <div className="p-4 bg-gray-50 aspect-[3/4]">
            <div className="bg-white h-full rounded shadow-sm p-3">
              {/* Template D Preview */}
              <div className="p-2 border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                <div className="h-2 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
          <div className="p-3 text-center font-medium">
            Template D (Plain, No Sidebar & No Image)
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateChooser;
