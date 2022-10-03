#############################################################################
# The Data Access Layer for the subscriptions database
#############################################################################


from pymongo import MongoClient
from bson import ObjectId

#############################################################################
# The subscriptions DAL Class
#############################################################################


class subscriptionsDB_DAL:
    def __init__(self) -> None:
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["Cinema-fullstack-app"]
        self.__collection = self.__db["subscriptions"]
        self.__collection.delete_many({})

    #############################################################################
    # DAL functions
    #############################################################################

    # Returns all the DB subscriptions as array of jsons
    def get_all_subscriptions(self):
        return list(self.__collection.find({}))

    # Returns a specific subscription from the DB as a json
    def get_subscription(self, id):
        return self.__collection.find_one({"_id": id})

    # Returns a specific subscription from the DB as a json by memeber id
    def get_subscription_by_member(self, id):
        return self.__collection.find_one({"member_id": id})

    # Get movies by member - returns all the movies that a member is subscribed to as array of jsons
    def get_movies_by_member(self, member_id):
        return list(
            self.__collection.aggregate(
                [
                    {"$match": {"member_id": ObjectId(member_id)}},
                    {"$unwind": {"path": "$movies"}},
                    {
                        "$lookup": {
                            "from": "Movies",
                            "localField": "movies.movie_id",
                            "foreignField": "_id",
                            "as": "res",
                        }
                    },
                    {"$unwind": {"path": "$res"}},
                    {
                        "$project": {
                            "_id": "$res._id",
                            "name": "$res.name",
                            "date": "$movies.date",
                        }
                    },
                ]
            )
        )

    # Get members by movie - Returns all the members that are subscribed to a movie as array of jsons
    def get_members_by_movie(self, movie_id):
        return list(
            self.__collection.aggregate(
                [
                    {"$match": {"movies.movie_id": movie_id}},
                    {"$unwind": {"path": "$movies"}},
                    {"$match": {"movies.movie_id": movie_id}},
                    {
                        "$lookup": {
                            "from": "Members",
                            "localField": "member_id",
                            "foreignField": "_id",
                            "as": "res",
                        }
                    },
                    {"$unwind": {"path": "$res"}},
                    {
                        "$project": {
                            "_id": "$res._id",
                            "name": "$res.name",
                            "date": "$movies.date",
                        }
                    },
                ]
            )
        )

    # Edit a specific subscription in the DB using its member id
    def add_subscribed_movie(self, member_id, obj):
        resp = self.__collection.update_one({"member_id": member_id}, {"$set": obj})
        return resp

    # Delete a movie from all the subscriptions that have it, using its movie id
    def delete_subscribed_movie(self, movie_id):
        return self.__collection.update_many(
            {}, {"$pull": {"movies": {"movie_id": movie_id}}}
        ).modified_count

    # Delete a specific subscription from the DB
    def delete_subscription(self, member_id):
        resp = self.__collection.delete_one({"member_id": member_id})
        return resp.deleted_count  # how many were deleted

    # Sends a new subscription as a json to the DB. obj is in the form of a json
    def create_subscription(self, obj):
        resp = self.__collection.insert_one(obj)
        return resp

    # checks for subscriptionname existance
    def check_if_subscription_exists(self, member_id):
        return self.__collection.find_one({"member_id": member_id})
