import os

class Config():
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    YELP_API_KEY = os.environ.get('YELP_API_KEY')

class TestingConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_TEST_URI')
    SECRET_KEY = os.environ.get('TEST_SECRET_KEY')