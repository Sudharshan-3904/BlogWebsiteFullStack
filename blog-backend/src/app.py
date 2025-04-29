from flask import Flask, request, jsonify, session, redirect, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from google.oauth2 import id_token
from google.auth.transport import requests
import os
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/blogdb"
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-here')  # Change in production
app.config["GOOGLE_CLIENT_ID"] = os.environ.get('GOOGLE_CLIENT_ID', '')  # Add your Google Client ID here

# Initialize MongoDB
mongo = PyMongo(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

# User model
class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.email = user_data.get('email')
        self.name = user_data.get('name')
        self.picture = user_data.get('picture')

@login_manager.user_loader
def load_user(user_id):
    user_data = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user_data:
        return None
    return User(user_data)

# Google Login route
@app.route('/auth/google', methods=['POST'])
def google_auth():
    try:
        # Get the token from the request
        token = request.json.get('token')
        
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            app.config["GOOGLE_CLIENT_ID"]
        )
        
        # Check if the token is valid
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return jsonify({"error": "Invalid token issuer"}), 401
        
        # Get user info from the token
        user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')
        
        # Find or create the user
        user_data = mongo.db.users.find_one({"google_id": user_id})
        
        if not user_data:
            # Create a new user
            user_data = {
                "google_id": user_id,
                "email": email,
                "name": name,
                "picture": picture,
                "role": "user"  # Default role
            }
            mongo.db.users.insert_one(user_data)
            user_data = mongo.db.users.find_one({"google_id": user_id})
            
        # Log in the user
        user = User(user_data)
        login_user(user)
        
        # Return user info
        return jsonify({
            "id": str(user_data['_id']),
            "name": user_data.get('name'),
            "email": user_data.get('email'),
            "picture": user_data.get('picture'),
            "role": user_data.get('role', 'user')
        }), 200
        
    except ValueError:
        # Invalid token
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Logout route
@app.route('/auth/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

# Get current user
@app.route('/auth/user', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        user_data = mongo.db.users.find_one({"_id": ObjectId(current_user.id)})
        if user_data:
            return jsonify({
                "id": str(user_data['_id']),
                "name": user_data.get('name'),
                "email": user_data.get('email'),
                "picture": user_data.get('picture'),
                "role": user_data.get('role', 'user')
            }), 200
    return jsonify({"error": "Not authenticated"}), 401

# Route to create a new blog post
@app.route('/blogs', methods=['POST'])
@login_required
def create_blog():
    data = request.json
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({"error": "Title and Content are required"}), 400

    blog = {
        "title": title,
        "content": content,
        "author_id": current_user.id,
        "author_name": current_user.name
    }
    result = mongo.db.blogs.insert_one(blog)
    return jsonify({"message": "Blog created", "id": str(result.inserted_id)}), 201

# Route to get all blog posts
@app.route('/blogs', methods=['GET'])
def get_blogs():
    blogs = []
    for blog in mongo.db.blogs.find():
        blogs.append({
            "id": str(blog['_id']),
            "title": blog['title'],
            "content": blog['content'],
            "author_id": blog.get('author_id', ''),
            "author_name": blog.get('author_name', '')
        })
    return jsonify(blogs), 200

# Route to get a single blog post by ID
@app.route('/blogs/<id>', methods=['GET'])
def get_blog(id):
    blog = mongo.db.blogs.find_one({"_id": ObjectId(id)})
    if blog:
        return jsonify({
            "id": str(blog['_id']),
            "title": blog['title'],
            "content": blog['content'],
            "author_id": blog.get('author_id', ''),
            "author_name": blog.get('author_name', '')
        }), 200
    else:
        return jsonify({"error": "Blog not found"}), 404

# Route to update a blog post
@app.route('/blogs/<id>', methods=['PUT'])
@login_required
def update_blog(id):
    blog = mongo.db.blogs.find_one({"_id": ObjectId(id)})
    if not blog:
        return jsonify({"error": "Blog not found"}), 404
        
    # Check if the current user is the author
    if blog.get('author_id') != current_user.id:
        return jsonify({"error": "Unauthorized - you can only edit your own posts"}), 403
        
    data = request.json
    updated_data = {}
    if 'title' in data:
        updated_data['title'] = data['title']
    if 'content' in data:
        updated_data['content'] = data['content']

    result = mongo.db.blogs.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
    return jsonify({"message": "Blog updated"}), 200

# Route to delete a blog post
@app.route('/blogs/<id>', methods=['DELETE'])
@login_required
def delete_blog(id):
    blog = mongo.db.blogs.find_one({"_id": ObjectId(id)})
    if not blog:
        return jsonify({"error": "Blog not found"}), 404
        
    # Check if the current user is the author
    if blog.get('author_id') != current_user.id:
        return jsonify({"error": "Unauthorized - you can only delete your own posts"}), 403
        
    result = mongo.db.blogs.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Blog deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
