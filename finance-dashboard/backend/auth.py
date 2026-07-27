from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import User
from database import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if User.query.filter_by(email=data.get("email")).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(data.get('password'))
    new_user = User(
        name=data.get('name'),
        email=data.get('email'),
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not check_password_hash(user.password, data.get('password')):
        return jsonify({"error": "Invalid email or password"}), 401
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "token": access_token,
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"id": user.id, "name": user.name, "email": user.email}), 200