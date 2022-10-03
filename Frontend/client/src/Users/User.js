import { useNavigate } from "react-router-dom";
import "../App.css";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function UserComp(props) {
  const Navigate = useNavigate();

  return (
    <Card className="cards">
      <Card.Header>{props.user.FirstName + " " + props.user.LastName}</Card.Header>
      <Card.Body className="flex gap1">
        <Card.Text>
          username: {props.user.Username}
          <br></br>
          created: {props.user.CreatedDate}
          <br></br>
          Session time out: {props.user.SessionTimeOut}
          <br></br>
          <u>Permissions:</u>
          <ul>
            {props.user.Permissions.map((item, i) => {
              return <li>{item}</li>;
            })}
          </ul>
        </Card.Text>
      </Card.Body>
      <Card.Footer style={{ textAlign: "center" }}>
        <ButtonGroup className="centered">
          <Button type="button" onClick={() => Navigate("/users/edit/" + props.user._id)}>
            Edit
          </Button>

          <Button type="button" onClick={() => props.func(props.user._id)}>
            Delete
          </Button>
        </ButtonGroup>
      </Card.Footer>
    </Card>
  );
}
