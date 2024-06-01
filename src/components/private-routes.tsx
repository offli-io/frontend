import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from '../utils/token.util';
import { AuthenticationContext } from './context/providers/authentication-provider';

export const PrivateRoutes = () => {
  const { stateToken, setStateToken, setUserInfo, userInfo } =
    React.useContext(AuthenticationContext);
  const token = getAuthToken();
  const userIdFromStorage = localStorage.getItem('userId');

  React.useEffect(() => {
    if (!stateToken && !!token) {
      setStateToken(token);
    }
  }, [stateToken, token]);

  React.useEffect(() => {
    if (!userInfo && !!userIdFromStorage) {
      setUserInfo && setUserInfo({ id: Number(userIdFromStorage) });
    }
  });

  const hasToken = stateToken || token;

  return hasToken ? <Outlet /> : <Navigate to="/" />;
};
