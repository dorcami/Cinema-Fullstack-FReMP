import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SubscribedMoviesComp(props) {
  const [movies, setMovies] = useState([]);
  const Navigate = useNavigate();
  const storeData = useSelector((store) => store);
  useEffect(() => {
    const Get_data = async () => {
      let resp = await axios.get("http://127.0.0.1:4000/subscriptions/movies/" + props.member.id, {
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      if (resp.status === 200) {
        setMovies(resp.data);
      } else {
        Navigate("/signin");
      }
    };
    Get_data();
    // eslint-disable-next-line
  }, []);

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{props.member.name}'s subscribed movies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {movies &&
          movies.map((movie) => {
            return (
              <h6 key={movie._id}>
                <Link to={"/movies/edit/" + movie._id}>{movie.name}</Link>, subscribed in {new Date(movie.date).toLocaleDateString()}
              </h6>
            );
          })}
        {movies.length === 0 && <h6>The member hasn't subscribed to any movie yet! </h6>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
