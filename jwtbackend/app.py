import os
from flask import Flask
from flask_cors import CORS
from database import db
from routes.user import user_bp
from flask_jwt_extended import JWTManager  

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["JWT_SECRET_KEY"] = "tu-clave-secreta-super-segura"  
jwt = JWTManager(app)  

db.init_app(app)

app.register_blueprint(user_bp)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)