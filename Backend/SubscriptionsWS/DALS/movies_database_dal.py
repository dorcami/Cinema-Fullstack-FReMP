#############################################################################
# The Data Access Layer for the movies web-service
#############################################################################

import requests
from pymongo import MongoClient
from datetime import datetime

#############################################################################
# The movies DAL Class
#############################################################################


class MoviesDB_DAL:
    def __init__(self) -> None:
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["Cinema-fullstack-app"]
        self.__collection = self.__db["Movies"]

        # Import all the movies when the app starts
        self.__movies_from_ws = requests.get("https://api.tvmaze.com/shows").json()
        self.__movies_to_db = [
            {
                "name": movie["name"],
                "genres": movie["genres"],
                "image": movie["image"]["medium"],
                "premiered": datetime.fromisoformat(movie["premiered"]),
            }
            for movie in self.__movies_from_ws
        ]
        self.__collection.delete_many({})
        self.__collection.insert_many(self.__movies_to_db)

    #############################################################################
    # DAL functions
    #############################################################################

    # Returns all the movies as array of jsons
    def get_all_movies(self):
        return list(self.__collection.find({}))

    # Returns a specific movie from the DB as a json
    def get_movie(self, id):
        return self.__collection.find_one({"_id": id})

    # Edit a specific movie in the DB
    def edit_movie(self, id, obj):
        resp = self.__collection.update_one({"_id": id}, {"$set": obj})
        return resp

    # Sends a new movie as a json to the DB. obj is in the form of a json
    def create_movie(self, obj):
        resp = self.__collection.insert_one(obj)
        return resp

    # Delete a specific movie from the DB
    def delete_movie(self, id):
        resp = self.__collection.delete_one({"_id": id})
        return resp.deleted_count  # how many were deleted
