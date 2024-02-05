import React from 'react';

type MainContainerProps = {
  children: React.ReactNode;
};
export const MainContainer = (
  { children }: MainContainerProps
) => {

  return (
    <div className="w-full h-full">
      {children}
    </div>
  )
};