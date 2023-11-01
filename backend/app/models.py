from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

friendship = db.Table('friendship',
    db.Column('user_id1', db.Integer, db.ForeignKey('user.id')),
    db.Column('user_id2', db.Integer, db.ForeignKey('user.id'))

)

class User(db.Model):
    """
    User model for storing user-related data

    Attributes:
        - username: A unique string identifying the user.
        - email: A unique email address for the user.
        - password: A hashed password for secure authentication
        - profile_picture: A URL to the user's profile picture
        - reviews: A relationship to reviews made by a user
        - friends: A relationship to the user's friends

    Methods:
        - hash_password: Hashes a given password.
        - check_hash_password: Verifies a given password against the hashed one
        - save_to_db: Saves the user object to the database
        - update_profile_picture: Updates the user's profile picture.
        - add_friend: Adds a friend to the users friends list.
        - remove_friend: Removes a friend from the users friends list.
        - is_friend: Checks if a user is a friend.
    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    profile_picture = db.Column(db.String)
    reviews = db.relationship(
        'Review', backref='user', lazy='dynamic'
    )
    friends = db.relationship(
        'User',
        secondary=friendship,
        primaryjoin=(friendship.c.user_id1 == id),
        secondaryjoin=(friendship.c.user_id2 == id),
        backref=db.backref('followed_by', lazy='dynamic'),
        lazy='dynamic'
    )

    # hash the password
    def hash_password(self, original_password):
        return generate_password_hash(original_password)

    #check the password
    def check_hash_password(self, login_password):
        return check_password_hash(self.password, login_password)

    # save user to database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    #update users profile picture
    def update_profile_picture(self, new_picture_url):
        self.profile_picture = new_picture_url
        db.session.commit()

    # add a friend
    def add_friend(self, user):
        if not self.is_friend(user):
            self.friends.append(user)
            db.session.commit()

    # remove friend
    def remove_friend(self, user):
        if self.is_friend(user):
            self.friends.remove(user)
            db.session.commit()

    # check if someone is already a friend
    def is_friend(self, user):
        return user in self.friends

    # get all reviews made by a user
    def get_all_reviews(self):
        return self.reviews.all()

    # get all friends of a user
    def get_all_friends(self):
        return self.friends.all()


    # search for users by username
    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()


class Review(db.Model):
    """
    Review model for storing user reviews

    Attributes:
        - restaurant_name: The name of the restaurant thats being reviewed
        - dish: The dish that is being reviewed
        - comment: the actual review its self
        - rating: the rating given by the reviewer
        - date: date the review was posted
        - user_id: the id of the user who posted the review

    Methods:
        - save_to_db: saves the review object to the database
        - update_review: updates the review
        - delete_review: removes the review from the database

    """
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    restaurant_id = db.Column(db.Integer, db.ForeignKey('resaurant_id'), nullable=False)
    cuisine_id = db.Column(db.Integer, db.ForeignKey('cuisine_id'), nullable=False)

    # save review to database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    #update review in the database
    def update_review(self, new_data):
        for key, value in new_data.items():
            setattr(self, key, value)
        db.session.commit()

    # Delete review from database
    def delete_review(self):
        db.session.delete(self)
        db.session.commit()

class Cuisine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    reviews = db.relationship('Review', backref='cuisine', lazy='dynamic')

    def get_all_restaurants(self):
        return self.restaurants.all()

restaurant_cuisines = db.Table('restaurant_cuisines',
    db.Column('restaurant_id', db.Integer, db.ForeignKey('restaurant.id'), primary_key=True),
    db.Column('cuisine_id', db.Integer, db.ForeignKey('cuisine.id'), primary_key=True)
)

class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    address = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    zip_code = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    average_rating = db.Column(db.Float, default=0.0)
    review_count = db.Column(db.Integer, default=0)
    reviews = db.relationship(
        'Review', backref='restaurant', lazy='dynamic'
    )
    cuisine = db.relationship('Cuisine', secondary=restaurant_cuisines, lazy='subquery',
        backref=db.backref('restaurants', lazy=True))

    # method to add a cuisine to the restaurants list of cuisines
    def add_cuisine(self, cuisine):
        self.cuisine.append(cuisine)
        db.session.commit()



