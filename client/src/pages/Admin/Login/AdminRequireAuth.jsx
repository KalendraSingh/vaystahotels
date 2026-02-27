import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../../Hooks/useAuth';
import DataLoading from '../../../components/DataLoading/DataLoading';

const AdminRequireAuth = () => {
  const { adminAuth } = useAuth();
  const location = useLocation();

  // console.log("Access Tokens : ", auth.accessToken);

  return adminAuth?.accessToken ? (
    <Outlet />
  ) : (
    <>
      <DataLoading />
      <Navigate to='/admin-login' state={{ from: location }} replace />
    </>
  );
};

export default AdminRequireAuth;
