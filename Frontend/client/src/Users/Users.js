import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserComp from "./User";

export default function UsersComp() {
  const [users, setUsers] = useState([]);
  const storeData = useSelector((store) => store);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  useEffect(() => {
    const Get_data = async () => {
      let resp = await fetch("http://127.0.0.1:4000/users/", {
        method: "GET",
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      let data = await resp.json();
      if (resp.status === 200) {
        setUsers(data["users"]);
      } else {
        dispatch({ type: "LogOutUser" });
        Navigate("/signin");
      }
    };
    Get_data();
    // eslint-disable-next-line
  }, []);

  const delete_user = async (id) => {
    let newusers = users.filter((user) => user._id !== id);
    setUsers(newusers);
    let resp = await axios.delete("http://127.0.0.1:4000/users/" + id, { headers: { "x-access-token": storeData.current_user.Token } });
    if (resp.status !== 200) {
      Navigate("/signin");
    }
  };

  return (
    <div className="">
      <Container>
        <Row className="cardscontainer">
          {users.map((user, index) => {
            return (
              <Col key={index} sm={6} md={4} lg={3}>
                <UserComp key={index} user={user} func={(data) => delete_user(data)} />;
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}
