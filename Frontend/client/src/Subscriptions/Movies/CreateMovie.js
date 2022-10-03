import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreateMovieComp() {
  const storeData = useSelector((store) => store);
  const [movie, setMovie] = useState({
    name: "",
    genres: "",
    premiered: "",
    image: "",
  });
  const Navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    let obj = movie;
    obj["genres"] = obj["genres"].split(", ");
    let resp = await axios.post("http://127.0.0.1:4000/movies/", obj, {
      headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
    });
    if (resp.status === 200) {
      Navigate("/movies/");
    } else {
      Navigate("/signin");
    }
  };

  return (
    <Card className="sign">
      <Card.Body>
        <Card.Title>Add a movie</Card.Title>
        <Form onSubmit={(e) => submit(e)}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Movie name</Form.Label>
            <Form.Control
              type="text"
              value={movie.name}
              onChange={(e) => {
                setMovie({ ...movie, name: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="genres">
            <Form.Label>Genres</Form.Label>
            <Form.Control type="text" value={movie.genres} onChange={(e) => setMovie({ ...movie, genres: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageurl">
            <Form.Label>Image url</Form.Label>
            <Form.Control type="text" value={movie.image} onChange={(e) => setMovie({ ...movie, image: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="premiered">
            <Form.Label>Premiered date</Form.Label>
            <Form.Control
              type="date"
              value={movie.premiered}
              onChange={(e) =>
                setMovie({
                  ...movie,
                  premiered: e.target.value,
                })
              }
            />
          </Form.Group>
          <div className="buttons">
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="primary" onClick={() => Navigate("/movies")}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
