import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreateMemberComp() {
  const storeData = useSelector((store) => store);
  const [member, setMember] = useState({
    name: "",
    email: "",
    city: "",
  });
  const Navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    let resp = await axios.post("http://127.0.0.1:4000/members/", member, {
      headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
    });
    if (resp.status === 200) {
      Navigate("/subscriptions/");
    } else {
      Navigate("/signin");
    }
  };

  return (
    <Card className="sign">
      <Card.Body>
        <Card.Title>Add a member</Card.Title>
        <Form onSubmit={(e) => submit(e)}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Member name</Form.Label>
            <Form.Control
              type="text"
              value={member.name}
              onChange={(e) => {
                setMember({ ...member, name: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="genres">
            <Form.Label>email</Form.Label>
            <Form.Control type="text" value={member.email} onChange={(e) => setMember({ ...member, email: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageurl">
            <Form.Label>city</Form.Label>
            <Form.Control type="text" value={member.city} onChange={(e) => setMember({ ...member, city: e.target.value })} />
          </Form.Group>
          <div className="buttons">
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="primary" onClick={() => Navigate("/subscriptions")}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
