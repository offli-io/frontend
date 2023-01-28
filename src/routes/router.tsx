import { ReactElement, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/activities/requests";
import { Layout } from "../app/layout";
import LoadingScreen from "../screens/loading-screen";

const Router: React.FC = (): ReactElement => {
  const { userInfo, setUserInfo } = React.useContext(AuthenticationContext);

  //TODO what is this for?
  const userInfoQuery = useQuery(
    ["user-info", userInfo?.username],
    () => getUsers({ username: userInfo?.username }),
    {
      enabled: !!userInfo?.username,
      onSuccess: (data) => {
        setUserInfo && setUserInfo(data?.data);
      },
      cacheTime: Infinity,
    }
  );

  return (
    <Suspense fallback={<LoadingScreen />}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;
