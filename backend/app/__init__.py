from flask import Flask, g, request
from config import Config, TestingConfig
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
import logging

db = SQLAlchemy()
migrate = Migrate()

def create_app(testing=False):
    app = Flask(__name__)

    if testing:
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(Config)

    logging.basicConfig(level=logging.DEBUG)
    app.logger.setLevel(logging.DEBUG)

    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    jwt = JWTManager(app)

    db.init_app(app)
    migrate.init_app(app, db)

    from app.blueprints.auth import auth
    from app.blueprints.main import main

    app.register_blueprint(auth)
    app.register_blueprint(main)

    CORS(app, origins=["http://localhost:5173", "https://friendsfeed.netlify.app", "https://main--friendsfeed.netlify.app"],
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization",],
        )

    return app