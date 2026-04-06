import { useEffect, useState } from 'react';

// This variable sits OUTSIDE the function so it stays the same 
// no matter which screen calls the hook.
let globalUser: any = null;

export function useAuth() {
  const [user, setUser] = useState<any>(globalUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const mockLogin = () => {
    globalUser = { email: 'student@ctu.edu.ph' }; // Update the global variable
    setUser(globalUser); // Update the local state
  };

  const mockSignOut = () => {
    globalUser = null;
    setUser(null);
  };

  return { user, isLoading, mockLogin, mockSignOut };
}