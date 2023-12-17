import React, { ReactElement, Suspense } from 'react';
import { Layout } from '../app/layout';
import LoadingScreen from '../screens/static-screens/loading-screen';

const Router: React.FC = (): ReactElement => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Layout />
    </Suspense>
  );
};

export default Router;
