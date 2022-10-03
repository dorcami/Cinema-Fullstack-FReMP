import "../App.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function SignInComp() {
  const [err, setErr] = useState("");
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const submit = async (e) => {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let resp = await fetch("http://127.0.0.1:4000/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: username, password: password }),
      headers: { "Content-Type": "application/json" },
    });
    let data = await resp.json();
    if (resp.status === 200 && data["users"] !== "UNAUTHORIZED") {
      let is_admin = false;
      if (data["users"]["user"]["Username"] === "admin") {
        is_admin = true;
      }
      dispatch({
        type: "LogInUser",
        payload: {
          Token: data["users"]["token"],
          FirstName: data["users"]["user"]["FirstName"],
          Permissions: data["users"]["user"]["Permissions"],
          Username: data["users"]["user"]["Username"],
          isAdmin: is_admin,
        },
      });
      Navigate("/");
    } else {
      setErr("Username and password didn't match, please try again");
    }
  };

  return (
    <Card className="sign">
      <Card.Body>
        <Card.Title>Sign in</Card.Title>
        <Card.Text>
          Not registered yet?
          <br></br>
          <span className="link-primary">
            <Link to="/signup">Sign up</Link>
          </span>
          {err && <h6 style={{ color: "red" }}>{err}</h6>}{" "}
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
            Sign in
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
