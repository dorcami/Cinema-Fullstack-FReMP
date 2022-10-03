#############################################################################
# The Business Logic Layer for authentication proccess
#############################################################################

from functools import wraps
from flask import request, jsonify
import jwt
import datetime
from BLL.UsersBL import Users_BL, users_db
from bson import ObjectId

#############################################################################
# The authentication BL Class
#############################################################################


class AuthBL:
    def __init__(self) -> None:
        self.__key = "server_key"
        self.__algoritm = "HS256"
        self.__users_bl = Users_BL()

    #############################################################################
    # BL functions
    #############################################################################

    def get_token(self, username, password):
        user_id = self.__check_user_exists(username, password)
        token = None
        user = None
        if user_id is not None:
            user = self.__users_bl.get_user(user_id)
            token = jwt.encode(
                {
                    "userid": user_id,
                    "exp": datetime.datetime.utcnow()
                    + datetime.timedelta(minutes=user["SessionTimeOut"]),
                },
                self.__key,
                self.__algoritm,
            )
        return {"token": token, "user": user}

    def __verify_token(self, token):
        try:
            data = jwt.decode(token, self.__key, self.__algoritm)
            user = self.__users_bl.get_user(data["userid"])
            # proceed only if a user was found (object) and not an error sentence
            if type(user) != str:
                return user
            return False
        except:
            return False

    def __check_user_exists(self, username, password):
        user = users_db.verify_credentials(username, password)
        if user:
            return str(user["_id"])
        return None

    def token_required(self, f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if "x-access-token" in request.headers:
                token = request.headers["x-access-token"]
            if not token:
                return jsonify({"message": "Token is missing"}), 401
            user = self.__verify_token(token)
            if not user:
                return jsonify({"message": "Token is invalid"}), 401
            return f(user, *args, **kwargs)

        return decorated
