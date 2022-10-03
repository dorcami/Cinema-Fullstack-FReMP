#############################################################################
# The Data Access Layer for the users file
#############################################################################
import json, os, sys


#############################################################################
# The users files DAL Class
#############################################################################


class usersFile_DAL:

    # Initialy, creates the admin user's details in the file
    def __init__(self) -> None:
        self.__path = os.path.join(sys.path[0], "Data/users.json")

    #############################################################################
    # DAL functions
    #############################################################################

    # Read the json file
    def read_file(self):
        with open(self.__path, "r") as f:
            data = json.load(f)
        return data["users"]

    # Write to the json file
    def write_to_file(self, obj):
        with open(self.__path, "w") as f:
            data = json.dump({"users": obj}, f, indent=4)
