from marshmallow import Schema, fields, validate, validates, ValidationError

class UserSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    zipcode = fields.Str(required=True, validate=validate.Length(min=5, max=10))
    profile_picture = fields.Str()

    @validates('zipcode')
    def validate_zipcode(self, value):
        if not ((value.isdigit() and len(value) == 5) or
                (len(value) == 10 and value[5] == '-' and
                 value[:5].isdigit() and value[6:].isdigit())):
            raise ValidationError("Invalid ZIP code format.")
