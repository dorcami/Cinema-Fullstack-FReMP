import { Route, Routes } from "react-router-dom";
import CreateMemberComp from "../Subscriptions/Members/CreateMember";
import CreateMovieComp from "../Subscriptions/Movies/CreateMovie";
import EditMemberComp from "../Subscriptions/Members/EditMember";
import EditMovieComp from "../Subscriptions/Movies/EditMovie";
import EnhancedMemberComp from "../Subscriptions/Members/EnhancedMember";
import MembersComp from "../Subscriptions/Members/Members";
import AllMoviesComp from "../Subscriptions/Movies/Movies";
import MoviesManageComp from "../Subscriptions/MoviesManagement";
import SubscriptionsComp from "../Subscriptions/Subscriptions";
import CreateUserComp from "../Users/CreateUser";
import EditUserComp from "../Users/EditUser";
import UsersComp from "../Users/Users";
import UserManagementComp from "../Users/UsersManagement";
import MainComp from "./Main";
import BadCallComp from "./NotExists";
import SignInComp from "./Signin";
import SignUpComp from "./Signup";
import HomeComp from "./Home";
import Protected from "./Protected";
import { useSelector } from "react-redux";

export default function RoutesComp() {
  const storeData = useSelector((store) => store);
  return (
    <Routes>
      <Route path="/" element={<MainComp />}>
        <Route path="" element={<HomeComp />}></Route>
        <Route path="signin" element={<SignInComp />}></Route>
        <Route path="signup" element={<SignUpComp />}></Route>
        {/* Movies */}
        <Route element={<Protected permitted={storeData.current_user.Permissions.includes("view movies")} />}>
          <Route path="movies" element={<MoviesManageComp />}>
            <Route path="" element={<AllMoviesComp />}></Route>
            <Route path="new" element={<CreateMovieComp />}></Route>
            <Route path="edit/:id" element={<EditMovieComp />}></Route>
          </Route>
        </Route>
        {/* Subscriptions */}
        <Route element={<Protected permitted={storeData.current_user.Permissions.includes("view movies")} />}>
          <Route path="subscriptions" element={<SubscriptionsComp />}>
            <Route path="" element={<MembersComp />}></Route>
            <Route path=":id" element={<EnhancedMemberComp />}></Route>
            <Route path="new" element={<CreateMemberComp />}></Route>
            <Route path="edit/:id" element={<EditMemberComp />}></Route>
          </Route>
        </Route>
        {/* Users */}
        <Route element={<Protected permitted={storeData.current_user.isAdmin} />}>
          <Route path="users" element={<UserManagementComp />}>
            <Route path="" element={<UsersComp />}></Route>
            <Route path="new" element={<CreateUserComp />}></Route>
            <Route path="edit/:id" element={<EditUserComp />}></Route>
          </Route>
        </Route>
        <Route path="*" element={<BadCallComp />}></Route>
      </Route>
    </Routes>
  );
}
