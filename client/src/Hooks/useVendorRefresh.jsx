import { useAuth } from './useAuth';
import { vendorRefresh } from '../../api/Vendor/AuthApi';

const useVendorefreshTooken = () => {
  const { setVendorAuth } = useAuth();
  // call refresh token api
  const refresh = async () => {
    const res = await vendorRefresh();
    setVendorAuth((prev) => {
      return {
        ...prev,
        accessToken: res.data.data?.accessToken,
        data: res.data.data?.data,
      };
    });
    return res.data.data.accessToken;
  };
  return refresh;
};

export default useVendorefreshTooken;
