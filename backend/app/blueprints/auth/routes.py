from flask import Flask, request, jsonify, make_response, g
from flask_jwt_extended import create_access_token
from app.models import User
from . import auth


def create_user_response(user, message, status_code):
    access_token = create_access_token(identity=user.id)
    response = make_response({
        "message": message,
        "user": {
            "id": user.id,
            "username": user.username,
            "profile_picture": user.profile_picture
        }
    }, status_code)
    response.set_cookie("access_token_cookie", access_token, httponly=True)
    return response

@auth.route('/api/register', methods=["POST"])
def register():
    try:
        data = request.json
        new_user = User(
            username=data['username'],
            email=data['email'],
            profile_picture=data.get('profile_picture', None)
        )
        new_user.password = new_user.hash_password(data['password'])
        new_user.save_to_db()
        return create_user_response(new_user, "Logged in successfully", 201)
    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({"message": "An error occurred"}), 500