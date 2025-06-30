// PrivateRoute.js
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, redirectTo="/" }) => {
  const { authState } = useContext(AuthContext);

  if(!authState.isAuthenticated){
    return <Navigate to={redirectTo}/>
  }

  return children ? children : <Outlet/>
};


export default ProtectedRoute;