from flask import current_app
import requests
import logging

def get_restaurants_by_zipcode(zipcode):
    # Base URL for the Yelp Fusion API
    api_url = f"https://api.yelp.com/v3/businesses/search?location={zipcode}&categories=restaurants"

    # Get the API key from the environment variable
    api_key = current_app.config['YELP_API_KEY']

    # set up the headers with the API key
    headers = {
        "Authorization": f"Bearer {api_key}"
    }

    # Make the GET request to the Yelp API
    response = requests.get(api_url, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        restaurants = response.json()
        return restaurants
    else:
        logging.error(f"Yelp API request faild: {response.text}")
        return {"error": "Request failed", "status_code": response.status_code}


def get_restaurants_by_zipcode_and_cuisine(zipcode, cuisine):
        # Base URL for the Yelp Fusion API
    api_url = f"https://api.yelp.com/v3/businesses/search?location={zipcode}&categories={cuisine}"

    # Get the API key from the environment variable
    api_key = current_app.config['YELP_API_KEY']

    # set up the headers with the API key
    headers = {
        "Authorization": f"Bearer {api_key}"
    }

    # Make the GET request to the Yelp API
    response = requests.get(api_url, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        restaurants = response.json()
        return restaurants
    else:
        logging.error(f"Yelp API request faild: {response.text}")
        return {"error": "Request failed", "status_code": response.status_code}