import { useNavigate } from 'react-router-dom';

import { axiosPrivate } from '../api/axios';
import { useAuth } from './useAuth';

const useAdminLogout = () => {
  const { setAdminAuth, setPersist } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    setAdminAuth({});
    setPersist(false);
    try {
      const response = await axiosPrivate.get('/auth/adminStaff/admin-logout', {
        withCredentials: true,
      });
      navigate('/admin-login');
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useAdminLogout;
