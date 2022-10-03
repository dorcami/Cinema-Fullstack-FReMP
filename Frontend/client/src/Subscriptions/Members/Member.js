import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import SubscribedMoviesComp from "./SubscribedMovies";
import { useState } from "react";
import SubscribeAMovieComp from "./SubscribeAMovie";
import { useSelector } from "react-redux";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";

export default function MemberComp(props) {
  const [modalShow, setModalShow] = useState(false);
  const [message, setMessage] = useState("");
  const [show_add_movie, setShowAddMovie] = useState(false);
  const storeData = useSelector((store) => store);
  const Navigate = useNavigate();

  return (
    <Card className="cards centered">
      <Card.Header>{props.member.name}</Card.Header>
      <Card.Body className="flex gap1">
        <Card.Text>
          Name: {props.member.name}
          <br></br>
          Email: {props.member.email}
          <br></br>
          City: {props.member.city}
        </Card.Text>

        <Button size="sm" variant="secondary" className="centered" onClick={() => setModalShow(true)}>
          Subscribed movies
        </Button>
        {modalShow && (
          <SubscribedMoviesComp member={{ id: props.member._id, name: props.member.name }} show={modalShow} onHide={() => setModalShow(false)} />
        )}
        <Button
          size="sm"
          variant="secondary"
          className="centered"
          onClick={() => {
            setMessage("");
            setShowAddMovie(!show_add_movie);
          }}
        >
          Subscribe to a movie
        </Button>
        {show_add_movie && <SubscribeAMovieComp id={props.member._id} message={setMessage} show={setShowAddMovie} />}
        {message && <h6>{message}</h6>}
      </Card.Body>
      <Card.Footer>
        <ButtonGroup className="centered">
          {storeData.current_user.Permissions.includes("update subscriptions") && (
            <Button type="button" onClick={() => Navigate("/subscriptions/edit/" + props.member._id)}>
              Edit
            </Button>
          )}
          {storeData.current_user.Permissions.includes("delete subscriptions") && (
            <Button type="button" onClick={() => props.func(props.member._id)}>
              Delete
            </Button>
          )}
        </ButtonGroup>
      </Card.Footer>
    </Card>
  );
}
