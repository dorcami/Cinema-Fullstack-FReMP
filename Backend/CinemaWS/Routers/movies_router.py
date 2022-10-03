#############################################################################
# Router for the movies services
#############################################################################

from flask import Blueprint, request, make_response
from Routers.auth_router import auth_bl
import requests


movies = Blueprint("movies", __name__)

#############################################################################
# The routes
#############################################################################

# Get all movies from database
@movies.route("/", methods=["GET"])
@auth_bl.token_required
def get_all_movies(user):
    if "view movies" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.get("http://127.0.0.1:5000/movies/")
    return make_response(data.json(), 200)


# Get one movie from database
@movies.route("/<id>", methods=["GET"])
@auth_bl.token_required
def get_movie(user, id):
    if "view movies" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    data = requests.get("http://127.0.0.1:5000/movies/" + id)
    return make_response(data.json()["resp"], 200)


# Edit an existing movie from the database
@movies.route("/<id>", methods=["PUT"])
@auth_bl.token_required
def edit_movie(user, id):
    if "update movies" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    obj = request.json
    resp = requests.put("http://127.0.0.1:5000/movies/" + id, json=obj)
    return make_response(resp.json()["resp"], 200)


# Deletes a movie from both the movie database and all subscriptioned members subscriptions
###### Provide a movie id only, in the url
@movies.route("/<id>", methods=["DELETE"])
@auth_bl.token_required
def delete_movie(user, id):
    if "delete movies" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    resp = requests.delete("http://127.0.0.1:5000/movies/" + id)
    return make_response(resp.json()["resp"], 200)


# Create a new movie in the database
@movies.route("/", methods=["POST"])
@auth_bl.token_required
def create_movie(user):
    if "create movies" not in user["Permissions"]:
        return make_response({"error": "You are not authorized"}, 401)
    obj = request.json
    resp = requests.post("http://127.0.0.1:5000/movies/", json=obj)
    return make_response(resp.json()["resp"], 200)
