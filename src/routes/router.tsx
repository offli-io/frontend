import React, { ReactElement, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "../app/layout";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import LoadingScreen from "../screens/loading-screen";

const Router: React.FC = (): ReactElement => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Layout />
    </Suspense>
  );
};

export default Router;
