import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import MemberComp from "./Member";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function MembersComp() {
  const storeData = useSelector((store) => store);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const Get_data = async () => {
      let resp = await axios.get("http://127.0.0.1:4000/members/", {
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      if (resp.status === 200) {
        setMembers(resp.data);
      } else {
        Navigate("/signin");
      }
    };
    Get_data();
    //eslint-disable-next-line
  }, []);

  const delete_member = async (id) => {
    let new_member = members.filter((member) => member._id !== id);
    setMembers(new_member);
    let resp = await axios.delete("http://127.0.0.1:4000/members/" + id, {
      headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
    });
    if (resp.status !== 200) {
      Navigate("/signin");
    }
  };

  return (
    <Container>
      <Row className="cardscontainer">
        {members.map((member, index) => {
          return (
            <Col key={index} sm={6} md={6} lg={3}>
              <MemberComp key={index} member={member} func={(data) => delete_member(data)} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
