from flask import Flask, request, jsonify, current_app
from app.blueprints.main import main
from app.models import User, Cuisine, Review
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.yelp_api import get_restaurants_by_location, get_restaurants_by_location_and_cuisine, get_restaurant_by_id, get_restaurant_by_name
from app import db
import logging

##### Fetch from yelp #####

@main.route('/restaurants', methods=['GET'])
@jwt_required()
def restaurants():
    # Get zipcode from the query parameter
    location = request.args.get('location')

    # Call the Yelp API function
    results = get_restaurants_by_location(location)

    # Check if there was an error in the results and return accordingly
    if 'error' in results:
        #Structure the error response for the client
        return jsonify({
            "error": results["error"],
            "message": "Failed to fetch data from Yelp API",
            "status_code": results["status_code"]
        }), results["status_code"]

    return jsonify(results)

@main.route('/search_restaurant', methods=['GET'])
@jwt_required()
def search_restaurant():
    # Extract name and zipcode from the query parameters
    name = request.args.get('name')
    location = request.args.get('location')

    #Check if both name and zipcode are provided
    if not name or not location:
        return jsonify({"error": "Missing required parameters"}), 400

    # Call the Yelp API function
    result = get_restaurant_by_name(name, location)

    # Check if the result contains an error
    if 'error' in result:
        return jsonify(result), 400

    #return the result
    return jsonify(result)

@main.route('/restaurants/friend-reviewed', methods=['GET'])
@jwt_required()
def restaurants_friend_reviewed():
    # Get zipcode from the query parameter
    location = request.args.get('location')

    # Call the yelp API function
    response = get_restaurants_by_location(location)

    # Extract the 'businesses' list from the response
    results = response.get('businesses', []) if isinstance(response, dict) else []

    # Extract the IDs from the results
    yelp_restaurant_ids = [restaurant['id'] for restaurant in results]
    print("Yelp API Restaurant IDs:", yelp_restaurant_ids)


    # Get the current users id and fetch friends reviews
    current_user_id = get_jwt_identity()
    user = User.find_by_id(current_user_id)
    friend_ids = [friend.id for friend in user.get_all_friends()]
    friend_reviews = Review.query.filter(Review.user_id.in_(friend_ids)).all()

    # Dictionary to store friend-reviewed restaurants with details
    friend_reviewed_restaurants = {}

    for review in friend_reviews:
        # Check if the restaurant is already added to avoid duplicate fetches
        if review.yelp_restaurant_id not in friend_reviewed_restaurants:
            restaurant_details = get_restaurant_by_id(review.yelp_restaurant_id)
            if restaurant_details:
                restaurant_details['friend_ratings'] = user.get_average_rating_by_friends(review.yelp_restaurant_id)
                friend_reviewed_restaurants[review.yelp_restaurant_id] = restaurant_details
    print("Friend-reviewed restaurants:", friend_reviewed_restaurants)
    return jsonify(list(friend_reviewed_restaurants.values()))

@main.route('/restaurants/<string:yelp_restaurant_id>/friend-avatars', methods=['GET'])
@jwt_required()
def get_friend_avatars_for_restaurant(yelp_restaurant_id):
    # Get the current users id
    current_user_id = get_jwt_identity()
    # Find the current user by id
    user = User.find_by_id(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # List of possible friend avatars
    avatars = ["Avocado", "Bread", "Broccoli", "Coffee", "Cupcake",
                "Hamburger", "Ramen", "Taco"]

    # Get the IDs of the user's friends
    friend_ids = []
    for friend in user.get_all_friends():
        friend_ids.append(friend.id)

    # Query the database for reviews with the given restaurant ID
    reviews = Review.query.filter(Review.yelp_restaurant_id == yelp_restaurant_id, Review.user_id.in_(friend_ids)).all()

    # Extract only the avatars from the reviews
    friend_avatar_map = {}
    for review in reviews:
        # Fetch the user who wrote the review
        review_author = User.find_by_id(review.user_id)
        # Use the persistent profile_picture as the avatar
        friend_avatar_map[review_author.id] = review_author.profile_picture

    friend_avatars = list(set(friend_avatar_map.values()))

    return jsonify(friend_avatars), 200

@main.route('/restaurants-cuisine', methods=['GET'])
@jwt_required()
def get_restaurants():
    location = request.args.get('location')
    cuisine = request.args.get('cuisine')

    if not location or not cuisine:
        return jsonify({"error": "Missing required parameters"})

    restaurants = get_restaurants_by_location_and_cuisine(location, cuisine)

    # Get the current users id and fetch friends reviews
    current_user_id = get_jwt_identity()
    user = User.find_by_id(current_user_id)
    friend_ids = [friend.id for friend in user.get_all_friends()]
    friend_reviews = Review.query.filter(Review.user_id.in_(friend_ids)).all()

    # Filter the results to only include restaurants that have been reviewed by friends
    reviewed_restaurant_ids = [review.yelp_restaurant_id for review in friend_reviews]
    filtered_results = [restaurant for restaurant in restaurants if restaurant['id'] in reviewed_restaurant_ids]

    # Add average rating to each restaurant
    for restaurant in filtered_results:
        restaurant['friend_ratings'] = user.get_average_rating_by_friends(restaurant['id'])

    return jsonify(filtered_results)

@main.route('/restaurants-by-friend-rating', methods=['GET'])
@jwt_required()
def get_restaurants_by_friend_rating():
    #Get the current users id
    current_user_id = get_jwt_identity()
    #Get the rating from the query parameter
    target_rating = int(request.args.get('rating'))

    #Fetch the user from the database
    user = User.find_by_id(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Use the method from the User model to fetch restaurant ids
    restaurant_ids = user.get_restaurants_by_friend_rating(target_rating)

    # Fetch the restaurants from the Yelp API
    restaurants = []
    for restaurant_id in restaurant_ids:
        restaurant = get_restaurant_by_id(restaurant_id)
        if 'error' not in restaurant:
            restaurant['friend_ratings'] = user.get_average_rating_by_friends(restaurant['id'])
            restaurants.append(restaurant)

    return jsonify(restaurants)

# Get restaurant by id from yelp
@main.route('/restaurants/<string:yelp_restaurant_id>', methods=['GET'])
@jwt_required()
def get_restaurant(yelp_restaurant_id):
    # Call the Yelp API function
    results = get_restaurant_by_id(yelp_restaurant_id)

    # Check if there was an error in the results and return accordingly
    if 'error' in results:
        # Structure the error response for the client
        return jsonify({
            "error": results["error"],
            "message": "Failed to fetch data from Yelp API",
            "status_code": results["status_code"]
        }), results["status_code"]

    return jsonify(results)

##### Cuisines ######

@main.route('/get-cuisines', methods=['GET'])
@jwt_required()
def get_cuisines():
    # Get all cuisines from database
    cuisines = Cuisine.query.all()

    cuisines_list = []

    for cuisine in cuisines:
        cuisine_data = {
            'id': cuisine.id,
            'name': cuisine.name,
            'yelp_alias': cuisine.yelp_alias
        }
        cuisines_list.append(cuisine_data)

    return jsonify(cuisines_list)


##### Friends #####

@main.route('/friends', methods=['GET'])
@jwt_required()
def get_friends():
    # Define the current user
    current_user_id = get_jwt_identity()
    current_user = User.find_by_id(current_user_id)

    # check to make sure the current user is real
    if not current_user:
        return jsonify({"message": "User not found"}), 404

    # Retreive all friends from the DB
    friends_list = current_user.get_all_friends()

    # Convert the friends_list to a JSON seriializable format
    friends_data = []
    for friend in friends_list:
        friend_data ={
            "id": friend.id,
            "username": friend.username,
            "profile_picture": friend.profile_picture,
            "following": current_user.is_friend(friend)
        }
        friends_data.append(friend_data)

    return jsonify(friends_data), 200

@main.route('/follow-friend', methods=['POST'])
@jwt_required()
def follow_friend():
    # Get the current users username from the jwt
    current_user_id = get_jwt_identity()
    # extract the data from the request
    data = request.get_json()

    # check that the data has the information we are looking for
    if not data or 'friend_username' not in data:
        return jsonify({'message': "Missing friend username in request"}), 400

    # define the user name of the friend we want to follow
    friend_username = data['friend_username'].strip()
    # fetch the data of the current user from the database
    current_user = User.find_by_id(current_user_id)
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
@jwt_required()
def remove_friend():
    # Get current users username from the jwt
    current_user_id = get_jwt_identity()
    # extract the data from the request
    data = request.get_json()

    # check that the data has the information we want
    if not data or 'friend_username' not in data:
        return jsonify({"message": "Missing friend user name in request"}), 400

    # define the username of the friend we want to unfollow
    friend_username = data['friend_username'].strip()
    #fetch the current user from the database
    current_user = User.find_by_id(current_user_id)
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
@jwt_required(optional=True) # optional jwt because we want to allow users to see other users profiles without being logged in
def find_friend(username):
    #Log the incoming request
    logging.info(f"Finding friend with username: {username}")
    # Define the current user ID using the JWT, if present
    current_user_id = get_jwt_identity()
    is_already_friend = False

    # Find the user by the provided username
    user_to_find = User.find_by_username(username)
    #Check if the user exisits
    if not user_to_find:
        logging.error(f"User {username} not found in database")
        return jsonify({"message": "User not found"}), 404

    # If a current userID is provided, check if the user is already a friend
    if current_user_id:
        current_user = User.find_by_id(current_user_id)
        if not current_user:
            return jsonify({"message": "User not found"}), 404
        # Check if the found user is already a friend
        is_already_friend = current_user.is_friend(user_to_find)

    # Structure response
    user_data = {
        "id": user_to_find.id,
        "username": user_to_find.username,
        "profile_picture": user_to_find.profile_picture,
        "following": is_already_friend
    }

    logging.info(f"User found: {user_data}")
    return jsonify(user_data), 200


##### Reviews #####
@main.route('/review/create', methods=['POST'])
@jwt_required()
def create_review():
    # Get the current users id
    current_user_id = get_jwt_identity()

    # Extract the data from the request
    data = request.json
    yelp_restaurant_id = data.get('yelp_restaurant_id')
    comment = data.get('comment')
    rating = data.get('rating')

    if not yelp_restaurant_id or not comment or rating is None:
        return jsonify({"message": "Missing data for creating a review"}), 400

    #Make sure the user exists
    user = User.find_by_id(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 400

    # Create a new review instance
    new_review = Review(
        yelp_restaurant_id=yelp_restaurant_id,
        comment=comment,
        rating=rating,
        user_id = current_user_id
    )

    #Save the new review to the database
    try:
        new_review.save_to_db()
        return jsonify({"message": "Review created successfully"}), 201
    except:
        return jsonify({"message": "Could not save review"}), 500

@main.route('/restaurants/<string:yelp_restaurant_id>/friend-reviews')
@jwt_required()
def get_reviews_for_restaurant(yelp_restaurant_id):
    # Get the current users id
    current_user_id = get_jwt_identity()
    # Find the current user by id
    user = User.find_by_id(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    # Get the IDs of the user's friends
    friend_ids = []
    for friend in user.get_all_friends():
        friend_ids.append(friend.id)
    # Query the database for reviews with the given restaurant ID
    reviews = Review.query.filter(Review.yelp_restaurant_id == yelp_restaurant_id, Review.user_id.in_(friend_ids)).all()

    # Serialize the review data
    reviews_data = []
    for review in reviews:
        # Fetch the user who wrote the review
        review_author = User.find_by_id(review.user_id)
        review_data = {
            "id": review.id,
            "yelp_restaurant_id": review.yelp_restaurant_id,
            "comment": review.comment,
            "rating": review.rating,
            "date": review.date.strftime("%Y-%m-%d %H:%M:%S"),
            "user_id": review.user_id,
            "username": review_author.username,
            "profile_picture": review_author.profile_picture if review_author.profile_picture else ""
        }
        reviews_data.append(review_data)

    # Return the list of reviews as a JSON response
    return jsonify(reviews_data), 200

@main.route('/reviews/<int:review_id>/update', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    # Get current users id
    current_user_id = get_jwt_identity()
    # Get the review
    review = Review.query.get(review_id)

    # Make ssure the review exists
    if not review:
        return jsonify({"message": "Review not found"}), 404

    # make sure the review belongs to the user
    if review.user_id != current_user_id:
        return jsonify({"message": "Unauthorized to update this review"})

    data = request.get_json()

    try:
        review.update_review(data)
        return jsonify({"message": "Review updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update review", "error": str(e)}), 500

@main.route('/reviews/<int:review_id>/delete', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    # Get current users id
    current_user_id = get_jwt_identity()
    # Get the review
    review = Review.query.get(review_id)

    # Make sure review exisits
    if not review:
        return jsonify({"message": "Review not found"}), 404

    # Make sure the review belongs to the user
    if review.user_id != current_user_id:
        return jsonify({"message": "Unauthorized to delete this review"}), 403

    try:
        review.delete_review()
        return({"message": "Review deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete review", "error": str(e)}), 500



