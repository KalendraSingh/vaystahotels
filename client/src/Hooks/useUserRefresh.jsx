import { axiosPrivate } from '../../api/axios';
import { useAuth } from '../Hooks/useAuth';

const useUserRefreshTooken = () => {
  const { setAuth } = useAuth();
  // call refresh token api
  const refresh = async () => {
    const res = await axiosPrivate.get('/customer/auth/refresh');
    // console.log('refresher====>', res);
    // console.log('Inside refresh => ', res.data);
    setAuth((prev) => {
      // console.log('refresh', prev);
      return {
        ...prev,
        accessToken: res.data.accessToken,
        data: res.data.customer,
      };
    });
    return res.data.accessToken;
  };
  return refresh;
};

export default useUserRefreshTooken;
