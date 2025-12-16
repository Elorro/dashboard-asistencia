import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #2563eb; /* blue-600 */
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.span`
  font-weight: bold;
  font-size: 1.25rem;
`;

const LogoutButton = styled.button`
  background-color: #1e40af; /* blue-800 */
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #1e3a8a; /* slightly darker blue */
  }
`;

export default function Navbar() {
  return (
    <Nav>
      <Brand>FaceAttend Dashboard</Brand>
      <LogoutButton>Cerrar sesión</LogoutButton>
    </Nav>
  );
}