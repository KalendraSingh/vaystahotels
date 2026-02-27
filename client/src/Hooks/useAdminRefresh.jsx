import { useAuth } from './useAuth';
import { adminRefresh } from '../../api/Admin/AuthApi';

const useAdminRefreshTooken = () => {
  const { setAdminAuth } = useAuth();
  // call refresh token api
  const refresh = async () => {
    const res = await adminRefresh();

    console.log('inside persist = ', res.data);
    setAdminAuth((prev) => {
      // console.log("refresh", prev);
      return {
        ...prev,
        accessToken: res.data.accessToken,
        data: res.data.staff,
      };
    });
    return res.data.accessToken;
  };

  return refresh;
};

export default useAdminRefreshTooken;
