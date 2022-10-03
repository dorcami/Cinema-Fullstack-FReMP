#############################################################################
# The Data Access Layer for the members web-service
#############################################################################

import requests
from pymongo import MongoClient

#############################################################################
# The Members DAL Class
#############################################################################


class MembersDB_DAL:
    def __init__(self) -> None:
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["Cinema-fullstack-app"]
        self.__collection = self.__db["Members"]

        # Initial import of the movies WS data
        self.__members_from_ws = requests.get(
            "https://jsonplaceholder.typicode.com/users"
        ).json()
        self.__members_to_db = [
            {
                "name": member["name"],
                "email": member["email"],
                "city": member["address"]["city"],
            }
            for member in self.__members_from_ws
        ]
        self.__collection.delete_many({})
        self.__collection.insert_many(self.__members_to_db)

    #############################################################################
    # DAL functions
    #############################################################################

    # Returns all the members as array of jsons
    def get_all_members(self):
        return list(self.__collection.find({}))

    # Returns a specific member from the DB as a json
    def get_member(self, id):
        return self.__collection.find_one({"_id": id})

    # Edit a specific member in the DB
    def edit_member(self, id, obj):
        resp = self.__collection.update_one({"_id": id}, {"$set": obj})
        return resp

    # Sends a new member as a json to the DB. obj is in the form of a json
    def create_member(self, obj):
        resp = self.__collection.insert_one(obj)
        return resp

    # Delete a specific member from the DB
    def delete_member(self, id):
        resp = self.__collection.delete_one({"_id": id})
        return resp.deleted_count  # how many were deleted
