import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../UserContext";

import "../App.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function AppNavbar() {
  const { user } = useContext(UserContext);
  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Solution Design
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" exact>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products" exact>
              Products
            </Nav.Link>
            {user.id !== null ? (
              user.isAdmin ? (
                <>
                  <Nav.Link as={Link} to="/orders">
                    Orders
                  </Nav.Link>
                  <Nav.Link as={Link} to="/addProduct">
                    Add Product
                  </Nav.Link>
                  <Nav.Link as={Link} to="/logout">
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/profile">
                    Profile
                  </Nav.Link>
                  {user.isAdmin === false && ( // Only show for non-admin users
                    <Nav.Link as={NavLink} to="/myCart" exact>
                      My Cart
                    </Nav.Link>
                  )}
                  <Nav.Link as={Link} to="/logout">
                    Logout
                  </Nav.Link>
                </>
              )
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
