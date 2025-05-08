
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Resume } from "@/context/ResumeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DeclarationProps = {
  resume: Resume;
  updateResume: (data: Partial<Resume>) => void;
};

const Declaration = ({ resume, updateResume }: DeclarationProps) => {
  const handleDeclarationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateResume({ declaration: e.target.value });
  };

  return (
    <div className="max-w-full overflow-hidden">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Declaration (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="declaration">
                Personal Declaration
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add a personal statement or declaration to the end of your resume (e.g., "I hereby declare that all the information provided is true to the best of my knowledge.")
              </p>
              <Textarea
                id="declaration"
                placeholder="Enter your declaration statement..."
                value={resume.declaration || ""}
                onChange={handleDeclarationChange}
                rows={5}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Declaration;
