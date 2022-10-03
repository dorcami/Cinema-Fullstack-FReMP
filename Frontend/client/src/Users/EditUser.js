import "../App.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function EditUserComp() {
  const params = useParams();
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const storeData = useSelector((store) => store);

  // Get the user data when the comp is initialized
  useEffect(() => {
    const Get_data = async () => {
      let resp = await fetch("http://127.0.0.1:4000/users/" + params.id, {
        method: "GET",
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      if (resp.status === 200) {
        let data = await resp.json();
        let obj = {
          FirstName: data["user"].FirstName,
          LastName: data["user"].LastName,
          Username: data["user"].Username,
          SessionTimeOut: data["user"].SessionTimeOut,
          CreatedDate: data["user"].CreatedDate,
          ViewSubs: data["user"].Permissions.includes("view subscriptions") ? true : false,
          CreateSubs: data["user"].Permissions.includes("create subscriptions") ? true : false,
          UpdateSubs: data["user"].Permissions.includes("update subscriptions") ? true : false,
          DeleteSubs: data["user"].Permissions.includes("delete subscriptions") ? true : false,
          ViewMovies: data["user"].Permissions.includes("view movies") ? true : false,
          UpdateMovies: data["user"].Permissions.includes("update movies") ? true : false,
          CreateMovies: data["user"].Permissions.includes("create movies") ? true : false,
          DeleteMovies: data["user"].Permissions.includes("delete movies") ? true : false,
        };
        setUser(obj);
      } else {
        dispatch({ type: "LogOutUser" });
        Navigate("/signin");
      }
    };
    Get_data();
    // eslint-disable-next-line
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    let permissions_list = [];
    Object.keys(user).forEach((key) => {
      if (user[key] === true) {
        permissions_list.push(
          key
            .replace("Subs", "Subscriptions")
            .split(/(?=[A-Z])/)
            .join(" ")
            .toLowerCase()
        );
      }
    });
    let obj = user;
    obj["Permissions"] = permissions_list;
    let resp = await axios.put("http://127.0.0.1:4000/users/" + params.id, obj, { headers: { "x-access-token": storeData.current_user.Token } });
    if (resp.status === 200) {
      Navigate("/users/");
    } else {
      Navigate("/signin");
    }
  };

  const check = (e) => {
    switch (e.target.id) {
      case "ViewSubs":
        //if View Subs was false and checked true, change only it
        if (!user.ViewSubs) {
          setUser({ ...user, ViewSubs: !user.ViewSubs });
          //if View Subs was true and checked false - check false also all other
        } else {
          setUser({
            ...user,
            ViewSubs: !user.ViewSubs,
            CreateSubs: false,
            UpdateSubs: false,
            DeleteSubs: false,
          });
        }
        break;
      case "UpdateSubs":
        if (user.ViewSubs) {
          setUser({ ...user, UpdateSubs: !user.UpdateSubs });
        } else {
          setUser({
            ...user,
            ViewSubs: !user.ViewSubs,
            UpdateSubs: !user.UpdateSubs,
          });
        }
        break;
      case "CreateSubs":
        if (user.ViewSubs) {
          setUser({ ...user, CreateSubs: !user.CreateSubs });
        } else {
          setUser({
            ...user,
            ViewSubs: !user.ViewSubs,
            CreateSubs: !user.CreateSubs,
          });
        }
        break;
      case "DeleteSubs":
        if (user.ViewSubs) {
          setUser({ ...user, DeleteSubs: !user.DeleteSubs });
        } else {
          setUser({
            ...user,
            ViewSubs: !user.ViewSubs,
            DeleteSubs: !user.DeleteSubs,
          });
        }
        break;
      case "ViewMovies":
        //if View Movies was false and checked true, change only it
        if (!user.ViewMovies) {
          setUser({ ...user, ViewMovies: !user.ViewMovies });
          //if View Movies was true and checked false - check false also all other
        } else {
          setUser({
            ...user,
            ViewMovies: !user.ViewMovies,
            CreateMovies: false,
            UpdateMovies: false,
            DeleteMovies: false,
          });
        }
        break;
      case "UpdateMovies":
        if (user.ViewMovies) {
          setUser({ ...user, UpdateMovies: !user.UpdateMovies });
        } else {
          setUser({
            ...user,
            ViewMovies: !user.ViewMovies,
            UpdateMovies: !user.UpdateMovies,
          });
        }
        break;
      case "CreateMovies":
        if (user.ViewMovies) {
          setUser({ ...user, CreateMovies: !user.CreateMovies });
        } else {
          setUser({
            ...user,
            ViewMovies: !user.ViewMovies,
            CreateMovies: !user.CreateMovies,
          });
        }
        break;
      case "DeleteMovies":
        if (user.ViewMovies) {
          setUser({ ...user, DeleteMovies: !user.DeleteMovies });
        } else {
          setUser({
            ...user,
            ViewMovies: !user.ViewMovies,
            DeleteMovies: !user.DeleteMovies,
          });
        }
        break;
      default:
    }
  };

  return (
    <div className="">
      <h1>Edit {user.FirstName + " " + user.LastName}</h1>
      <Form onSubmit={(e) => submit(e)}>
        <Form.Group className="mb-3" controlId="fname">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={user.FirstName || ""}
            onChange={(e) => {
              setUser({ ...user, FirstName: e.target.value });
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lname">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" value={user.LastName || ""} onChange={(e) => setUser({ ...user, LastName: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={user.Username || ""} onChange={(e) => setUser({ ...user, Username: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="sessionto">
          <Form.Label>Session Time Out</Form.Label>
          <Form.Control
            type="text"
            value={user.SessionTimeOut || ""}
            onChange={(e) =>
              setUser({
                ...user,
                SessionTimeOut: Number(e.target.value),
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="date">
          <Form.Label>Created date</Form.Label>
          <Form.Control type="text" placeholder="" value={user.CreatedDate || ""} disabled />
        </Form.Group>
        <Form.Label>Permissions</Form.Label>
        <br></br>
        <input type="checkbox" id="ViewSubs" checked={user.ViewSubs || false} onChange={(e) => check(e)}></input>
        View Subs
        <br></br>
        <input type="checkbox" id="UpdateSubs" checked={user.UpdateSubs || false} onChange={(e) => check(e)}></input>
        Edit Subs
        <br></br>
        <input type="checkbox" id="CreateSubs" checked={user.CreateSubs || false} onChange={(e) => check(e)}></input>
        Create Subs
        <br></br>
        <input type="checkbox" id="DeleteSubs" checked={user.DeleteSubs || false} onChange={(e) => check(e)}></input>
        Delete Subs
        <br></br>
        <input type="checkbox" id="ViewMovies" checked={user.ViewMovies || false} onChange={(e) => check(e)}></input>
        View Movies
        <br></br>
        <input type="checkbox" id="UpdateMovies" checked={user.UpdateMovies || false} onChange={(e) => check(e)}></input>
        Edit Movies
        <br></br>
        <input type="checkbox" id="CreateMovies" checked={user.CreateMovies || false} onChange={(e) => check(e)}></input>
        Create Movies
        <br></br>
        <input type="checkbox" id="DeleteMovies" checked={user.DeleteMovies || false} onChange={(e) => check(e)}></input>
        Delete Movies
        <br></br>
        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="primary" onClick={() => Navigate("/users")}>
          Cancel
        </Button>
      </Form>
    </div>
  );
}
