#############################################################################
# The Business Logic Layer for the Movies database
#############################################################################

from DALS.movies_database_dal import MoviesDB_DAL
from flask import jsonify
from datetime import datetime

# converts the id from string to an ObjectID object as it is in the DB
from bson import ObjectId


movies_data = MoviesDB_DAL()

#############################################################################
# The movies BL Class
#############################################################################


class Movies_BL:
    def __init__(self) -> None:
        pass

    #############################################################################
    # BL functions
    #############################################################################

    # Returns all the DB movies as array of jsons using the DAL
    def get_all_movies(self):
        data = movies_data.get_all_movies()
        return jsonify(data)

    # Returns a specific movie from the DB as a json using the DAL. Firstly checks if ID is valid.
    def get_movie(self, id):
        if not ObjectId.is_valid(id):
            return {
                "resp": "The provided ID is invalid. Please try with a different ID"
            }
        else:
            data = movies_data.get_movie(ObjectId(id))
            if data:
                return jsonify({"resp": data})
            else:
                return {"resp": "No matching movies were found in the DataBase"}

    # Edits a specific movie in the DB using the DAL, Firstly checks if ID is valid.
    def edit_movie(self, id, obj):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            if all(
                key in dict(obj).keys()
                for key in [
                    "name",
                    "genres",
                    "image",
                    "premiered",
                ]
            ):
                new_movie = obj
                new_movie["premiered"] = datetime.fromisoformat(obj["premiered"])
                if movies_data.edit_movie(ObjectId(id), new_movie).matched_count:
                    return {"resp": "movie (id: " + id + ") updated successfully!"}
                else:
                    return {"resp": "No matching movies were found in the DataBase"}
            else:
                return {"resp": "You haven't provided all the required fields"}

    # Deletes a specific movie from the DB using the DAL, Firstly checks if ID is valid.
    def delete_movie(self, id):
        if not ObjectId.is_valid(id):
            return "The provided ID is invalid. Please try with a different ID"
        else:
            if movies_data.delete_movie(ObjectId(id)):
                return "movie (id: " + id + ") deleted successfully!"
            else:
                return "No matching movies were found in the DataBase, please try again with a different ID"

    # Sends a new movie as a json to the DB using the DAL. obj is in the form of a json
    def create_movie(self, obj):
        resp = movies_data.create_movie(obj).inserted_id
        return {"resp": "New movie (id: " + str(resp) + ") created successfully!"}
