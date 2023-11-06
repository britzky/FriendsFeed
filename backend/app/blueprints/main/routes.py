from flask import Flask, request, jsonify
from app.blueprints.main import main
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.yelp_api import get_restaurants_by_zipcode

@main.route('/restaurants', methods=['GET'])
@jwt_required()
def restaurants():
    # Get zipcode from the query parameter
    zipcode = request.args.get('zipcode')

    # Call the Yelp API function
    results = get_restaurants_by_zipcode(zipcode)

    # Check if there was an error in the results and return accordingly
    if 'error' in results:
        #Structure the error response for the client
        return jsonify({
            "error": results["error"],
            "message": "Failed to fetch data from Yelp API",
            "status_code": results["status_code"]
        }), results["status_code"]

    return jsonify(results)

@main.route('/friends', methods=['GET'])
@jwt_required
def get_friends():
    # Define the current user
    current_user_username = get_jwt_identity()
    current_user = User.find_by_username(current_user_username)

    # check to make sure the current user is real
    if not current_user:
        return jsonify({"message": "User not found"}), 404

    # Retreive all friends from the DB
    friends_list = current_user.get_all_friends()

    # Convert the friends_list to a JSON seriializable format
    friends_data = []
    for friend in friends_list:
        friend_data ={
            "username": friend.username,
            "profile_picture": friend.profile_picture
        }
        friends_data.append(friend_data)

    return jsonify(friends_data), 200

@main.route('/follow-friend', methods=['POST'])
@jwt_required()
def follow_friend():
    # Get the current users username from the jwt
    current_user_username = get_jwt_identity()
    # extract the data from the request
    data = request.get_json()

    # check that the data has the information we are looking for
    if not data or 'friend_username' not in data:
        return jsonify({'message': "Missing friend username in request"}), 400

    # define the user name of the friend we want to follow
    friend_username = data['friend_username']
    # fetch the data of the current user from the database
    current_user = User.find_by_username(current_user_username)
    # fetch the data of the friend user from the database
    friend_user = User.find_by_username(friend_username)

    # check if friend user is valid
    if not friend_user:
        return jsonify({"message": "Friend user not found"}), 404

    # Check to make sure the friendship isnt already established
    if current_user.is_friend(friend_user):
        return jsonify({"message": "Already friends"}), 409

    # follow the friend user
    try:
        current_user.add_friend(friend_user)
        return jsonify({
            "message": f"You are now following {friend_username}",
            "following": True
        }), 200
    except Exception as e:
        return jsonify({"message": "Could not follow friend", "error": str(e)}), 500

@main.route('/remove-friend', methods=['DELETE'])
@jwt_required
def remove_friend():
    # Get current users username from the jwt
    current_user_username = get_jwt_identity()
    # extract the data from the request
    data = request.get_json()

    # check that the data has the information we want
    if not data or 'friend_username' not in data:
        return jsonify({"message": "Missing friend user name in request"}), 400

    # define the username of the friend we want to unfollow
    friend_username = data['friend_username']
    #fetch the current user from the database
    current_user = User.find_by_username(current_user_username)
    # fetch the friend user from the database
    friend_user = User.find_by_username(friend_username)

    #check if friend user is valid
    if not friend_user:
        return jsonify({"message": "Friend user not found"}), 404

    # check if the friend user is not friends already
    if not current_user.is_friend(friend_user):
        return jsonify({"message": "You aren't friends with this user yet"}), 400

    # unfollow the friend user
    try:
        current_user.remove_friend(friend_user)
        return jsonify({
            "message": f"You are no longer following {friend_username}",
            "following": False
        }), 200
    except Exception as e:
        return jsonify({"message": "Could not unfollow friend", "error": str(e)}), 500

@main.route('/find-friend/<string:username>', methods=['GET'])
@jwt_required()
def find_friend(username):
    # Define the current user using the jwt
    current_user_username = get_jwt_identity()
    # Define the current user
    current_user = User.find_by_username(current_user_username)

    # Find the user by the provided username
    user_to_find = User.find_by_username(username)
    #Check if the user exisits
    if not user_to_find:
        return jsonify({"message": "User not found"}), 404

    # Check if the found user is already a friend
    is_already_friend = current_user.is_friend(user_to_find)

    # Structure response
    user_data = {
        "username": user_to_find.username,
        "profile_picture": user_to_find.profile_picture,
        "following": is_already_friend
    }

    return jsonify(user_data), 200


