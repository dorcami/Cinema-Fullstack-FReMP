#############################################################################
# The Business Logic Layer for the users database and json files
#############################################################################


from DALS.users_database_dal import usersDB_DAL
from DALS.users_file_dal import usersFile_DAL
from DALS.permissions_file_dal import PermissionsFile_DAL
from datetime import datetime
import os, sys, json

# converts the id from string to an ObjectID object as it is in the DB
from bson import ObjectId

users_db = usersDB_DAL()
users_data_file = usersFile_DAL()
users_permissions_file = PermissionsFile_DAL()

#############################################################################
# The users BL Class
#############################################################################


class Users_BL:
    def __init__(self) -> None:
        self.__users_path = os.path.join(sys.path[0], "Data/users.json")
        self.__permissions_path = os.path.join(sys.path[0], "Data/permissions.json")

        # Create the admin user in both of the json files as the class initialized
        # It has to be done after the user is created in the db - to use the created ID
        with open(self.__users_path, "w") as f:
            json.dump(
                {
                    "users": [
                        {
                            "_id": str(users_db.get_all_users()[0]["_id"]),
                            "FirstName": "Admin",
                            "LastName": "Admin",
                            "CreatedDate": datetime.now()
                            .astimezone()
                            .strftime("%d/%m/%Y, %H:%M:%S"),
                            "SessionTimeOut": 30,
                        }
                    ]
                },
                f,
                indent=4,
            )
        with open(self.__permissions_path, "w") as f:
            json.dump(
                {
                    "users": [
                        {
                            "_id": str(users_db.get_all_users()[0]["_id"]),
                            "Permissions": [
                                "view subscriptions",
                                "create subscriptions",
                                "delete subscriptions",
                                "update subscriptions",
                                "view movies",
                                "create movies",
                                "delete movies",
                                "update movies",
                            ],
                        }
                    ]
                },
                f,
                indent=4,
            )

    #############################################################################
    # BL functions
    #############################################################################

    # Returns all the users as array of jsons using the DAL
    def get_all_users(self):
        users_details = users_data_file.read_file()
        users_permissions = users_permissions_file.read_file()
        usernames = users_db.get_all_users()
        users = []
        for user in users_details:
            obj = user
            for usr in users_permissions:
                if usr["_id"] == user["_id"]:
                    obj["Permissions"] = usr["Permissions"]
                    break
            for usr in usernames:
                if str(usr["_id"]) == user["_id"]:
                    obj["Username"] = usr["Username"]
                    break
            users.append(obj)
        return users

    # Returns a specific user as a json using the different DALs. Firstly checks if ID is valid.
    # You have to provide a user id (the id as in the database)
    def get_user(self, id):
        if not ObjectId.is_valid(id):
            return "The provided ID is invalid. Please try with a different ID"
        else:
            users_details = users_data_file.read_file()
            users_permissions = users_permissions_file.read_file()
            selected_user = {}
            # using break in the iterations for efficiency as opposed to filter
            for user in users_details:
                if user["_id"] == id:
                    selected_user = dict(user)
                    for user2 in users_permissions:
                        if user2["_id"] == id:
                            selected_user.update(user2)
                            break
                    break
            db_user = users_db.get_user(ObjectId(id))
            if db_user:
                selected_user.update(db_user)
                return selected_user
            else:
                return "No matching users were found in the DataBase, please try again with a different ID"

    # Edits a specific user (everything except password), Firstly checks if ID is valid.
    # You have to provide the user id (as in the db) and the updated fields required in a json object
    def edit_user(self, id, obj):
        if not ObjectId.is_valid(id):
            return "The provided ID is invalid. Please try with a different ID"
        else:
            if all(
                key in dict(obj).keys()
                for key in [
                    "FirstName",
                    "LastName",
                    "SessionTimeOut",
                    "Username",
                    "Permissions",
                ]
            ):
                users_details = list(users_data_file.read_file())
                users_permissions = list(users_permissions_file.read_file())
                successful_edits = 0
                # Firstly update the users details
                for i in range(len(users_details)):
                    # if the right object is found in the list update it
                    if users_details[i]["_id"] == id:
                        data = users_details.pop(i)
                        data["FirstName"] = obj["FirstName"]
                        data["LastName"] = obj["LastName"]
                        data["SessionTimeOut"] = obj["SessionTimeOut"]
                        # append the converted object to the original list
                        users_details.append(data)
                        users_data_file.write_to_file(users_details)
                        successful_edits += 1
                        break

                # Then, update the users permissions
                for i in range(len(users_permissions)):
                    # if the right object is found in the list update it
                    if users_permissions[i]["_id"] == id:
                        data = users_permissions.pop(i)
                        data["Permissions"] = obj["Permissions"]
                        # append the converted object to the original list
                        users_permissions.append(data)
                        users_permissions_file.write_to_file(users_permissions)
                        successful_edits += 1
                        break
                # Finally, change the db user (username only)
                changed_in_db = users_db.edit_user(
                    ObjectId(id), {"Username": obj["Username"]}
                ).matched_count
                if successful_edits + changed_in_db == 3:
                    return "User (id: " + id + ") updated successfully!"
                else:
                    return "No matching users in the database, please try again with a different ID"
            else:
                return "Some of the required fields for the update are missing, please try again"

    # Set new password for a user created by the admin
    # You have to provide a valid username and a password
    def set_user_password(self, obj):
        user = users_db.check_if_username_exists(obj["Username"])
        if user:
            if user["Password"] == "":
                users_db.edit_user(user["_id"], {"Password": obj["Password"]})
                return True
            else:
                return "The user has already set a password"
        else:
            return "No matching users were found in the dataBase, please try again with a different username"

    # Deletes a specific user, Firstly checks if ID is valid.
    # You have to provide a user id as in the db
    def delete_user(self, id):
        if not ObjectId.is_valid(id):
            return "The provided ID is invalid. Please try with a different ID"
        else:
            # 1: Delete the user from the details file
            details = list(users_data_file.read_file())
            new_details = list(filter(lambda x: x["_id"] != id, details))
            # 2: Delete the user from the permissions file
            permissions = list(users_permissions_file.read_file())
            new_permissions = list(filter(lambda x: x["_id"] != id, permissions))
            # If something was actually found and deleted -
            if len(details) != len(new_details) and len(permissions) != len(
                new_permissions
            ):
                users_data_file.write_to_file(new_details)
                users_permissions_file.write_to_file(new_permissions)
                # Now delete from db also
                users_db.delete_user(ObjectId(id))
                return "User (id: " + id + ") deleted successfully!"
            else:
                return "No matching users were found in the DataBase, please try again with a different ID"

    # Creates a new user with all the details and a default password
    # First creates it in the db and then in the json files
    # You have to provide a json object
    def create_user(self, obj):
        if all(
            key in dict(obj).keys()
            for key in [
                "FirstName",
                "LastName",
                "SessionTimeOut",
                "Username",
                "Permissions",
            ]
        ):
            username_exists = users_db.check_if_username_exists(obj["Username"])
            # If the username doesnt already exists, we can proceed creating the user
            if not username_exists:

                new_id = users_db.create_user(
                    {"Username": obj["Username"], "Password": ""}
                ).inserted_id
                users_details = list(users_data_file.read_file())
                users_permissions = list(users_permissions_file.read_file())
                new_details = {
                    "_id": str(new_id),
                    "FirstName": obj["FirstName"],
                    "LastName": obj["LastName"],
                    "CreatedDate": datetime.now()
                    .astimezone()
                    .strftime("%d/%m/%Y, %H:%M:%S"),
                    "SessionTimeOut": obj["SessionTimeOut"],
                }
                new_permissions = {
                    "_id": str(new_id),
                    "Permissions": obj["Permissions"],
                }
                users_details.append(new_details)
                users_permissions.append(new_permissions)
                users_data_file.write_to_file(users_details)
                users_permissions_file.write_to_file(users_permissions)
                return "New user (id: " + str(new_id) + ") created successfully!"
            else:
                return "The username already exists in the database!"
        else:
            return (
                "Some of the required fields for the user are missing, please try again"
            )
