import React, { createContext, useState } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [adminAuth, setAdminAuth] = useState({});
  const [vendorAuth, setVendorAuth] = useState({});

  // console.log("adminAuth Result : ", adminAuth);
  const [persist, setPersist] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        adminAuth,
        setAdminAuth,
        persist,
        setPersist,
        vendorAuth,
        setVendorAuth,
      }}>
      <>{children}</>
    </AuthContext.Provider>
  );
};

export default AuthContext;
