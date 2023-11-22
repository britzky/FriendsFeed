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
    location = db.Column(db.String, nullable=False)
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

    # update users zipcode
    def update_zipcode(self, new_zipcode):
        self.zipcode = new_zipcode
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

    # get all reviews made by friends
    def get_all_reviews_by_friends(self):
        return Review.query.filter(Review.user_id.in_([friend.id for friend in self.get_all_friends()]))


    # search for users by username
    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter(cls.username.ilike(username)).first()

    # Search for users by if
    @classmethod
    def find_by_id(cls, _id):
        return cls.query.get(int(_id))

    def get_average_rating_by_friends(self, yelp_restaurant_id):
        """
        Calculate the average rating of a given restaurant by Yelp ID from
        friends' reviews

        parameters: yelo_restaurant_id: Yelp ID of the restaurant
        return: The average rating as a float
        """
        # initialize a variable to hold all friend ids
        friend_ids = []

        # loop through all friends and add them to the friend_ids list
        for friend in self.get_all_friends():
            friend_ids.append(friend.id)

        # use the friend_ids list to filter reviews
        average_rating = db.session.query(
            db.func.avg(Review.rating).label('average')
        ).filter(
            Review.user_id.in_(friend_ids),
            Review.yelp_restaurant_id == yelp_restaurant_id
        ).scalar()

        return average_rating or 0

class Review(db.Model):
    """
    Review model for storing user reviews

    Attributes:
        - yelp_restaurant_id: The unique identifier for the restaurant on Yelp
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
    yelp_restaurant_id = db.Column(db.String, nullable=False)
    comment = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

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

    # get all of the reviews of a certain rating
    @classmethod
    def get_reviews_by_rating(cls, rating):
        return cls.query.filter_by(rating=rating).all()


class Cuisine(db.Model):
    """
    Cuisine model for storing available types of cuisines from Yelp

    Attributes:
        - id: Unique ID for the cuisine entry
        - name: Readable name of the cuisine type
        - yelp_alias: The corresponding Yelp alias for the cuisine type

    Methods:
        - save_to_db: Saves the cuisine object to the database
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    yelp_alias = db.Column(db.String, nullable=False)






