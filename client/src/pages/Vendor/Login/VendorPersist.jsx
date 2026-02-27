import { useState, React, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useVendorefreshTooken from '../../../Hooks/useVendorRefresh';
import { useAuth } from '../../../Hooks/useAuth';
import { PersistLoader } from '../../../components/common/PersistLoader/PersistLoader';

const VendorPersist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useVendorefreshTooken();

  const { vendorAuth, persist } = useAuth();
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

    !vendorAuth?.accessToken && persist
      ? verifyRefreshToken()
      : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <PersistLoader /> : <Outlet />}</>
  );
};

export default VendorPersist;
