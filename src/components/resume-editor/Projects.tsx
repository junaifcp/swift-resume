
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { ProjectItem, Resume } from "@/context/ResumeContext";
import { v4 as uuidv4 } from 'uuid';

type ProjectsProps = {
  resume: Resume;
  updateResume: (data: Partial<Resume>) => void;
};

const Projects = ({ resume, updateResume }: ProjectsProps) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectItem>({
    id: "",
    name: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    bulletPoints: [],
    url: ""
  });
  const [newBulletPoint, setNewBulletPoint] = useState("");

  const resetForm = () => {
    setProjectData({
      id: "",
      name: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
      bulletPoints: [],
      url: ""
    });
    setNewBulletPoint("");
  };

  const handleAddProject = () => {
    setIsAddingProject(true);
    setEditingProjectId(null);
    resetForm();
  };

  const handleEditProject = (project: ProjectItem) => {
    setProjectData({ ...project });
    setEditingProjectId(project.id);
    setIsAddingProject(false);
  };

  const handleDeleteProject = (id: string) => {
    updateResume({
      projects: resume.projects.filter(project => project.id !== id)
    });
  };

  const handleCancel = () => {
    setIsAddingProject(false);
    setEditingProjectId(null);
    resetForm();
  };

  const handleSaveProject = () => {
    if (!projectData.name) return;

    let updatedProjects = [...resume.projects];

    if (editingProjectId) {
      updatedProjects = updatedProjects.map(project =>
        project.id === editingProjectId ? { ...projectData } : project
      );
    } else {
      updatedProjects.push({ ...projectData, id: uuidv4() });
    }

    updateResume({ projects: updatedProjects });
    setIsAddingProject(false);
    setEditingProjectId(null);
    resetForm();
  };

  const handleAddBulletPoint = () => {
    if (!newBulletPoint.trim()) return;

    setProjectData({
      ...projectData,
      bulletPoints: [...projectData.bulletPoints, newBulletPoint.trim()]
    });
    setNewBulletPoint("");
  };

  const handleRemoveBulletPoint = (index: number) => {
    setProjectData({
      ...projectData,
      bulletPoints: projectData.bulletPoints.filter((_, i) => i !== index)
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Projects</h2>
        <Button onClick={handleAddProject} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Project input form */}
      {(isAddingProject || editingProjectId) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{editingProjectId ? "Edit Project" : "Add Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="My Awesome Project"
                  value={projectData.name}
                  onChange={e => setProjectData({ ...projectData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="project-role">Your Role</Label>
                <Input
                  id="project-role"
                  placeholder="Lead Developer"
                  value={projectData.role}
                  onChange={e => setProjectData({ ...projectData, role: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="project-start">Start Date</Label>
                  <Input
                    id="project-start"
                    placeholder="MM/YYYY"
                    value={projectData.startDate}
                    onChange={e => setProjectData({ ...projectData, startDate: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="project-end">End Date</Label>
                  <Input
                    id="project-end"
                    placeholder="MM/YYYY or Present"
                    value={projectData.endDate}
                    onChange={e => setProjectData({ ...projectData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="project-url">Project URL (Optional)</Label>
                <Input
                  id="project-url"
                  placeholder="https://example.com"
                  value={projectData.url || ""}
                  onChange={e => setProjectData({ ...projectData, url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="A brief description of the project..."
                  value={projectData.description}
                  onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Key Achievements / Responsibilities</Label>
                <div className="flex mb-2">
                  <Input
                    placeholder="Add a bullet point about your achievements..."
                    value={newBulletPoint}
                    onChange={e => setNewBulletPoint(e.target.value)}
                    className="mr-2"
                  />
                  <Button onClick={handleAddBulletPoint} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <ul className="space-y-2">
                  {projectData.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-center bg-gray-50 p-2 rounded">
                      <div className="flex-1">{point}</div>
                      <Button
                        onClick={() => handleRemoveBulletPoint(index)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSaveProject}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List of projects */}
      <div className="space-y-4">
        {resume.projects && resume.projects.length > 0 ? (
          resume.projects.map(project => (
            <Card key={project.id} className="relative group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-md">{project.name}</CardTitle>
                    <div className="text-sm text-gray-500">
                      {project.role && <span className="mr-3">{project.role}</span>}
                      {project.startDate && <span>{project.startDate} - {project.endDate || 'Present'}</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => handleEditProject(project)}
                      variant="ghost"
                      size="sm"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProject(project.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {project.description && <p className="text-sm mb-2">{project.description}</p>}
                {project.url && (
                  <p className="text-sm text-blue-500 mb-2">
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      {project.url}
                    </a>
                  </p>
                )}
                {project.bulletPoints.length > 0 && (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {project.bulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No projects added yet. Projects can showcase your skills and achievements.
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
