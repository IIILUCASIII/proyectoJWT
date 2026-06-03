from flask import Blueprint, request, jsonify
from database import db
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity  

user_bp = Blueprint('user', __name__, url_prefix='/api')

@user_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

    try:
        hashed_password = generate_password_hash(password)

        new_user = User(name=name, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Usuario registrado con éxito"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al guardar en la base de datos: {str(e)}"}), 500


@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Faltan datos"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Correo o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "msg": "Inicio de sesión terminado",
        "token": access_token,
        "user": user.to_dict()
    }), 200


@user_bp.route('/private', methods=['GET'])
@jwt_required()  
def get_private_data():
    current_user_id = get_jwt_identity()
    
    return jsonify({
        "msg": "¡Acceso concedido a la ruta privada!",
        "user_id": current_user_id,
        "datos_secretos": "Este es un texto que solo ve la gente logueada."
    }), 200