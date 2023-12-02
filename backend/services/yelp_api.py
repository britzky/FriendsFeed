from flask import current_app
from requests_cache import CachedSession
import requests
import logging



def get_restaurants_by_location(location):
    yelp_session = CachedSession(
        cache_name='yelp_cache',
        backend='sqlalchemy',
        expire_after=3600,
        connection=current_app.config['SQLALCHEMY_DATABASE_URI']
    )

    # Base URL for the Yelp Fusion API
    api_url = f"https://api.yelp.com/v3/businesses/search?location={location}&categories=restaurants"

    # Get the API key from the environment variable
    api_key = current_app.config['YELP_API_KEY']

    # set up the headers with the API key
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    # log weather the response was from cache or yelp
    if response.from_cache:
        logging.info(f"Response for {location} from cache")
    else:
        logging.info(f"Response for {location} from Yelp")

    # Make the GET request to the Yelp API
    response = yelp_session.get(api_url, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        restaurants = response.json()
        return restaurants
    else:
        logging.error(f"Yelp API request faild: {response.text}")
        return {"error": "Request failed", "status_code": response.status_code}


def get_restaurants_by_location_and_cuisine(location, cuisine):
        # Base URL for the Yelp Fusion API
    api_url = f"https://api.yelp.com/v3/businesses/search?location={location}&categories={cuisine}"

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
        data = response.json()
        restaurants = data.get('businesses', [])
        return restaurants
    else:
        logging.error(f"Yelp API request faild: {response.text}")
        return {"error": "Request failed", "status_code": response.status_code}

# Get restaurants name and zipcode
def get_restaurant_by_name(name, location):
    # Base URL for the Yelp Fusion API
    api_url = f"https://api.yelp.com/v3/businesses/search?term={name}&location={location}&categories=restaurants"

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
        restaurant = response.json()
        return restaurant
    else:
        logging.error(f"Yelp API request faild: {response.text}")
        return {"error": "Request failed", "status_code": response.status_code}

# get restaurant by id from yelp
def get_restaurant_by_id(yelp_restaurant_id):
    yelp_session = CachedSession(
    cache_name='yelp_cache',
    backend='sqlalchemy',
    expire_after=3600,
    connection=current_app.config['SQLALCHEMY_DATABASE_URI']
    )
    # Base URL for the Yelp Fusion API
    api_url = f"https://api.yelp.com/v3/businesses/{yelp_restaurant_id}"

    # Get the API key from the environment variable
    api_key = current_app.config['YELP_API_KEY']

    # set up the headers with the API key
    headers = {
        "Authorization": f"Bearer {api_key}"
    }

    # Make the GET request to the Yelp API
    response = yelp_session.get(api_url, headers=headers)

    # log weather the response was from cache or yelp
    if response.from_cache:
        logging.info(f"Response for {yelp_restaurant_id} from cache")
    else:
        logging.info(f"Response for {yelp_restaurant_id} from Yelp")


    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        restaurant = response.json()
        return restaurant
    else:
        logging.error(f"Yelp API request faild: {response.text}")
        return {"error": "Request failed", "status_code": response.status_code}

