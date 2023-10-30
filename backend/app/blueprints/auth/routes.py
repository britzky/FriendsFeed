from flask import Flask, request, jsonify, make_response, g
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.schemas import UserSchema
from app.models import User
from . import auth


def create_user_response(user, message, status_code):
    """
    Creates an HTTP response with an embedded JWT token as an HttpOnly cookie

    Args:
        user (User): The User object containing user details.
        message (str): The message to include in the JSON response body.
        status_code (int): The HTTP status code for the response.

    Returns:
        response (Response): A Flask Response object containing a JSON payload
                            and an HttpOnly cookie with the JWT token.

    Side Effects:
        Sets an HttpOnly cookie in the response object

    Usage:
        Used in authentication routes to return a response to the client that
        includes both user details and a JWT token.
    """
    # generate the token
    access_token = create_access_token(identity=user.id)
    # create the response object
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


@auth.route('/register', methods=["POST"])
def register():
    """
    Route used to register new users. Expects a JSON payload with the fields
    'username', 'email', 'password', and optionally 'profile_picture'.

    Returns:
        response (Response): A Flask Response object containing a JSON payload
                            with the new user object, a success message, and
                            HTTP status code

    Errors:
        400: Bad request - when validation fails
        500: Internal Server Error - when an unknown error occurrs

    Example:
        POST /register
        {
            "username": "SantaClaus",
            "email": "NorthPole@example.com",
            "password": "IloveCookies"
            "profile_picture": "path/to/pic"
        }
    """
    # Initialize the User schema for input validation
    user_schema = UserSchema()

    try:
        # Validate and deserialize incoming JSON data against the User schema
        data = user_schema.load(request.json)
        # Create a new user object with the validated data
        new_user = User(
            username=data['username'],
            email=data['email'],
            profile_picture=data.get('profile_picture', None) # Optional field
        )
        # Hash the users password before stroing it
        new_user.password = new_user.hash_password(data['password'])
        # Save the new user to the database
        new_user.save_to_db()
        # Generate a response containing the new user's details, JWT token and HTTP status code
        return create_user_response(new_user, "Logged in successfully", 201)
    except ValidationError as err:
        # Return a 400 Bad Request error if validation fails
        return jsonify(err.messages), 400
    except Exception as e:
        # Log any unknown exceptions and return a 500 Internal Server Error
        print(f"Exception occurred: {e}")
        return jsonify({"message": "An error occurred"}), 500


@auth.route('/signin', methods=["POST"])
def signin():
    """
    Authenticates and signs in existing users.

    Args:
        None, but expects a JSON payload with 'username' and 'password'

    Returns:
        response (Response): A Flask Response object containing a JSON payload
                            with either an error message or the user's details,
                            and an HttpOnly cookie with a JWT token if authentication
                            is successful. The HTTP status code is also set
                            accordingly

    Behavior:
        1. Retrieves and validates incoming JSON data from the request.
        2. Checks for the existence of a user with the given username.
        3. Validates the password if the user exists.
        4. Generates and returns a JWT token via an HttpOnly cookie if
        successful.

    Errors:
        Returns relevant error messages and HTTP status codes for bad
        requests, failed validation, and internal server errors.

    Usage:
        Called when an existing user attempts to sign in.
    """

    try:
        # Parse the JSON payload from the client request
        user_data = request.get_json()

        # Validate the JSON payload
        if not user_data:
            return jsonify({"message": "Bad Request"}), 400

        # Extract the username and password from the payload
        username = user_data.get('username')
        password = user_data.get('password')

        # Check if a user exists with the provided username
        user = User.query.filter_by(username=username).first()

        # Handle the case where a user doesn't exist
        if not user:
            return jsonify({"message": "Invalid username/email or password"})

        # Verify that the provided password matches the stored hash
        if not user.check_hash_password(password):
            return jsonify({"message": "Invalid username/email or password"})
        # Create and return a response with JWT token
        return create_user_response(user, "Logged in successfully", 200)
    except Exception as e:
        # Handle any unexpected errors
        print(f"Exception occurred: {e}")
        return jsonify({"message": "An error occurred"}), 500

@auth.route('/verify-token', methods=["GET"])
@jwt_required()
def verify_token():
    """
    Route used for when frontend needs to verify if a user is still logged in
    or grab the username and profile picture to display in different places
    """
    # initialize the current users id
    current_user_id = get_jwt_identity()

    # Fetch the user from the database using the ID
    current_user = User.query.get(current_user_id)

    # Return an error if the current user doesnt exist
    if not current_user:
        return jsonify({"message": "User not found"}), 404

    # Return an object containing the user name and profile picture stored for the current user
    return jsonify({
        "logged_in_as": current_user.username,
        "profile_picture": current_user.profile_picture
    }), 200