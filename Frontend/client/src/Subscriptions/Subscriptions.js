import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import "../App.css";

export default function SubscriptionsComp() {
  const Navigate = useNavigate();
  const storeData = useSelector((store) => store);
  return (
    <Container className="mainpage">
      <div className="buttons">
        <Button variant="dark" onClick={() => Navigate("/subscriptions/")}>
          Members
        </Button>

        {storeData.current_user.Permissions.includes("create subscriptions") && (
          <Button variant="dark" onClick={() => Navigate("/subscriptions/new")}>
            Add a member
          </Button>
        )}
      </div>
      <Outlet />
    </Container>
  );
}
