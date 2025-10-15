import { useEffect, useState } from 'react';
import { useUser as useClerkUser } from '@clerk/clerk-react';
import { userService } from '../services/userService';

// Custom hook to manage user data
export const useUser = () => {
  const { user: clerkUser, isSignedIn, isLoaded } = useClerkUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return;
      
      if (isSignedIn && clerkUser) {
        try {
          setLoading(true);
          
          // Create or update user in database
          const userData = {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl,
            phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
          };

          console.log('🔄 Syncing user to database:', userData);

          const dbUserData = await userService.createOrUpdateUser(userData);
          console.log('✅ User synced to database:', dbUserData);
          setDbUser(dbUserData);
          setError(null);
        } catch (err) {
          console.error('❌ Error syncing user:', err);
          console.error('Error details:', {
            message: err.message,
            response: err.response,
            stack: err.stack
          });
          setError(err.message);
          
          // Still allow access even if sync fails (user might already exist)
          // Don't block the user completely
          console.warn('⚠️ Continuing with limited functionality...');
        } finally {
          setLoading(false);
        }
      } else {
        setDbUser(null);
        setLoading(false);
      }
    };

    syncUser();
  }, [clerkUser, isSignedIn, isLoaded]);

  return {
    clerkUser,
    dbUser,
    isSignedIn,
    isLoaded,
    loading,
    error,
  };
};
