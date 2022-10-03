#############################################################################
# Router for the subscriptions services
#############################################################################

from flask import Blueprint, request
from BLL.subscriptionsBL import subscriptions_BL


subscriptions_bl = subscriptions_BL()
subscriptions = Blueprint("subscriptions", __name__)

#############################################################################
# The routes
#############################################################################

# Get all subscriptions from database
@subscriptions.route("/", methods=["GET"])
def get_all_subscriptions():
    data = subscriptions_bl.get_all_subscriptions()
    return data


# Get one subscription from database
@subscriptions.route("/<id>", methods=["GET"])
def get_subscription(id):
    data = subscriptions_bl.get_subscription(id)
    return data


# Get one subscription from database (by member id) - provide member id and get subscription id
@subscriptions.route("/member/<id>", methods=["GET"])
def get_subscription_by_member(id):
    data = subscriptions_bl.get_subscription_by_member(id)
    return data


# Get - return from db all movies that a member is subscribed to
@subscriptions.route("/movies/<id>", methods=["GET"])
def get_movies_by_member(id):
    data = subscriptions_bl.get_movies_by_member(id)
    return data


# Get - return from db all members that are subscribed to a given movie
@subscriptions.route("/members/<id>", methods=["GET"])
def get_members_by_movie(id):
    data = subscriptions_bl.get_members_by_movie(id)
    return data


# Update - adds a specific movie to the movie array for a member:
######## provide member_id in the url and movie_id in the request
@subscriptions.route("/addmovie/<id>", methods=["PUT"])
def edit_subscription(id):
    obj = request.json
    resp = subscriptions_bl.add_subscribed_movie(id, obj)
    return resp


# Update - Removes a specific movie from the movie array in all the database's subscriptions
@subscriptions.route("/delmovie/<id>", methods=["PUT"])
def delete_subscriptioned_movie(id):
    resp = subscriptions_bl.delete_subscribed_movie(id)
    return resp


# Delete - remove an existing subscription from the database
@subscriptions.route("/<id>", methods=["DELETE"])
def delete_subscription(id):
    resp = subscriptions_bl.delete_subscription(id)
    return resp
