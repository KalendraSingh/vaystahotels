import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { useAuth } from "./useAuth";
import useAdminRefreshTooken from "./useAdminRefresh";

const useAxiosPrivateAdmin = () => {
  const refresh = useAdminRefreshTooken();
  const { adminAuth } = useAuth();
  // console.log("private admin : ", adminAuth.accessToken);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${adminAuth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // console.log(" requestIntercept", requestIntercept);

    const responseIntercept = axiosPrivate.interceptors.response.use(
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
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [adminAuth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivateAdmin;
