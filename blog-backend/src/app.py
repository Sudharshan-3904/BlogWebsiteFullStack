from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/blogdb"
mongo = PyMongo(app)

# Route to create a new blog post
@app.route('/blogs', methods=['POST'])
def create_blog():
    data = request.json
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({"error": "Title and Content are required"}), 400

    blog = {
        "title": title,
        "content": content
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
            "content": blog['content']
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
            "content": blog['content']
        }), 200
    else:
        return jsonify({"error": "Blog not found"}), 404

# Route to update a blog post
@app.route('/blogs/<id>', methods=['PUT'])
def update_blog(id):
    data = request.json
    updated_data = {}
    if 'title' in data:
        updated_data['title'] = data['title']
    if 'content' in data:
        updated_data['content'] = data['content']

    result = mongo.db.blogs.update_one({"_id": ObjectId(id)}, {"$set": updated_data})

    if result.matched_count == 0:
        return jsonify({"error": "Blog not found"}), 404
    return jsonify({"message": "Blog updated"}), 200

# Route to delete a blog post
@app.route('/blogs/<id>', methods=['DELETE'])
def delete_blog(id):
    result = mongo.db.blogs.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Blog not found"}), 404
    return jsonify({"message": "Blog deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
