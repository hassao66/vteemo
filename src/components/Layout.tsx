import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="vitimo-container">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-primary">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;