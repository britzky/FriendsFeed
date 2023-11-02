from flask import current_app
import requests

def get_restaurants_by_zipcode(zipcode):
    # Base URL for the Yelp Fusion API
    api_url = "https://api.yelp.com/v3/businesses/search"

    # Get the API key from the environment variable
    api_key = current_app.config['YELP_API_KEY']

    # set up the headers with the API key
    headers = {
        "Authorization": f"Bearer {api_key}"
    }

    # Define parameters for the request
    params = {
        "location": zipcode,
        "categories": "restaurants",
        "limit": 20
    }

    # Make the GET request to the Yelp API
    response = requests.get(api_url, headers=headers, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        restaurants = response.json()
        return restaurants
    else:
        return {"error": "Request failed", "status_code": response.status_code}