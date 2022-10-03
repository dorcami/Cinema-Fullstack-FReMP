import { Navigate, Outlet } from "react-router-dom";

export default function Protected(props) {
  return props["permitted"] ? <Outlet /> : <Navigate to="/" />;
}
