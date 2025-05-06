
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b bg-white">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-2xl font-bold text-primary">Swift</span>
          <span className="font-mono text-xl">Resume</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Button asChild>
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                AI-Powered Resume Builder in React + Vite
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Create a professional resume in minutes with our AI-powered resume builder. 
                Get expert guidance, customizable templates, and real-time preview.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button size="lg" asChild className="mr-4">
                  <Link to="/dashboard">Get Started Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">Learn More</a>
                </Button>
              </motion.div>
            </div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative z-10"
              >
                <img 
                  src="/resume-preview.png" 
                  alt="Resume Preview" 
                  className="rounded-lg shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x800?text=Resume+Preview";
                  }}
                />
              </motion.div>
              <div className="absolute -z-10 top-8 -right-8 w-full h-full bg-secondary/10 rounded-lg"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-muted px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Professional Templates</h3>
                <p className="text-muted-foreground">Choose from a variety of professional templates that stand out from the crowd.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><path d="M11 18H8a2 2 0 0 1-2-2V9" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Content</h3>
                <p className="text-muted-foreground">Generate professional summaries and bullet points with our AI assistant.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M7 5V3h10v2" /><path d="M7 13v-3h10v3" /><path d="M7 21v-3h10v3" /><rect width="16" height="4" x="4" y="5" rx="1" /><rect width="16" height="4" x="4" y="13" rx="1" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Real-Time Preview</h3>
                <p className="text-muted-foreground">See changes to your resume in real-time as you make edits.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to create your professional resume?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of job seekers who have created winning resumes with our platform.
            </p>
            <Button size="lg" asChild>
              <Link to="/dashboard">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="font-mono text-xl font-bold text-primary">Swift</span>
            <span className="font-mono text-lg">Resume</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Swift Resume. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
