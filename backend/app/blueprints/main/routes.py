from flask import Flask, request, jsonify
from app.blueprints.main import main
from flask_jwt_extended import jwt_required
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

@main.route('/follow-friend', methods=['POST'])
@jwt_required()
def follow_friend():
    pass