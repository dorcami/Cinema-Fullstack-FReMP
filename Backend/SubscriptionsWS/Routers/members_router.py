#############################################################################
# Router for the members services
#############################################################################

from flask import Blueprint, request
from BLL.membersBL import Members_BL
from Routers.subscriptions_router import subscriptions_bl


members_bl = Members_BL()
members = Blueprint("members", __name__)

#############################################################################
# The routes
#############################################################################

# Get all members from database
@members.route("/", methods=["GET"])
def get_all_members():
    data = members_bl.get_all_members()
    return data


# Get one member from database
@members.route("/<id>", methods=["GET"])
def get_member(id):
    data = members_bl.get_member(id)
    return data


# Edit an existing member from the database
@members.route("/<id>", methods=["PUT"])
def edit_member(id):
    obj = request.json
    resp = members_bl.edit_member(id, obj)
    return resp


# Deletes an existing member from the database
@members.route("/<id>", methods=["DELETE"])
def delete_member(id):
    resp = members_bl.delete_member(id)
    resp = subscriptions_bl.delete_subscription(id)
    return resp


# Create a new member in the database
@members.route("/", methods=["POST"])
def create_member():
    obj = request.json
    resp = members_bl.create_member(obj)
    return resp
