import React, { createContext, useState } from 'react';

export const HeaderFooterContext = createContext();

export const HeaderFooterProvider = ({ children }) => {
  const [isHeader, setIsHeader] = useState(true);
  const [isFooter, setIsFooter] = useState(true);

  return (
    <>
      <HeaderFooterContext.Provider
        value={{ isHeader, isFooter, setIsHeader, setIsFooter }}
      >
        {children}
      </HeaderFooterContext.Provider>
    </>
  );
};
