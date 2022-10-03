import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import "../App.css";

export default function MoviesManageComp() {
  const Navigate = useNavigate();
  const storeData = useSelector((store) => store);
  return (
    <Container className="mainpage">
      <div className="buttons">
        <Button variant="dark" onClick={() => Navigate("/movies/")}>
          Movies
        </Button>

        {storeData.current_user.Permissions.includes("create movies") && (
          <Button variant="dark" onClick={() => Navigate("/movies/new")}>
            Add a movie
          </Button>
        )}
      </div>
      <Outlet />
    </Container>
  );
}
