from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import db

from auth import auth_bp
from routes import api_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
JWTManager(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(api_bp, url_prefix="/api")

with app.app_context():
    db.create_all()

@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

@app.route('/', methods=['GET'])
def api_metadata():
    return jsonify({
        "name": "FinanceApp API",
        "version": "1.0.0",
        "status": "active",
        "author": "Padmanav Khamari",
        "endpoints": {
            "auth": "/api/auth",
            "api": "/api"
        }
    }), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)