import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';

interface AdminLoginProps {
  onBack: () => void;
}

const AdminLogin = ({ onBack }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAdmin, loading } = useAuth();
  const { toast } = useToast();

  // Redirect to dashboard if user is already an admin
  useEffect(() => {
    if (!loading && isAdmin) {
      // User is already authenticated as admin, no need to show login form
      return;
    }
  }, [isAdmin, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        window.location.href = '/admin'; // Redirect to admin dashboard
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already admin, don't show login form (AdminDashboard will handle display)
  if (isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="font-cinzel text-2xl font-bold">FEARLESS</h1>
          <p className="text-gray-600">Admin Login</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full text-gray-600 py-2 hover:text-black"
          >
            Back to Site
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
