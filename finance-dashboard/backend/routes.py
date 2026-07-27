from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

api_bp = Blueprint("api", __name__)

@api_bp.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "API is running!"})