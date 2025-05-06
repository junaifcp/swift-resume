
import React from 'react';
import { Resume } from '@/context/ResumeContext';

type ResumePreviewProps = {
  resume: Resume;
  className?: string;
};

const ResumePreview = ({ resume, className }: ResumePreviewProps) => {
  return (
    <div className={`bg-white rounded-md shadow-md overflow-hidden ${className}`}>
      <div id="resume-preview" className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div style={{ backgroundColor: resume.themeColor }} className="px-6 py-8 text-white">
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
              <div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
