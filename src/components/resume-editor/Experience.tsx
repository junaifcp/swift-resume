
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Edit,
  Save,
  X
} from 'lucide-react';
import { ExperienceItem, Resume } from '@/context/ResumeContext';
import { useAi } from '@/hooks/useAi';

type ExperienceProps = {
  resume: Resume;
  updateResume: (data: Partial<Resume>) => void;
};

const Experience = ({ resume, updateResume }: ExperienceProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ExperienceItem | null>(null);
  const { generateContent, isLoading } = useAi();

  const createExperience = () => {
    const newExperience: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      bulletPoints: []
    };
    
    updateResume({
      experiences: [...resume.experiences, newExperience]
    });
    
    setEditingId(newExperience.id);
    setEditForm(newExperience);
  };

  const editExperience = (id: string) => {
    const experience = resume.experiences.find(exp => exp.id === id);
    if (experience) {
      setEditingId(id);
      setEditForm({ ...experience });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveExperience = () => {
    if (!editForm) return;
    
    const updatedExperiences = resume.experiences.map(exp => 
      exp.id === editForm.id ? editForm : exp
    );
    
    updateResume({ experiences: updatedExperiences });
    setEditingId(null);
    setEditForm(null);
  };

  const deleteExperience = (id: string) => {
    const updatedExperiences = resume.experiences.filter(exp => exp.id !== id);
    updateResume({ experiences: updatedExperiences });
    
    if (editingId === id) {
      setEditingId(null);
      setEditForm(null);
    }
  };

  const moveExperience = (id: string, direction: 'up' | 'down') => {
    const currentIndex = resume.experiences.findIndex(exp => exp.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= resume.experiences.length) return;
    
    const updatedExperiences = [...resume.experiences];
    const [movedItem] = updatedExperiences.splice(currentIndex, 1);
    updatedExperiences.splice(newIndex, 0, movedItem);
    
    updateResume({ experiences: updatedExperiences });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editForm) return;
    
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const generateBulletPoints = async () => {
    if (!editForm || !editForm.description) return;
    
    const bulletPointsText = await generateContent('bullet-points', editForm.description);
    if (bulletPointsText) {
      const newBulletPoints = bulletPointsText
        .split('\n')
        .filter(point => point.trim() !== '');
      
      setEditForm({ ...editForm, bulletPoints: newBulletPoints });
    }
  };

  const updateBulletPoint = (index: number, value: string) => {
    if (!editForm) return;
    
    const updatedBulletPoints = [...editForm.bulletPoints];
    updatedBulletPoints[index] = value;
    
    setEditForm({ ...editForm, bulletPoints: updatedBulletPoints });
  };

  const addBulletPoint = () => {
    if (!editForm) return;
    
    setEditForm({
      ...editForm,
      bulletPoints: [...editForm.bulletPoints, '']
    });
  };

  const removeBulletPoint = (index: number) => {
    if (!editForm) return;
    
    const updatedBulletPoints = [...editForm.bulletPoints];
    updatedBulletPoints.splice(index, 1);
    
    setEditForm({ ...editForm, bulletPoints: updatedBulletPoints });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Work Experience</h3>
        <Button onClick={createExperience} className="flex items-center gap-2" variant="outline">
          <Plus size={16} />
          <span>Add Experience</span>
        </Button>
      </div>

      {resume.experiences.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No experience items yet. Add your work history to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resume.experiences.map((experience) => (
            <Card key={experience.id} className="p-4">
              {editingId === experience.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        value={editForm?.position || ''}
                        onChange={handleInputChange}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={editForm?.company || ''}
                        onChange={handleInputChange}
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        value={editForm?.startDate || ''}
                        onChange={handleInputChange}
                        placeholder="Jan 2020"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        value={editForm?.endDate || ''}
                        onChange={handleInputChange}
                        placeholder="Present"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={editForm?.description || ''}
                      onChange={handleInputChange}
                      placeholder="Briefly describe your role and responsibilities..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Key Achievements</Label>
                      <Button 
                        size="sm" 
                        onClick={generateBulletPoints} 
                        disabled={isLoading || !editForm?.description}
                        variant="outline"
                      >
                        {isLoading ? 'Generating...' : 'Generate with AI'}
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {editForm?.bulletPoints.map((point, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <Input
                            value={point}
                            onChange={(e) => updateBulletPoint(index, e.target.value)}
                            placeholder="Achievement or responsibility..."
                            className="flex-grow"
                          />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => removeBulletPoint(index)}
                            className="px-2"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={addBulletPoint} 
                      className="mt-2 w-full flex justify-center items-center gap-1"
                    >
                      <Plus size={14} />
                      <span>Add Bullet Point</span>
                    </Button>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                    <Button onClick={saveExperience}>Save</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-lg">{experience.position || 'Position'}</h4>
                      <p className="text-muted-foreground">{experience.company || 'Company'}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {experience.startDate || 'Start Date'} - {experience.endDate || 'End Date'}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{experience.description}</p>
                  
                  {experience.bulletPoints.length > 0 && (
                    <ul className="list-disc list-inside text-sm space-y-1 mb-3">
                      {experience.bulletPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="flex justify-end gap-1 pt-2">
                    <Button variant="ghost" size="sm" 
                      onClick={() => moveExperience(experience.id, 'up')} 
                      disabled={resume.experiences.indexOf(experience) === 0}
                    >
                      <MoveUp size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" 
                      onClick={() => moveExperience(experience.id, 'down')}
                      disabled={resume.experiences.indexOf(experience) === resume.experiences.length - 1}
                    >
                      <MoveDown size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => editExperience(experience.id)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteExperience(experience.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
