import axios from "axios";
import { useEffect, useState } from "react";
import MovieComp from "./Movie";
import Form from "react-bootstrap/Form";
import { Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import Spinner from "react-bootstrap/Spinner";

function load() {
  return (
    <div className="centered buttons">
      <Spinner animation="grow" />
      <Spinner animation="grow" />
      <Spinner animation="grow" />
    </div>
  );
}

export default function AllMoviesComp() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const storeData = useSelector((store) => store);
  const [search_phrase, setSearchPhrase] = useState("");
  useEffect(() => {
    const Get_data = async () => {
      let resp = await axios.get("http://127.0.0.1:4000/movies/", {
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      setLoading(false);
      if (resp.status === 200) {
        setMovies(resp.data);
      } else {
        Navigate("/signin");
      }
    };
    Get_data();
    //eslint-disable-next-line
  }, []);

  const delete_movie = async (id) => {
    let new_movies = movies.filter((movie) => movie._id !== id);
    setMovies(new_movies);
    let resp = await axios.delete("http://127.0.0.1:4000/movies/" + id, {
      headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
    });
    if (resp.status !== 200) {
      Navigate("/signin");
    }
  };

  return (
    <div className="">
      <Form.Control
        className="searchbox centered"
        type="text"
        placeholder="Search for movies"
        onChange={(e) => setSearchPhrase(e.target.value.toLowerCase())}
      />
      <Container>
        <Row className="cardscontainer">
          {loading && load()}
          {movies.map((movie, index) => {
            if (movie.name.toLowerCase().includes(search_phrase)) {
              return (
                <Col key={index} sm={6} md={4} lg={3}>
                  <MovieComp movie={movie} func={(data) => delete_movie(data)} />
                </Col>
              );
            }
            return null;
          })}
        </Row>
      </Container>
    </div>
  );
}
