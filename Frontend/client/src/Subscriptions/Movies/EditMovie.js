import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditMovieComp() {
  const params = useParams();
  const [movie, setMovie] = useState({});
  const storeData = useSelector((store) => store);
  const Navigate = useNavigate();

  // Get the movie data when the comp is initialized
  useEffect(() => {
    const Get_data = async () => {
      let resp = await axios.get("http://127.0.0.1:4000/movies/" + params.id, {
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      if (resp.status === 200) {
        let obj = {
          name: resp.data.name,
          genres: resp.data.genres.join(", "),
          image: resp.data.image,
          premiered: resp.data.premiered.split(" ").slice(0, 1)[0],
        };
        setMovie(obj);
      } else {
        Navigate("/signin");
      }
    };
    Get_data();
    // eslint-disable-next-line
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    let obj = movie;
    obj["genres"] = obj["genres"].split(", ");
    let resp = await axios.put("http://127.0.0.1:4000/movies/" + params.id, obj, {
      headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
    });
    if (resp.status === 200) {
      Navigate("/movies/");
    } else {
      Navigate("/signin");
    }
  };

  return (
    <div className="">
      <h1>Edit Movie: {movie.name}</h1>
      <Form onSubmit={(e) => submit(e)}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Movie name</Form.Label>
          <Form.Control
            type="text"
            value={movie.name || ""}
            onChange={(e) => {
              setMovie({ ...movie, name: e.target.value });
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="genres">
          <Form.Label>Genres</Form.Label>
          <Form.Control type="text" value={movie.genres || ""} onChange={(e) => setMovie({ ...movie, genres: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="imageurl">
          <Form.Label>Image url</Form.Label>
          <Form.Control type="text" value={movie.image || ""} onChange={(e) => setMovie({ ...movie, image: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="premiered">
          <Form.Label>Premiered date</Form.Label>
          <Form.Control
            type="date"
            value={movie.premiered || ""}
            onChange={(e) =>
              setMovie({
                ...movie,
                premiered: e.target.value,
              })
            }
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="primary" onClick={() => Navigate("/movies")}>
          Cancel
        </Button>
      </Form>
    </div>
  );
}
