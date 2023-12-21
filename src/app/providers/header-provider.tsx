import React from 'react';

interface IHeaderContext {
  headerRightContent: any;
  setHeaderRightContent: React.Dispatch<React.SetStateAction<any>>;
}

export const HeaderContext = React.createContext<IHeaderContext>({} as IHeaderContext);

interface IHeaderProviderProps {
  children: React.ReactElement;
}

export const HeaderProvider: React.FC<IHeaderProviderProps> = ({ children }) => {
  const [headerRightContent, setHeaderRightContent] = React.useState<any>(null);

  return (
    <HeaderContext.Provider value={{ headerRightContent, setHeaderRightContent }}>
      {children}
    </HeaderContext.Provider>
  );
};
