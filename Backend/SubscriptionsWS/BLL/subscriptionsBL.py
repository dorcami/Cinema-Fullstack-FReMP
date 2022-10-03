#############################################################################
# The Business Logic Layer for the subscriptions database
#############################################################################

from datetime import datetime
from DALS.subscriptions_database_dal import subscriptionsDB_DAL
from flask import jsonify

# converts the id from string to an ObjectID object as it is in the DB
from bson import ObjectId


subscriptions_data = subscriptionsDB_DAL()

#############################################################################
# The subscriptions BL Class
#############################################################################


class subscriptions_BL:
    def __init__(self) -> None:
        pass

    #############################################################################
    # BL functions
    #############################################################################

    # Returns all the DB subscriptions as array of jsons using the DAL
    def get_all_subscriptions(self):
        data = subscriptions_data.get_all_subscriptions()
        return jsonify(data)

    # Returns a specific subscription from the DB as a json using the DAL. Firstly checks if ID is valid.
    def get_subscription(self, id):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            data = subscriptions_data.get_subscription(ObjectId(id))
            if data:
                return jsonify({"resp": data})
            else:
                return {"resp": "No matching subscriptions were found in the Database"}

    # Returns a specific subscription from the DB as a json using the DAL. Firstly checks if ID is valid.
    def get_subscription_by_member(self, id):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            data = subscriptions_data.get_subscription_by_member(ObjectId(id))
            if data:
                return jsonify({"resp": data})
            else:
                return {"resp": "No matching subscriptions were found in the Database"}

    # Get - return from db all the movies that a given member is subscribed to
    def get_movies_by_member(self, id):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            data = subscriptions_data.get_movies_by_member(ObjectId(id))
            return jsonify({"resp": data})

    # Get - return from db all the members that are subscribed to a given movie
    def get_members_by_movie(self, id):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            data = subscriptions_data.get_members_by_movie(ObjectId(id))
            return jsonify({"resp": data})

    # Edits a specific subscription in the DB using the DAL, Firstly checks if ID is valid.
    # The only eligible edit is to add movies and dates to the movies array
    # starts by checking if theres a subscription for the member, otherwise creates it
    # then checks if the member was subscribed to the new movie, if not, adds it to the movie list
    def add_subscribed_movie(self, member_id, obj):
        if not ObjectId.is_valid(member_id):
            return {"resp": "Invalid member ID. Please try with a different ID"}
        elif not ObjectId.is_valid(obj["movie_id"]):
            return {"resp": "Invalid movie ID, please try again with a valid ID"}
        else:
            # if a subscription for the chosen member doesn't exist, create it first
            if not subscriptions_data.get_subscription_by_member(ObjectId(member_id)):
                self.create_subscription({"member_id": member_id})
            movies = list(
                subscriptions_data.get_subscription_by_member(ObjectId(member_id))[
                    "movies"
                ]
            )
            movies_ids = list(map(lambda x: str(x["movie_id"]), movies))
            if obj["movie_id"] in movies_ids:
                return {"resp": "The member has already subscribed for the movie!"}
            else:
                timestamp = datetime.now().astimezone()
                movie = {
                    "movie_id": ObjectId(obj["movie_id"]),
                    "date": timestamp,
                }
                movies.append(movie)
                subscriptions_data.add_subscribed_movie(
                    ObjectId(member_id), {"movies": movies}
                )
                return {
                    "resp": (
                        "subscription for member id: "
                        + member_id
                        + ") updated successfully!"
                    )
                }

    # Deletes a specific movie from all the subscribed members subscriptions in the DB using the DAL, Firstly checks if ID is valid.
    def delete_subscribed_movie(self, id):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            resp = subscriptions_data.delete_subscribed_movie(ObjectId(id))
            if resp > 0:
                return {"resp": str(resp) + " subscriptions deleted successfully!"}
            else:
                return {"resp": "No subscriptions in the Database for the movie"}

    # Deletes a specific subscription from the DB using the DAL, Firstly checks if ID is valid.
    def delete_subscription(self, id):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            resp = subscriptions_data.delete_subscription(ObjectId(id))
            if resp > 0:
                return {"resp": "subscription (id: " + id + ") deleted successfully!"}
            else:
                return {"resp": "No matching subscriptions were found in the Database"}

    # Sends a new subscription as a json to the DB using the DAL. obj is in the form of a json
    def create_subscription(self, obj):
        if not ObjectId.is_valid(obj["member_id"]):
            return {"resp": "Invalid member ID. Please try with a different ID"}
        elif "member_id" in obj:
            subscription_member_exists = (
                subscriptions_data.check_if_subscription_exists(obj["member_id"])
            )
            if not subscription_member_exists:
                obj["movies"] = []
                obj["member_id"] = ObjectId(obj["member_id"])
                resp = subscriptions_data.create_subscription(obj).inserted_id
                return {
                    "resp": "New subscription (id: "
                    + str(resp)
                    + ") created successfully!"
                }
            else:
                return {
                    "resp": "A subscription for this member already exists in the database!"
                }
        else:
            return {
                "resp": "The data provided is invalid, please make sure to enter a 'member_id' attribute"
            }
