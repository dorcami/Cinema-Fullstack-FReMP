#############################################################################
# Router for the users methods. Declarations for the desired actions.
#############################################################################

from flask import Blueprint, request, make_response
from BLL.UsersBL import Users_BL
from Routers.auth_router import auth_bl

users_bl = Users_BL()
users = Blueprint("users", __name__)

#############################################################################
# The routes
#############################################################################

# Get: all users from database
@users.route("/", methods=["GET"])
@auth_bl.token_required
def get_all_users(user):
    if user["Username"] != "admin":
        return make_response({"error": "You are not authorized"}, 401)
    data = users_bl.get_all_users()
    return make_response({"users": data}, 200)


# Get: one user from database
@users.route("/<id>", methods=["GET"])
@auth_bl.token_required
def get_user(user, id):
    if user["Username"] != "admin":
        return make_response({"error": "You are not authorized"}, 401)
    data = users_bl.get_user(id)
    return make_response({"user": data}, 200)


# Update: an existing user from the database
@users.route("/<id>", methods=["PUT"])
@auth_bl.token_required
def edit_user(user, id):
    if user["Username"] != "admin":
        return make_response({"error": "You are not authorized"}, 401)
    obj = request.json
    resp = users_bl.edit_user(id, obj)
    return make_response({"response": resp}, 200)


# Update: set a password for a new user
@users.route("/signup/", methods=["PUT"])
def set_user_password():
    obj = request.json
    resp = users_bl.set_user_password(obj)
    if resp == True and type(resp) != str:
        return make_response({"success": "password was changed successfully"}, 200)
    else:
        return make_response({"error": resp}, 500)


# Delete: an existing user from the database
@users.route("/<id>", methods=["DELETE"])
@auth_bl.token_required
def delete_user(user, id):
    if user["Username"] != "admin":
        return make_response({"error": "You are not authorized"}, 401)
    resp = users_bl.delete_user(id)
    return resp


# Create: a new user in the database
@users.route("/", methods=["POST"])
@auth_bl.token_required
def create_user(user):
    if user["Username"] != "admin":
        return make_response({"error": "You are not authorized"}, 401)
    obj = request.json
    resp = users_bl.create_user(obj)
    return resp
