import React from 'react';

type MessageContainerProps = {
  children: React.ReactNode;
};

export const MessageContainer = (
  { children }: MessageContainerProps
) => {
  
  return (
    <div className="w-full h-full">
      {children}
    </div>
  )
};