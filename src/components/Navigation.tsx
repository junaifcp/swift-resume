
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, LogOut, User, FileText, Plus } from 'lucide-react';

const Navigation = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = () => {
    signOut();
  };

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.firstName?.[0] || '?';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex justify-between items-center h-16 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 font-mono text-xl font-bold">
          <FileText className="w-6 h-6 text-primary" />
          <span className="hidden sm:inline">Swift Resume</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Dashboard
              </Link>
              <Button asChild variant="default" size="sm">
                <Link to="/create-resume" className="gap-2 flex items-center">
                  <Plus className="w-4 h-4" />
                  New Resume
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>My Resumes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Home
              </Link>
              <Button asChild variant="outline" size="sm">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white animate-fade-in">
          <div className="flex flex-col p-4 space-y-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 p-3 bg-accent rounded-md">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
                <Link 
                  to="/dashboard" 
                  onClick={closeMobileMenu}
                  className={`p-3 rounded-md text-sm font-medium ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  onClick={closeMobileMenu}
                  className={`p-3 rounded-md text-sm font-medium ${isActive('/profile') ? 'bg-primary/10 text-primary' : ''}`}
                >
                  Profile
                </Link>
                <Button asChild variant="default" className="w-full">
                  <Link to="/create-resume" onClick={closeMobileMenu} className="gap-2 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                    New Resume
                  </Link>
                </Button>
                <Button onClick={handleSignOut} variant="outline" className="w-full gap-2 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  onClick={closeMobileMenu}
                  className={`p-3 rounded-md text-sm font-medium ${isActive('/') ? 'bg-primary/10 text-primary' : ''}`}
                >
                  Home
                </Link>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/sign-in" onClick={closeMobileMenu}>Sign In</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/sign-up" onClick={closeMobileMenu}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
