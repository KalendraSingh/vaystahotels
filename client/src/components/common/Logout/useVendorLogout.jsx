import { vendorLogout } from '../../../../api/Vendor/AuthApi';

const useVendorLogout = () => {
  const logout = async () => {
    try {
      const res = await vendorLogout();
      if (res.status === 200) {
        window.location.href = '/vendor-login';
      }
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};
export default useVendorLogout;
