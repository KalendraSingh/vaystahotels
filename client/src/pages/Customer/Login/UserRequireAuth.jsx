import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../../Hooks/useAuth';
import DataLoading from '../../../components/DataLoading/DataLoading';
import { PersistLoader } from '../../../components/common/PersistLoader/PersistLoader';

const UserRequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  return auth?.accessToken ? <Outlet /> : <PersistLoader path={'/login'} />;
};

export default UserRequireAuth;
