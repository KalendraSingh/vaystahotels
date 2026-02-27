import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../Hooks/useAuth';
import DataLoading from '../../../components/DataLoading/DataLoading';
import useAdminRefreshTooken from '../../../Hooks/useAdminRefresh';

const AdminPersist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useAdminRefreshTooken();

  const { adminAuth, persist } = useAuth();
  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !adminAuth?.accessToken && persist
      ? verifyRefreshToken()
      : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <DataLoading /> : <Outlet />}</>
  );
};

export default AdminPersist;
