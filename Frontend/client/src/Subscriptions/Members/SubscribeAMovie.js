import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SubscribeAMovieComp(props) {
  const [optionsList, setOptions] = useState([]);
  const [selected_movie, setSelected] = useState();
  const storeData = useSelector((store) => store);

  useEffect(() => {
    const Get_data = async () => {
      // firstly, get all the movies
      let movies = await axios.get("http://127.0.0.1:4000/movies/", {
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      // then, get the already subscribed movies list in order to filter them
      let subscribed_movies = await axios.get("http://127.0.0.1:4000/subscriptions/movies/" + props.id, {
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      if (subscribed_movies.status === 200 && movies.status === 200) {
        // finally, filter the movies that the member already watched
        let watched_movies = [];
        if (typeof subscribed_movies.data == "object") {
          subscribed_movies.data.forEach((movie) => {
            watched_movies.push(movie["_id"]);
          });
        }
        const options = [];
        movies.data.forEach((movie) => {
          if (!watched_movies.includes(movie._id)) {
            options.push({ value: movie._id, label: movie.name });
          }
        });
        setOptions(options);
      } else {
        Navigate("/signin");
      }
    };
    Get_data();
    //eslint-disable-next-line
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    let resp = await axios.put(
      "http://127.0.0.1:4000/subscriptions/addmovie/" + props.id,
      { movie_id: selected_movie },
      { headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token } }
    );
    if (resp.status === 200) {
      let options = optionsList.filter((movie) => movie["value"] !== selected_movie);
      setOptions(options);
      props.message("You have successfuly subscribed!");
      props.show(false);
    } else {
      Navigate("/signin");
    }
  };

  return (
    <div className="">
      <h6>Subscribe to a new movie</h6>
      <form onSubmit={(e) => submit(e)}>
        <Select
          aria-labelledby="aria-label"
          placeholder="Select a movie"
          inputId="aria-example-input"
          name="aria-live-color"
          options={optionsList}
          onChange={(e) => setSelected(e.value)}
        />
        <br></br>
        <Button variant="primary" type="submit">
          Subscribe
        </Button>
      </form>
    </div>
  );
}
