#############################################################################

# The subscriptions REST api server

#############################################################################

import json
from datetime import datetime
from flask import Flask
from bson import ObjectId
from Routers.subscriptions_router import subscriptions
from Routers.members_router import members
from Routers.movies_router import movies
from flask_cors import CORS


# A custom encoder to handle the objectid that the mongodb provides
# it basically treats it like a string instead of an object
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


# The flask application declaration
subscriptions_app = Flask(__name__)

subscriptions_app.register_blueprint(subscriptions, url_prefix="/subscriptions")
subscriptions_app.register_blueprint(movies, url_prefix="/movies")
subscriptions_app.register_blueprint(members, url_prefix="/members")
subscriptions_app.json_encoder = JSONEncoder


# A setting that prevents cors problems with missing url slashes
CORS(subscriptions_app)
subscriptions_app.url_map.strict_slashes = False

subscriptions_app.run(port=5000)
