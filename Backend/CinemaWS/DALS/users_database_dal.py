#############################################################################
# The Data Access Layer for the users database
#############################################################################

from pymongo import MongoClient

#############################################################################
# The users database DAL Class
#############################################################################


class usersDB_DAL:
    def __init__(self) -> None:
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["Cinema-fullstack-app"]
        self.__collection = self.__db["Users"]
        self.__collection.delete_many({})
        self.__collection.insert_one({"Username": "admin", "Password": "admin"})

    #############################################################################
    # DAL functions
    #############################################################################

    # Returns all the DB users as array of jsons
    def get_all_users(self):
        return list(self.__collection.find({}))

    # Returns a specific user from the DB as a json
    def get_user(self, id):
        return self.__collection.find_one({"_id": id})

    # Edit a specific user in the DB
    def edit_user(self, id, obj):
        resp = self.__collection.update_one({"_id": id}, {"$set": obj})
        return resp

    # Delete a specific user from the DB
    def delete_user(self, id):
        resp = self.__collection.delete_one({"_id": id})
        return resp.deleted_count  # how many were deleted

    # Sends a new user as a json to the DB. obj is in the form of a json
    def create_user(self, obj):
        resp = self.__collection.insert_one(obj)
        return resp

    # Checks if a username exists in the db
    def check_if_username_exists(self, name):
        return self.__collection.find_one({"Username": name})

    # Login a user - verify that username and password match
    def verify_credentials(self, username, password):
        return self.__collection.find_one({"Username": username, "Password": password})
