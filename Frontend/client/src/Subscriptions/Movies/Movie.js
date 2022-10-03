import { useNavigate } from "react-router-dom";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState } from "react";
import SubscribedMembersComp from "./SubscribedMembers";
import { useSelector } from "react-redux";

export default function MovieComp(props) {
  const Navigate = useNavigate();
  const storeData = useSelector((store) => store);
  const year = new Date(props.movie.premiered);
  const [modalShow, setModalShow] = useState(false);

  return (
    <Card className="cards">
      <Card.Img variant="top" src={props.movie.image} alt={props.movie.name} />
      <Card.Body className="flex">
        <Card.Title>{props.movie.name}</Card.Title>
        <Card.Title>{year.getFullYear()}</Card.Title>
        <Card.Text className="centered">Genres: {props.movie.genres.join(", ")} </Card.Text>
        {storeData.current_user.Permissions.includes("view subscriptions") && (
          <Button size="sm" variant="primary" className="centered" onClick={() => setModalShow(true)}>
            subscribed members
          </Button>
        )}
        {modalShow && (
          <SubscribedMembersComp movie={{ id: props.movie._id, name: props.movie.name }} show={modalShow} onHide={() => setModalShow(false)} />
        )}
      </Card.Body>
      <Card.Footer className="flex">
        <ButtonGroup className="centered">
          {storeData.current_user.Permissions.includes("update movies") && (
            <Button size="sm" type="button" onClick={() => Navigate("/movies/edit/" + props.movie._id)}>
              Edit
            </Button>
          )}
          {storeData.current_user.Permissions.includes("delete movies") && (
            <Button size="sm" type="button" onClick={() => props.func(props.movie._id)}>
              Delete
            </Button>
          )}
        </ButtonGroup>
      </Card.Footer>
    </Card>
  );
}
