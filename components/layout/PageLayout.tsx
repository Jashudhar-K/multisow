import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <div className="p-8 min-h-screen">
      {title && <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>}
      {children}
    </div>
  );
};

export default PageLayout;
