
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Resume } from '@/context/ResumeContext';
import { useAi } from '@/hooks/useAi';

type BasicInfoProps = {
  resume: Resume;
  updateResume: (data: Partial<Resume>) => void;
};

const themeColors = [
  { name: 'Blue', value: '#0EA5E9' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Gray', value: '#6B7280' },
];

const BasicInfo = ({ resume, updateResume }: BasicInfoProps) => {
  const { generateContent, isLoading, error } = useAi();
  const [experienceLevel, setExperienceLevel] = React.useState<'Entry-Level' | 'Mid-Level' | 'Senior-Level'>('Mid-Level');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateResume({ [name]: value });
  };

  const handleGenerateSummary = async () => {
    if (!resume.title) {
      alert('Please enter a job title first');
      return;
    }

    const summary = await generateContent('summary', resume.title, experienceLevel);
    updateResume({ summary });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={resume.name}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            name="title"
            value={resume.title}
            onChange={handleInputChange}
            placeholder="Software Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={resume.email}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={resume.phone}
            onChange={handleInputChange}
            placeholder="(123) 456-7890"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={resume.location}
            onChange={handleInputChange}
            placeholder="New York, NY"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={resume.website}
            onChange={handleInputChange}
            placeholder="https://portfolio.com"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <div className="flex items-center space-x-3">
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="Entry-Level">Entry-Level</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior-Level">Senior-Level</option>
            </select>
            <Button 
              size="sm" 
              onClick={handleGenerateSummary} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>
        </div>
        {error && <p className="text-sm text-destructive mb-2">{error}</p>}
        <Textarea
          id="summary"
          name="summary"
          value={resume.summary}
          onChange={handleInputChange}
          placeholder="Write a short summary about yourself and your professional experience..."
          rows={4}
        />
      </div>

      <div>
        <Label>Theme Color</Label>
        <div className="flex flex-wrap gap-3 mt-2">
          {themeColors.map((color) => (
            <button
              key={color.value}
              type="button"
              className={`w-8 h-8 rounded-full ${
                resume.themeColor === color.value
                  ? 'ring-2 ring-offset-2 ring-primary'
                  : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => updateResume({ themeColor: color.value })}
              aria-label={`Select ${color.name} theme`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
