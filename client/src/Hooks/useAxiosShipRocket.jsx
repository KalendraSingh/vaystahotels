import { useEffect } from "react";
import { axiosShipRocket } from "../api/axios";
import { useAuth } from "./useAuth";
import useAdminRefreshTooken from "./useAdminRefresh";

const useAxiosShipRocket = () => {
  const refresh = useAdminRefreshTooken();
  const { adminAuth } = useAuth();
  // console.log("private admin : ", adminAuth.accessToken);

  useEffect(() => {
    const requestIntercept = axiosShipRocket.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${adminAuth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // console.log(" requestIntercept", requestIntercept);

    const responseIntercept = axiosShipRocket.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosShipRocket.interceptors.request.eject(requestIntercept);
      axiosShipRocket.interceptors.response.eject(responseIntercept);
    };
  }, [adminAuth, refresh]);

  return axiosShipRocket;
};

export default useAxiosShipRocket;
