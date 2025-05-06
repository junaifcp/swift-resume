
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { Resume, SkillItem } from '@/context/ResumeContext';

type SkillsProps = {
  resume: Resume;
  updateResume: (data: Partial<Resume>) => void;
};

const Skills = ({ resume, updateResume }: SkillsProps) => {
  const [skillName, setSkillName] = useState('');
  const [skillProficiency, setSkillProficiency] = useState(70);
  
  const addSkill = () => {
    if (!skillName.trim()) return;
    
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: skillName.trim(),
      proficiency: skillProficiency,
    };
    
    updateResume({
      skills: [...resume.skills, newSkill]
    });
    
    // Reset form
    setSkillName('');
    setSkillProficiency(70);
  };

  const removeSkill = (id: string) => {
    const updatedSkills = resume.skills.filter(skill => skill.id !== id);
    updateResume({ skills: updatedSkills });
  };

  const moveSkill = (id: string, direction: 'up' | 'down') => {
    const currentIndex = resume.skills.findIndex(skill => skill.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= resume.skills.length) return;
    
    const updatedSkills = [...resume.skills];
    const [movedItem] = updatedSkills.splice(currentIndex, 1);
    updatedSkills.splice(newIndex, 0, movedItem);
    
    updateResume({ skills: updatedSkills });
  };

  const updateSkillProficiency = (id: string, proficiency: number) => {
    const updatedSkills = resume.skills.map(skill => 
      skill.id === id ? { ...skill, proficiency } : skill
    );
    updateResume({ skills: updatedSkills });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Skills</h3>
        <Card className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="JavaScript, Project Management, etc."
                  className="mb-2"
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="skillProficiency">Proficiency: {skillProficiency}%</Label>
                </div>
                <div className="py-3">
                  <Slider
                    id="skillProficiency"
                    min={10}
                    max={100}
                    step={10}
                    value={[skillProficiency]}
                    onValueChange={(value) => setSkillProficiency(value[0])}
                  />
                </div>
              </div>
            </div>
            <Button onClick={addSkill} className="flex items-center gap-2 w-full" variant="outline">
              <Plus size={16} />
              <span>Add Skill</span>
            </Button>
          </div>
        </Card>
      </div>

      {resume.skills.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No skills added yet. Add skills above to showcase your expertise.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="text-base font-medium">Your Skills</h4>
          {resume.skills.map((skill, index) => (
            <Card key={skill.id} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{skill.name}</div>
                <div className="text-sm text-muted-foreground">{skill.proficiency}%</div>
              </div>
              
              <div className="relative pt-1 mb-4">
                <div className="w-full bg-muted rounded h-2">
                  <div 
                    className="bg-primary h-2 rounded" 
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-end gap-1">
                <Slider
                  min={10}
                  max={100}
                  step={10}
                  value={[skill.proficiency]}
                  onValueChange={(value) => updateSkillProficiency(skill.id, value[0])}
                  className="w-32 mr-4"
                />
                <Button variant="ghost" size="sm" 
                  onClick={() => moveSkill(skill.id, 'up')} 
                  disabled={index === 0}
                >
                  <MoveUp size={16} />
                </Button>
                <Button variant="ghost" size="sm" 
                  onClick={() => moveSkill(skill.id, 'down')}
                  disabled={index === resume.skills.length - 1}
                >
                  <MoveDown size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeSkill(skill.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
