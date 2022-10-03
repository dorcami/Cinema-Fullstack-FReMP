import { Outlet, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import "../App.css";

export default function UserManagementComp() {
  const Navigate = useNavigate();
  return (
    <Container className="mainpage">
      <div className="buttons">
        <Button variant="dark" onClick={() => Navigate("/users/")}>
          Users
        </Button>

        <Button variant="dark" onClick={() => Navigate("/users/new")}>
          Add a user
        </Button>
      </div>
      <Outlet />
    </Container>
  );
}
