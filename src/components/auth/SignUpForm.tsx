
import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';

const SignUpForm: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <span className="font-mono text-2xl font-bold text-primary mr-2">Swift</span>
              <span className="font-mono text-xl">Resume</span>
            </div>
          </div>
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none",
                formButtonPrimary: "bg-primary hover:bg-primary/90",
              },
            }}
            redirectUrl="/dashboard"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
