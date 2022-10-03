import ThemeProvider from "react-bootstrap/ThemeProvider";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect } from "react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../App.css";

export default function MainComp() {
  const [isAdmin, setAdmin] = useState(false);
  const dispatch = useDispatch();
  const storeData = useSelector((store) => store);
  useEffect(() => {
    storeData.current_user.Username === "admin" ? setAdmin(true) : setAdmin(false);
  }, [storeData]);

  return (
    <ThemeProvider breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]} minBreakpoint="xxs">
      <Navbar bg="primary" variant="dark" expand="lg">
        {/* <Container> */}
        <Navbar.Brand>
          <Link to="/">Cinema Project</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {storeData.current_user.Permissions.includes("view movies") && (
              <Link to="movies">
                <li className="nav-item nav-link">Movies</li>
              </Link>
            )}
            {storeData.current_user.Permissions.includes("view subscriptions") && (
              <Link to="subscriptions">
                <li className="nav-item nav-link">Subscriptions</li>
              </Link>
            )}
            {isAdmin && (
              <Link to="users">
                <li className="nav-item nav-link">Users management</li>
              </Link>
            )}

            {storeData.current_user.Username && (
              <Link to="/signin" onClick={() => dispatch({ type: "LogOutUser" })}>
                <li className="nav-item nav-link">Log Out</li>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Navbar bg="dark">{storeData.current_user.FirstName && <Navbar.Text>Welcome back, {storeData.current_user.FirstName}</Navbar.Text>}</Navbar>

      <Outlet />
    </ThemeProvider>
  );
}
