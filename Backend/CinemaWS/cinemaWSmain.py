#############################################################################

# The main cinema REST api server

#############################################################################

import json
from flask import Flask
from bson import ObjectId
from Routers.users_router import users
from Routers.auth_router import auth
from Routers.movies_router import movies
from Routers.subscriptions_router import subscriptions
from Routers.members_router import members
from flask_cors import CORS

# A custom encoder to handle the objectid that the mongodb provides
# it basically treats it like a string instead of an object
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


# The flask application declaration
cinema_app = Flask(__name__)

cinema_app.register_blueprint(users, url_prefix="/users")
cinema_app.register_blueprint(auth, url_prefix="/auth")
cinema_app.register_blueprint(movies, url_prefix="/movies")
cinema_app.register_blueprint(subscriptions, url_prefix="/subscriptions")
cinema_app.register_blueprint(members, url_prefix="/members")
cinema_app.json_encoder = JSONEncoder


# A setting that prevents cors problems with missing url slashes
CORS(cinema_app)
cinema_app.url_map.strict_slashes = False

cinema_app.run(port=4000)
