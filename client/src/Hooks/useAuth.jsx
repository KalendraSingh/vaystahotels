import { useContext } from 'react';
import AuthContext from '../Context/AuthProvider';

export const useAuth = () => {
  return useContext(AuthContext);
};
