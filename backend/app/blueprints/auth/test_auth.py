import os
import json
import unittest
from app import db
from dotenv import load_dotenv
from app.blueprints.auth import auth as auth_blueprint
from app.models import User
from flask_jwt_extended import JWTManager
from flask import Flask
load_dotenv(".flaskenv")


class TestAuth(unittest.TestCase):
    def setUp(self):
        app = Flask(__name__)
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_TEST_URI')
        app.config['SECRET_KEY'] = os.environ.get('TEST_SECRET_KEY')
        app.config['TESTING']= True

        app.register_blueprint(auth_blueprint)

        db.init_app(app)
        jwt = JWTManager(app)
        self.app = app

        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def test_register(self):
        """Make sure users can be added to the database"""
        data = json.dumps({
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword"
        })
        headers = {'Content-Type': 'application/json'}

        response = self.client.post("/register", data=data, headers=headers)
        self.assertEqual(response.status_code, 201)

    # function to create a new test user
    def create_test_user(self):
        new_user = User(username="testuser2", email="test@example.com", password="testpassword2")
        new_user.password = new_user.hash_password(new_user.password)
        db.session.add(new_user)
        db.session.commit()

    # function to create a valid token
    def get_valid_token(self):
        self.create_test_user()
        data = json.dumps({"username": "testuser2", "password": "testpassword2"})
        headers = {'Content-Type': 'application/json'}
        response = self.client.post("/signin", data=data, headers=headers)
        decoded_response = json.loads(response.data.decode('utf-8'))
        print("Decoded response: ", decoded_response)
        return decoded_response['access_token']

    # Test for successful sign in
    def test_signin_success(self):
        """Make sure signing with the correct credentials works properly"""
        self.create_test_user()
        data = json.dumps({
            "username": "testuser2",
            "password": "testpassword2"
        })
        headers = {'Content-Type': 'application/json'}
        response = self.client.post("/signin", data=data, headers=headers)
        self.assertEqual(response.status_code, 200)

    def test_signin_non_exisiting_user(self):
        """Make sure the user needs to be registered before logging in"""

        data = json.dumps({
            "username": "doesNotExsist",
            "password": "testpassword"
        })
        headers = {'Content-Type': 'application/json'}
        response = self.client.post("/signin", data=data, headers=headers)
        self.assertEqual(response.status_code, 400)

    def test_signin_incorrect_password(self):
        """Make sure a user needs to enter the right password to be authenticated"""
        self.create_test_user()
        data = json.dumps({
            "username": "testuser2",
            "password": "wrongpassword"
        })
        headers = {'Content-Type': 'application/json'}
        response = self.client.post("/signin", data=data, headers=headers)
        self.assertEqual(response.status_code, 400)

    def test_route_protected(self):
        """Test that a user needs a token to access a protected route"""
        response = self.client.get("/verify-token")
        self.assertEqual(response.status_code, 401)

    def test_with_valid_token(self):
        """Test if the route works with a valid token"""
        token = self.get_valid_token()
        headers = {'Authorization': f'Bearer {token}' }
        response = self.client.get("verify-token", headers=headers)
        self.assertEqual(response.status_code, 200)

    def test_with_invalid_token(self):
        """Test if the route returns a 401 with an invalid token"""
        headers = {'Authorization': 'Bearer invalid_token'}
        response = self.client.get("/verify-token", headers=headers)
        print("Response Data: ", response.data)
        self.assertIn(response.status_code, [401, 422])

    def tearDown(self):
        print("Tearing down setup...")
        db.session.remove()
        print("Session removed")
        db.engine.dispose()
        print("Engine disposed")
        db.drop_all()
        print("Dropped all tables")
        self.app_context.pop()
        print("Popped application context")



if __name__ == "__main__":
    unittest.main()