import React from 'react';
import Nav from './NavBar/Nav';

const Layout = ({ children }) => {
  return (
    <div>
      <Nav />
      {children}
    </div>
  )
}

export default Layout;