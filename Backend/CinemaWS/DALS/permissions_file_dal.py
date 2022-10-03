#############################################################################
# The Data Access Layer for the permissions file
#############################################################################

import json, os, sys

#############################################################################
# The permissions file DAL Class
#############################################################################


class PermissionsFile_DAL:

    # Initialy, creates the admin's permissions in the users array
    def __init__(self) -> None:
        self.__path = os.path.join(sys.path[0], "Data/permissions.json")

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
