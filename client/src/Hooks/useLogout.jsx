import { useNavigate } from "react-router-dom";

import { axiosPrivate } from "../api/axios";
import { useAuth } from "./useAuth";

const useLogout = () => {
  const { setAuth, setPersist } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    setAuth({});
    setPersist(false);
    try {
      const response = await axiosPrivate.get("/auth/customer/logout", {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
