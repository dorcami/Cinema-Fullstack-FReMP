#############################################################################
# Router for the movies services
#############################################################################

from flask import Blueprint, request
from BLL.moviesBL import Movies_BL
from Routers.subscriptions_router import subscriptions_bl

movies_bl = Movies_BL()
movies = Blueprint("movies", __name__)

#############################################################################
# The routes
#############################################################################

# Get all movies from database (returns a list)
@movies.route("/", methods=["GET"])
def get_all_movies():
    data = movies_bl.get_all_movies()
    return data


# Get one movie from database (returns a json)
@movies.route("/<id>", methods=["GET"])
def get_movie(id):
    data = movies_bl.get_movie(id)
    return data


# Edit an existing movie from the database
@movies.route("/<id>", methods=["PUT"])
def edit_movie(id):
    obj = request.json
    resp = movies_bl.edit_movie(id, obj)
    return resp


# Deletes a movie from both the movie database and all subscriptioned members subscriptions
###### Provide a movie id only, in the url
@movies.route("/<id>", methods=["DELETE"])
def delete_movie(id):
    movies_resp = movies_bl.delete_movie(id)
    subs_resp = subscriptions_bl.delete_subscribed_movie(id)
    return {"resp": [movies_resp, subs_resp]}


# Create a new movie in the database
@movies.route("/", methods=["POST"])
def create_movie():
    obj = request.json
    resp = movies_bl.create_movie(obj)
    return resp
