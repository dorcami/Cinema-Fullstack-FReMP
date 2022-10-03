#############################################################################
# Router for the authentication methods
#############################################################################

from flask import Blueprint, request, make_response
from BLL.AuthBL import AuthBL

auth_bl = AuthBL()

auth = Blueprint("auth", __name__)

#############################################################################
# The routes
#############################################################################

# Post login data and receive a validation token
@auth.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]
    data = auth_bl.get_token(username, password)
    if data["token"] is None:
        return make_response({"users": "UNAUTHORIZED"}, 200)
    return make_response({"users": data}, 200)
