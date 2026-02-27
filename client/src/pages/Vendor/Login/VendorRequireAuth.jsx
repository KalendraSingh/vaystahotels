import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../../Hooks/useAuth';
import DataLoading from '../../../components/DataLoading/DataLoading';
import { useState } from 'react';
import { PersistLoader } from '../../../components/common/PersistLoader/PersistLoader';

const VendorRequireAuth = () => {
  const { vendorAuth } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  return vendorAuth?.accessToken ? (
    <Outlet />
  ) : (
    <PersistLoader path={'/vendor-login'} />
  );
};

export default VendorRequireAuth;
