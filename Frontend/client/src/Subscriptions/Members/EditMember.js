import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditMemberComp() {
  const params = useParams();
  const [member, setMember] = useState({});
  const Navigate = useNavigate();
  const storeData = useSelector((store) => store);

  // Get the member data when the comp is initialized
  useEffect(() => {
    const Get_data = async () => {
      let resp = await axios.get("http://127.0.0.1:4000/members/" + params.id, {
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      if (resp.status === 200) {
        let obj = {
          name: resp.data.name,
          email: resp.data.email,
          city: resp.data.city,
        };
        setMember(obj);
      } else {
        Navigate("/signin");
      }
    };
    Get_data();
    // eslint-disable-next-line
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    let resp = await axios.put("http://127.0.0.1:4000/members/" + params.id, member, {
      headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
    });
    if (resp.status === 200) {
      Navigate("/subscriptions/");
    } else {
      Navigate("/signin");
    }
  };

  return (
    <div className="">
      <h1>Edit member: {member.name}</h1>
      <Form onSubmit={(e) => submit(e)}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Member name</Form.Label>
          <Form.Control
            type="text"
            value={member.name || ""}
            onChange={(e) => {
              setMember({ ...member, name: e.target.value });
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="genres">
          <Form.Label>email</Form.Label>
          <Form.Control type="text" value={member.email || ""} onChange={(e) => setMember({ ...member, genres: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="imageurl">
          <Form.Label>city</Form.Label>
          <Form.Control type="text" value={member.city || ""} onChange={(e) => setMember({ ...member, image: e.target.value })} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="primary" onClick={() => Navigate("/subscriptions/")}>
          Cancel
        </Button>
      </Form>
    </div>
  );
}
