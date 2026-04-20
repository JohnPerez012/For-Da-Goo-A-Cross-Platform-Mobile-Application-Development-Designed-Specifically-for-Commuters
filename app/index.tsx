import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a loading screen
  }

  // Redirect to auth if not logged in, if yes to explore
  
  return <Redirect href={user ? "/(tabs)/explore" : "/auth"} />;
}
