#############################################################################
# Router for the members services
#############################################################################

from flask import Blueprint, request, make_response
from Routers.auth_router import auth_bl
import requests


members = Blueprint("members", __name__)

#############################################################################
# The routes
#############################################################################

# Get all members from database
@members.route("/", methods=["GET"])
@auth_bl.token_required
def get_all_members(user):
    if "view subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.get("http://127.0.0.1:5000/members/")
    return make_response(data.json(), 200)


# Get one member from database
@members.route("/<id>", methods=["GET"])
@auth_bl.token_required
def get_member(user, id):
    if "view subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.get("http://127.0.0.1:5000/members/" + id)
    return make_response(data.json()["resp"], 200)


# Edit an existing member from the database
@members.route("/<id>", methods=["PUT"])
@auth_bl.token_required
def edit_member(user, id):
    if "update subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    obj = request.json
    data = requests.put("http://127.0.0.1:5000/members/" + id, json=obj)
    return make_response(data.json()["resp"], 200)


# Deletes an existing member from the database
@members.route("/<id>", methods=["DELETE"])
@auth_bl.token_required
def delete_member(user, id):
    if "delete subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.delete("http://127.0.0.1:5000/members/" + id)
    return make_response(data.json()["resp"], 200)


# Create a new member in the database
@members.route("/", methods=["POST"])
@auth_bl.token_required
def create_member(user):
    if "create subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    obj = request.json
    data = requests.post("http://127.0.0.1:5000/members/", json=obj)
    return make_response(data.json()["resp"], 200)
