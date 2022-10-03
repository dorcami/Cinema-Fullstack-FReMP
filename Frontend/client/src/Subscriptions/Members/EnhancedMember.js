import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function EnhancedMemberComp() {
  const Navigate = useNavigate();
  const params = useParams();
  const storeData = useSelector((store) => store);
  const [member, setMember] = useState({ name: "", email: "", city: "" });
  useEffect(() => {
    const Get_data = async () => {
      let resp = await axios.get("http://127.0.0.1:4000/members/" + params.id, {
        headers: { "Content-Type": "application/json", "x-access-token": storeData.current_user.Token },
      });
      if (resp.status === 200) {
        setMember(resp.data);
      } else {
        Navigate("/signin");
      }
    };
    Get_data();
    //eslint-disable-next-line
  }, []);
  const delete_member = async (id) => {
    let resp = await axios.delete("http://127.0.0.1:4000/members/" + id, {
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
      <h3>{member.name}</h3>
      <h4>Email: {member.email}</h4>
      <h4>City: {member.city}</h4>
      <nav className="navbar navbar-light bg-light">
        <form className="form-inline">
          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => Navigate("/subscriptions/edit/" + member._id)}>
            Edit
          </button>
          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => delete_member(member._id)}>
            Delete
          </button>
        </form>
      </nav>
    </div>
  );
}
