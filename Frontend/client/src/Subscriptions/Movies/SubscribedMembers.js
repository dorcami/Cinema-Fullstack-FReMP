import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SubscribedMembesComp(props) {
  const [members, setMembers] = useState([]);
  const Navigate = useNavigate();
  const storeData = useSelector((store) => store);
  useEffect(() => {
    const Get_data = async () => {
      let resp = await axios.get("http://127.0.0.1:4000/subscriptions/members/" + props.movie.id, {
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      if (resp.status === 200) {
        setMembers(resp.data);
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
        <Modal.Title id="contained-modal-title-vcenter">Subscribed members for "{props.movie.name}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {members &&
          members.map((member) => {
            return (
              <h6 key={member._id}>
                <Link to={"/subscriptions/" + member._id}>{member.name}</Link>, subscribed in {new Date(member.date).toLocaleDateString()}
              </h6>
            );
          })}
        {members.length === 0 && <h6>None of the cinema's members is currently subscribed to the movie! </h6>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
