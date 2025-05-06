
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Eye,
  Download,
  Trash2, 
  Edit,
  Plus,
  FileText
} from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { usePdfExport } from '@/hooks/usePdfExport';

const Dashboard = () => {
  const { resumes, createResume, deleteResume } = useResume();
  const navigate = useNavigate();
  const { exportToPdf, isExporting } = usePdfExport();

  const handleCreateResume = () => {
    const newResume = createResume();
    navigate(`/editor/${newResume.id}`);
    toast.success('New resume created');
  };

  const handleDeleteResume = (id: string, name: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteResume(id);
      toast.success('Resume deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b bg-white">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-mono text-2xl font-bold text-primary">Swift</span>
            <span className="font-mono text-xl">Resume</span>
          </Link>
        </div>
        <div>
          <Button onClick={handleCreateResume} className="flex items-center gap-2">
            <Plus size={16} />
            <span>New Resume</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Resumes</h1>
          <p className="text-muted-foreground">
            Create, edit and manage your resumes
          </p>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <FileText size={64} className="text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-medium mb-2">No resumes yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first resume to get started
            </p>
            <Button onClick={handleCreateResume} className="flex items-center gap-2">
              <Plus size={16} />
              <span>Create Resume</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                <Link to={`/editor/${resume.id}`}>
                  <div className="h-40 bg-muted flex items-center justify-center border-b">
                    <div className="w-32 h-32 bg-white rounded border flex items-center justify-center">
                      <span className="font-mono text-lg">{resume.name}</span>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-1 truncate">{resume.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{resume.title || 'No title'}</p>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {resume.lastUpdated ? format(new Date(resume.lastUpdated), 'MMM d, yyyy') : 'Never'}
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="border-t bg-muted/50 p-2">
                  <div className="flex justify-between w-full">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/editor/${resume.id}`} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                      </Link>
                    </Button>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/preview/${resume.id}`} className="flex items-center gap-1">
                          <Eye size={16} />
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toast.info('Download functionality would export PDF in production');
                        }}
                      >
                        <Download size={16} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center text-destructive"
                        onClick={(e) => handleDeleteResume(resume.id, resume.name, e)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
