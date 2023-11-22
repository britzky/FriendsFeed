from marshmallow import Schema, fields, validate, validates, ValidationError

class UserSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    location = fields.Str(required=True)
    profile_picture = fields.Str()

