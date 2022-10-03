#############################################################################
# Router for the subscriptions services
#############################################################################

from flask import Blueprint, request, make_response
from Routers.auth_router import auth_bl
import requests


subscriptions = Blueprint("subscriptions", __name__)

#############################################################################
# The routes
#############################################################################

# Get all subscriptions from database
@subscriptions.route("/", methods=["GET"])
@auth_bl.token_required
def get_all_subscriptions(user):
    if "view subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.get("http://127.0.0.1:5000/subscriptions/")
    return make_response(data.json(), 200)


# Get one subscription from database
@subscriptions.route("/<id>", methods=["GET"])
@auth_bl.token_required
def get_subscription(user, id):
    if "view subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.get("http://127.0.0.1:5000/subscriptions/" + id)
    return make_response(data.json()["resp"], 200)


# Get one subscription from database (by member id) - provide member id and get subscription id
@subscriptions.route("/member/<id>", methods=["GET"])
@auth_bl.token_required
def get_subscription_by_member(user, id):
    if "view subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.get("http://127.0.0.1:5000/subscriptions/member/" + id)
    return make_response({"subscription": data.json()["resp"]}, 200)


# Get - return from db all movies that a member is subscribed to
@subscriptions.route("/movies/<id>", methods=["GET"])
@auth_bl.token_required
def get_movies_by_member(user, id):
    if "view subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.get("http://127.0.0.1:5000/subscriptions/movies/" + id)
    return make_response(data.json()["resp"], 200)


# Get - return from db all members that are subscribed to a given movie
@subscriptions.route("/members/<id>", methods=["GET"])
@auth_bl.token_required
def get_members_by_movie(user, id):
    if "view subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.get("http://127.0.0.1:5000/subscriptions/members/" + id)
    return make_response(data.json()["resp"], 200)


# Update - adds a specific movie to the movie array for a member:
######## provide member_id in the url and movie_id in the request
@subscriptions.route("/addmovie/<id>", methods=["PUT"])
@auth_bl.token_required
def edit_subscription(user, id):
    obj = request.json
    if "update subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.put("http://127.0.0.1:5000/subscriptions/addmovie/" + id, json=obj)
    return make_response(data.json()["resp"], 200)


# Delete - remove an existing subscription from the database
@subscriptions.route("/<id>", methods=["DELETE"])
@auth_bl.token_required
def delete_subscription(user, id):
    if "delete subscriptions" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.delete("http://127.0.0.1:5000/subscriptions/" + id)
    return make_response(data.json()["resp"], 200)
