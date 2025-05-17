import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHospital, FaUserMd, FaUser } from 'react-icons/fa';

const Header = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xl);
  font-weight: 700;
`;

const Nav = styled.nav`
  display: flex;
  gap: var(--space-4);
`;

const NavLink = styled(Link)`
  color: white;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 64px);
  padding: var(--space-5) 0;
`;

const Footer = styled.footer`
  background-color: var(--neutral-800);
  color: var(--neutral-400);
  padding: var(--space-5) 0;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
`;

const MainLayout = () => {
  const location = useLocation();
  
  return (
    <>
      <Header>
        <HeaderContent>
          <Logo>
            <FaHospital /> Tib AI
          </Logo>
          <Nav>
            <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
              <FaUser /> Patient
            </NavLink>
            <NavLink to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              <FaUserMd /> Admin
            </NavLink>
          </Nav>
        </HeaderContent>
      </Header>
      <Main>
        <Outlet />
      </Main>
      <Footer>
        <FooterContent>
          <p>&copy; {new Date().getFullYear()} Tib AI. All rights reserved.</p>
          <p>powered by <a href="https://aridianarray.com/" target="_blank" rel="noopener noreferrer">Aridian Array Software Society</a></p>
        </FooterContent>
      </Footer>
    </>
  );
};

export default MainLayout;