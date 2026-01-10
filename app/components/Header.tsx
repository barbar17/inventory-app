import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from './AuthProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const { user, logout } = useAuth();

  const route = usePathname();
  const isActive = (path: string) => route.startsWith(path);

  return (
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Nav.Link as={Link} href={user ? `/${user?.role}/inventory` : ''}>
            <Navbar.Brand>Inventory Manager</Navbar.Brand>
          </Nav.Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0 d-flex">
              {user?.role === 'admin' ? (
                <>
                  <Nav.Link as={Link} href="/admin/inventory" active={isActive("/admin/inventory")}>Inventory</Nav.Link>
                  <Nav.Link as={Link} href="/admin/users" active={isActive("/admin/users")}>Manage Users</Nav.Link>
                  <Nav.Link as={Link} href="/admin/history" active={isActive("/admin/history")}>History</Nav.Link>
                </>
              ) : user?.role === 'user' ? (
                <>
                  <Nav.Link as={Link} href="/user/inventory" active={isActive("/user/inventory")}>Inventory</Nav.Link>
                </>
              ) : null}
            </Nav>
            {user && (
              <div className='d-flex justify-content-end align-items-end'>
                <Button variant="outline-light" onClick={logout}>Logout</Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default Header;
