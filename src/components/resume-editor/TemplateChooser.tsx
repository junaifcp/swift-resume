import React from "react";
import { Check } from "lucide-react";
import { Template } from "@/context/ResumeContext";

// --- Step 1: Create individual preview components for clarity ---

const TemplateAPreview = () => (
  <div className="flex items-center space-x-4 p-3 bg-blue-500 text-white rounded">
    <div className="w-16 h-16 bg-white/30 rounded-full flex-shrink-0"></div>
    <div>
      <div className="h-4 w-32 bg-white/30 rounded mb-2"></div>
      <div className="h-3 w-24 bg-white/20 rounded"></div>
    </div>
  </div>
);

const TemplateBPreview = () => (
  <div className="p-3 bg-blue-500 text-white rounded">
    <div className="h-4 bg-white/30 rounded mb-2"></div>
    <div className="h-3 bg-white/20 rounded w-5/6"></div>
  </div>
);

const TemplateCPreview = () => (
  <div className="p-3 bg-blue-500 text-white rounded">
    <div className="h-4 bg-white/30 rounded mb-2"></div>
    <div className="h-3 bg-white/20 rounded w-5/6"></div>
  </div>
);

const TemplateDPreview = () => (
  <div className="p-2 border-b border-gray-200">
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
  </div>
);

// --- Step 2: Create a data structure for our templates ---

const templates = [
  {
    id: "template-a" as Template,
    name: "Template A",
    description: "With Profile Image",
    preview: <TemplateAPreview />,
    sections: (
      <>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
        <div className="h-2 bg-gray-200 rounded w-4/6"></div>
      </>
    ),
  },
  {
    id: "template-b" as Template,
    name: "Template B",
    description: "Text-Only Header",
    preview: <TemplateBPreview />,
    sections: (
      <>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
        <div className="h-2 bg-gray-200 rounded w-4/6"></div>
      </>
    ),
  },
  {
    id: "template-c" as Template,
    name: "Template C",
    description: "ATS-Friendly",
    preview: <TemplateCPreview />,
    sections: (
      <>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </>
    ),
  },
  {
    id: "template-d" as Template,
    name: "Template D",
    description: "Plain, No Sidebar",
    preview: <TemplateDPreview />,
    sections: (
      <>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
        <div className="h-2 bg-gray-200 rounded w-4/6"></div>
      </>
    ),
  },
];

// --- Step 3: Create a reusable TemplateCard component ---

type TemplateCardProps = {
  template: (typeof templates)[0];
  isSelected: boolean;
  onSelect: (templateId: Template) => void;
};

const TemplateCard = ({
  template,
  isSelected,
  onSelect,
}: TemplateCardProps) => {
  const { id, name, description, preview, sections } = template;

  const borderClasses = isSelected
    ? "border-primary ring-2 ring-primary/20"
    : "border-gray-200 dark:border-gray-700";

  return (
    <div
      className={`relative border-2 rounded-md overflow-hidden cursor-pointer hover:border-primary transition-all ${borderClasses}`}
      onClick={() => onSelect(id)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(id)}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 z-10">
          <Check size={16} />
        </div>
      )}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 aspect-[3/4]">
        <div className="bg-white dark:bg-gray-900 h-full rounded shadow-sm p-3">
          {preview}
          <div className="mt-3 space-y-2">{sections}</div>
        </div>
      </div>
      <div className="p-3 text-center">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

// --- Step 4: Refactor the main TemplateChooser component ---

type TemplateChooserProps = {
  selectedTemplate: Template;
  onSelectTemplate: (template: Template) => void;
};

const TemplateChooser = ({
  selectedTemplate,
  onSelectTemplate,
}: TemplateChooserProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Choose a Template</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select a template for your resume. You can change it at any time.
        </p>
      </div>

      {/* This grid is now much more responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateChooser;
