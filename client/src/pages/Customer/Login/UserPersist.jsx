import { useState, React, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../Hooks/useAuth';
import useUserRefreshTooken from '../../../Hooks/useUserRefresh';

const UserPersist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useUserRefreshTooken();

  const { auth, persist } = useAuth();
  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    // console.log(`isLoading: ${isLoading}`);
    // console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return <>{!persist ? <Outlet /> : isLoading ? '' : <Outlet />}</>;
};

export default UserPersist;
