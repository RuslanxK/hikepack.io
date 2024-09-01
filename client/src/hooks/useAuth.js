import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';



export const useAuth = () => {
  const token = Cookies.get('token');

  if (token) {
    try {
      
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
          Cookies.remove('token');
        return false;
      }
      return true;
    } catch (error) {
      Cookies.remove('token');
      return false;
    }
  }

  return false;
}
