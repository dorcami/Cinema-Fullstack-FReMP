import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "../App.css";

export default function SignUpComp() {
  const Navigate = useNavigate();
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let resp = await fetch("http://127.0.0.1:4000/users/signup/", {
      method: "PUT",
      body: JSON.stringify({ Username: username, Password: password }),
      headers: { "Content-Type": "application/json" },
    });
    let data = await resp.json();
    if (resp.status === 200) {
      Navigate("/signin");
    } else {
      setErr(data["error"]);
    }
  };

  return (
    <Card className="sign">
      <Card.Body>
        <Card.Title>Sign up</Card.Title>
        <Card.Text>
          Already registered?<br></br>
          <span className="link-primary">
            <Link to="/signin">Sign in</Link>
          </span>
          {err && <h6 style={{ color: "red" }}>{err}</h6>}
        </Card.Text>
        <Form onSubmit={(e) => submit(e)}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" id="username" placeholder="Enter username" onFocus={() => setErr("")} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" id="password" placeholder="Enter password" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign up
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
