
import React from 'react';
import { Resume } from '@/context/ResumeContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type ResumePreviewProps = {
  resume: Resume;
  className?: string;
};

const ResumePreview = ({ resume, className }: ResumePreviewProps) => {
  // Get alignment class based on header alignment setting
  const getAlignmentClass = () => {
    switch (resume.headerAlignment || 'left') {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  // Helper function to render Projects section that will be used in all templates 
  const renderProjects = () => {
    if (resume.projects.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
          Projects
        </h2>
        <div className="space-y-4">
          {resume.projects.map((project) => (
            <div key={project.id}>
              <div className="flex justify-between mb-1">
                <h3 className="font-medium">{project.name}</h3>
                <span className="text-sm text-gray-600">{project.startDate} - {project.endDate}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{project.role}</p>
              {project.url && (
                <p className="text-sm text-blue-500 mb-1">
                  <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>
                </p>
              )}
              {project.description && <p className="text-sm mb-1">{project.description}</p>}
              
              {project.bulletPoints.length > 0 && (
                <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                  {project.bulletPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render Declaration section that will be used in all templates
  const renderDeclaration = () => {
    if (!resume.declaration) return null;
    
    return (
      <div className="mt-6 pt-6 border-t">
        <h2 className="text-lg font-bold mb-2" style={{ color: resume.themeColor }}>
          Declaration
        </h2>
        <p className="text-sm">{resume.declaration}</p>
      </div>
    );
  };

  // Now use the two functions in each template

  const renderTemplateA = () => (
    <div id="resume-preview" className="relative w-full h-full flex flex-col">
      {/* Header with Profile Image */}
      <div style={{ backgroundColor: resume.themeColor }} className={`px-6 py-6 text-white flex items-center ${getAlignmentClass()}`}>
        {resume.profileImage ? (
          <Avatar className={`w-16 h-16 mr-4 border-2 border-white/50 ${resume.headerAlignment === 'center' ? 'mx-auto' : resume.headerAlignment === 'right' ? 'ml-auto' : ''}`}>
            <AvatarImage src={resume.profileImage} alt={resume.name} />
            <AvatarFallback className="bg-white/30">
              {resume.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className={`w-16 h-16 mr-4 border-2 border-white/50 ${resume.headerAlignment === 'center' ? 'mx-auto' : resume.headerAlignment === 'right' ? 'ml-auto' : ''}`}>
            <AvatarFallback className="bg-white/30 text-white">
              {resume.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          <h1 className="text-2xl font-mono font-bold mb-1">{resume.name || 'Your Name'}</h1>
          <p className="text-lg opacity-90">{resume.title || 'Professional Title'}</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left column - Contact & Skills */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r">
          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
              Contact
            </h2>
            <ul className="space-y-2 text-sm">
              {resume.email && (
                <li>
                  <strong>Email:</strong> {resume.email}
                </li>
              )}
              {resume.phone && (
                <li>
                  <strong>Phone:</strong> {resume.phone}
                </li>
              )}
              {resume.location && (
                <li>
                  <strong>Location:</strong> {resume.location}
                </li>
              )}
              {resume.website && (
                <li>
                  <strong>Website:</strong> {resume.website}
                </li>
              )}
            </ul>
          </div>

          {/* Skills */}
          {resume.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
                Skills
              </h2>
              <div className="space-y-3">
                {resume.skills.map((skill) => (
                  <div key={skill.id} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>{skill.name}</span>
                      <span className="text-xs">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-1.5">
                      <div
                        className="rounded h-1.5"
                        style={{ width: `${skill.proficiency}%`, backgroundColor: resume.themeColor }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Summary, Experience, and Education */}
        <div className="w-full md:w-2/3 p-6">
          {/* Summary */}
          {resume.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2 border-b pb-1" style={{ color: resume.themeColor }}>
                Professional Summary
              </h2>
              <p className="text-sm">{resume.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resume.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
                Experience
              </h2>
              <div className="space-y-4">
                {resume.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">{exp.position}</h3>
                      <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{exp.company}</p>
                    {exp.description && <p className="text-sm mb-1">{exp.description}</p>}
                    
                    {exp.bulletPoints.length > 0 && (
                      <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                        {exp.bulletPoints.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
                Education
              </h2>
              <div className="space-y-4">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">{edu.institution}</h3>
                      <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <p className="text-sm mb-1">
                      {edu.degree}{edu.degree && edu.field ? ', ' : ''}{edu.field}
                    </p>
                    {edu.description && <p className="text-sm">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {renderProjects()}

          {/* Declaration */}
          {renderDeclaration()}
        </div>
      </div>
    </div>
  );

  const renderTemplateB = () => (
    <div id="resume-preview" className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div style={{ backgroundColor: resume.themeColor }} className={`px-6 py-8 text-white ${getAlignmentClass()}`}>
        <h1 className="text-2xl font-mono font-bold mb-1">{resume.name || 'Your Name'}</h1>
        <p className="text-lg opacity-90">{resume.title || 'Professional Title'}</p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left column - Contact & Skills */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r">
          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
              Contact
            </h2>
            <ul className="space-y-2 text-sm">
              {resume.email && (
                <li>
                  <strong>Email:</strong> {resume.email}
                </li>
              )}
              {resume.phone && (
                <li>
                  <strong>Phone:</strong> {resume.phone}
                </li>
              )}
              {resume.location && (
                <li>
                  <strong>Location:</strong> {resume.location}
                </li>
              )}
              {resume.website && (
                <li>
                  <strong>Website:</strong> {resume.website}
                </li>
              )}
            </ul>
          </div>

          {/* Skills */}
          {resume.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
                Skills
              </h2>
              <div className="space-y-3">
                {resume.skills.map((skill) => (
                  <div key={skill.id} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>{skill.name}</span>
                      <span className="text-xs">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-1.5">
                      <div
                        className="rounded h-1.5"
                        style={{ width: `${skill.proficiency}%`, backgroundColor: resume.themeColor }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Summary, Experience, and Education */}
        <div className="w-full md:w-2/3 p-6">
          {/* Summary */}
          {resume.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2 border-b pb-1" style={{ color: resume.themeColor }}>
                Professional Summary
              </h2>
              <p className="text-sm">{resume.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resume.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
                Experience
              </h2>
              <div className="space-y-4">
                {resume.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">{exp.position}</h3>
                      <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{exp.company}</p>
                    {exp.description && <p className="text-sm mb-1">{exp.description}</p>}
                    
                    {exp.bulletPoints.length > 0 && (
                      <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                        {exp.bulletPoints.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
                Education
              </h2>
              <div className="space-y-4">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">{edu.institution}</h3>
                      <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <p className="text-sm mb-1">
                      {edu.degree}{edu.degree && edu.field ? ', ' : ''}{edu.field}
                    </p>
                    {edu.description && <p className="text-sm">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {renderProjects()}

          {/* Declaration */}
          {renderDeclaration()}
        </div>
      </div>
    </div>
  );

  const renderTemplateC = () => (
    <div id="resume-preview" className="relative w-full h-full flex flex-col">
      {/* Header - ATS Friendly */}
      <div style={{ backgroundColor: resume.themeColor }} className={`px-6 py-8 text-white ${getAlignmentClass()}`}>
        <h1 className="text-2xl font-mono font-bold mb-1">{resume.name || 'Your Name'}</h1>
        <p className="text-lg opacity-90">{resume.title || 'Professional Title'}</p>
      </div>

      {/* Contact Information - Single line for ATS */}
      <div className="bg-gray-50 p-4 border-b text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.website && <span>{resume.website}</span>}
        </div>
      </div>

      {/* Single column layout - ATS Friendly */}
      <div className="p-6">
        {/* Summary */}
        {resume.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 border-b pb-1" style={{ color: resume.themeColor }}>
              Professional Summary
            </h2>
            <p className="text-sm">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
              Experience
            </h2>
            <div className="space-y-4">
              {resume.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium">{exp.position}</h3>
                    <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{exp.company}</p>
                  {exp.description && <p className="text-sm mb-1">{exp.description}</p>}
                  
                  {exp.bulletPoints.length > 0 && (
                    <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                      {exp.bulletPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium">{edu.institution}</h3>
                    <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-sm mb-1">
                    {edu.degree}{edu.degree && edu.field ? ', ' : ''}{edu.field}
                  </p>
                  {edu.description && <p className="text-sm">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {renderProjects()}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{ color: resume.themeColor }}>
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {resume.skills.map((skill) => (
                <div key={skill.id} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>{skill.name}</span>
                    <span className="text-xs">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-1.5">
                    <div
                      className="rounded h-1.5"
                      style={{ width: `${skill.proficiency}%`, backgroundColor: resume.themeColor }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Declaration */}
        {renderDeclaration()}
      </div>
    </div>
  );

  const renderTemplateD = () => (
    <div id="resume-preview" className="relative w-full h-full flex flex-col">
      {/* Minimalist header */}
      <div className={`px-6 py-8 border-b ${getAlignmentClass()}`}>
        <h1 className="text-2xl font-mono font-bold mb-1">{resume.name || 'Your Name'}</h1>
        <p className="text-lg text-gray-600">{resume.title || 'Professional Title'}</p>
        
        {/* Inline contact info */}
        <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 ${resume.headerAlignment === 'center' ? 'justify-center' : resume.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.website && <span>{resume.website}</span>}
        </div>
      </div>

      {/* Single column layout - Ultra minimal */}
      <div className="p-6">
        {/* Summary */}
        {resume.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 border-b pb-1">
              Professional Summary
            </h2>
            <p className="text-sm">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b pb-1">
              Experience
            </h2>
            <div className="space-y-4">
              {resume.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium">{exp.position}</h3>
                    <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{exp.company}</p>
                  {exp.description && <p className="text-sm mb-1">{exp.description}</p>}
                  
                  {exp.bulletPoints.length > 0 && (
                    <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                      {exp.bulletPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium">{edu.institution}</h3>
                    <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-sm mb-1">
                    {edu.degree}{edu.degree && edu.field ? ', ' : ''}{edu.field}
                  </p>
                  {edu.description && <p className="text-sm">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {renderProjects()}

        {/* Skills - Compact list */}
        {resume.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Declaration */}
        {renderDeclaration()}
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-md shadow-md overflow-hidden ${className}`}>
      {resume.templateId === 'template-a' 
        ? renderTemplateA() 
        : resume.templateId === 'template-b'
        ? renderTemplateB()
        : resume.templateId === 'template-c'
        ? renderTemplateC()
        : renderTemplateD()}
    </div>
  );
};

export default ResumePreview;
