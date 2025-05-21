import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, LoginCredentials, RegisterData } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Please login with your credentials",
      });
      navigate('/login');
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
      navigate('/login');
    },
    onError: (error: Error) => {
       // Even if backend logout fails, we clear local storage for a better user experience
      console.error('Logout failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
       toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "An error occurred during logout.",
      });
      navigate('/login');
    },
  });


  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};