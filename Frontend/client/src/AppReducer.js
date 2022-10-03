const AppReducer = (state = { current_user: { Username: "", isAdmin: false, Permissions: [], FirstName: "" } }, action) => {
  switch (action.type) {
    case "LogOutUser":
      return { ...state, current_user: { Username: "", isAdmin: false, Permissions: [], FirstName: "" } };

    case "LogInUser":
      return { ...state, current_user: action.payload };

    default:
      return state;
  }
};

export default AppReducer;
