import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function HomeComp() {
  const Navigate = useNavigate();
  const storeData = useSelector((store) => store);
  useEffect(() => {
    if (!storeData.current_user.Username) {
      Navigate("/signin");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <h1 className="centered" style={{ "margin-top": "100px" }}>
        Movie of the month
      </h1>
      <div id="card_container" data-offset="2">
        <div class="pg">
          <img alt="aqua" src="https://pluspng.com/img-png/aquaman-png-aquaman-png-clipart-666.png" />
        </div>
        <div id="card">
          <div class="shine"></div>
          <div class="text-block">
            <h1>
              Aquaman <small>(2018)</small>
            </h1>
            <h3>Action | Adventure</h3>
            <p>
              Arthur Curry learns that he is the heir to the underwater kingdom of Atlantis, and must step forward to lead his people and be a hero to
              the world.
            </p>
            <button>Watch Trailer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
