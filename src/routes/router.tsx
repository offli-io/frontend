import React, { ReactElement, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "../app/layout";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import LoadingScreen from "../screens/loading-screen";

const Router: React.FC = (): ReactElement => {
  const { userInfo, setUserInfo } = React.useContext(AuthenticationContext);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;
