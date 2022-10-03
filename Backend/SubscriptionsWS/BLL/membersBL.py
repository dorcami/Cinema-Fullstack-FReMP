#############################################################################
# The Business Logic Layer for the Members database
#############################################################################

from DALS.members_database_dal import MembersDB_DAL
from flask import jsonify

# converts the id from string to an ObjectID object as it is in the DB
from bson import ObjectId


members_data = MembersDB_DAL()

#############################################################################
# The members BL Class
#############################################################################


class Members_BL:
    def __init__(self) -> None:
        pass

    #############################################################################
    # BL functions
    #############################################################################

    # Returns all the DB members as array of jsons using the DAL
    def get_all_members(self):
        data = members_data.get_all_members()
        return jsonify(data)

    # Returns a specific member from the DB as a json using the DAL. Firstly checks if ID is valid.
    def get_member(self, id):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            data = members_data.get_member(ObjectId(id))
            if data:
                return jsonify({"resp": data})
            else:
                return {"resp": "No matching members were found in the Database"}

    # Edits a specific member in the DB using the DAL, Firstly checks if ID is valid.
    def edit_member(self, id, obj):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            if members_data.edit_member(ObjectId(id), obj).matched_count:
                return {"resp": "member (id: " + id + ") updated successfully!"}
            else:
                return {"resp": "No matching members were found in the Database"}

    # Deletes a specific member from the DB using the DAL, Firstly checks if ID is valid.
    def delete_member(self, id):
        if not ObjectId.is_valid(id):
            return {"resp": "Invalid ID. Please try with a different ID"}
        else:
            if members_data.delete_member(ObjectId(id)):
                return {"resp": "member (id: " + id + ") deleted successfully!"}
            else:
                return {"resp": "No matching members were found in the Database"}

    # Sends a new member as a json to the DB using the DAL. obj is in the form of a json
    def create_member(self, obj):
        resp = members_data.create_member(obj).inserted_id
        return {"resp": "New member (id: " + str(resp) + ") created successfully!"}
