
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, MoveUp, MoveDown, Edit } from 'lucide-react';
import { EducationItem, Resume } from '@/context/ResumeContext';

type EducationProps = {
  resume: Resume;
  updateResume: (data: Partial<Resume>) => void;
};

const Education = ({ resume, updateResume }: EducationProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EducationItem | null>(null);

  const createEducation = () => {
    const newEducation: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    
    updateResume({
      education: [...resume.education, newEducation]
    });
    
    setEditingId(newEducation.id);
    setEditForm(newEducation);
  };

  const editEducation = (id: string) => {
    const education = resume.education.find(edu => edu.id === id);
    if (education) {
      setEditingId(id);
      setEditForm({ ...education });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEducation = () => {
    if (!editForm) return;
    
    const updatedEducation = resume.education.map(edu => 
      edu.id === editForm.id ? editForm : edu
    );
    
    updateResume({ education: updatedEducation });
    setEditingId(null);
    setEditForm(null);
  };

  const deleteEducation = (id: string) => {
    const updatedEducation = resume.education.filter(edu => edu.id !== id);
    updateResume({ education: updatedEducation });
    
    if (editingId === id) {
      setEditingId(null);
      setEditForm(null);
    }
  };

  const moveEducation = (id: string, direction: 'up' | 'down') => {
    const currentIndex = resume.education.findIndex(edu => edu.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= resume.education.length) return;
    
    const updatedEducation = [...resume.education];
    const [movedItem] = updatedEducation.splice(currentIndex, 1);
    updatedEducation.splice(newIndex, 0, movedItem);
    
    updateResume({ education: updatedEducation });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editForm) return;
    
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Education</h3>
        <Button onClick={createEducation} className="flex items-center gap-2" variant="outline">
          <Plus size={16} />
          <span>Add Education</span>
        </Button>
      </div>

      {resume.education.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No education items yet. Add your educational background to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resume.education.map((education) => (
            <Card key={education.id} className="p-4">
              {editingId === education.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        name="institution"
                        value={editForm?.institution || ''}
                        onChange={handleInputChange}
                        placeholder="University name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        name="degree"
                        value={editForm?.degree || ''}
                        onChange={handleInputChange}
                        placeholder="Bachelor's, Master's, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="field">Field of Study</Label>
                      <Input
                        id="field"
                        name="field"
                        value={editForm?.field || ''}
                        onChange={handleInputChange}
                        placeholder="Computer Science, Business, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          value={editForm?.startDate || ''}
                          onChange={handleInputChange}
                          placeholder="2018"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          value={editForm?.endDate || ''}
                          onChange={handleInputChange}
                          placeholder="2022"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={editForm?.description || ''}
                      onChange={handleInputChange}
                      placeholder="Notable achievements, GPA, honors, etc."
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                    <Button onClick={saveEducation}>Save</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between mb-1">
                    <div>
                      <h4 className="font-medium text-lg">{education.institution || 'Institution'}</h4>
                      <p>
                        {education.degree}{education.degree && education.field ? ', ' : ''}{education.field}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {education.startDate || 'Start Date'} - {education.endDate || 'End Date'}
                    </div>
                  </div>
                  
                  {education.description && (
                    <p className="text-sm mt-2">{education.description}</p>
                  )}
                  
                  <div className="flex justify-end gap-1 pt-3">
                    <Button variant="ghost" size="sm" 
                      onClick={() => moveEducation(education.id, 'up')} 
                      disabled={resume.education.indexOf(education) === 0}
                    >
                      <MoveUp size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" 
                      onClick={() => moveEducation(education.id, 'down')}
                      disabled={resume.education.indexOf(education) === resume.education.length - 1}
                    >
                      <MoveDown size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => editEducation(education.id)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteEducation(education.id)}>
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

export default Education;
