import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from './AuthProvider';
import Link from 'next/link';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Nav.Link as={Link} href={`/${user?.role}/inventory`}>
            <Navbar.Brand>Inventory Manager</Navbar.Brand>
          </Nav.Link>
          <Nav className="me-auto">
            {user?.role === 'admin' ? (
              <>
                <Nav.Link as={Link} href="/admin/inventory">Inventory</Nav.Link>
                <Nav.Link as={Link} href="/admin/users">Manage Users</Nav.Link>
                <Nav.Link as={Link} href="/admin/history">History</Nav.Link>
              </>
            ) : user?.role === 'user' ? (
              <>
                <Nav.Link as={Link} href="/user/inventory">Inventory</Nav.Link>
              </>
            ) : null}
          </Nav>
          {user && (
            <Button variant="outline-light" onClick={logout}>Logout</Button>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
