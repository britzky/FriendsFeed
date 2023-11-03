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

    return jsonify(results)