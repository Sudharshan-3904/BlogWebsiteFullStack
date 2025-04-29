# A Fullstack Blog Website

A modern, responsive blog website with a React frontend and a Python/Flask backend.

## Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Comment system
- Rich text editor for writing blog posts
- Responsive design for all device sizes
- Search functionality

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- CSS/SCSS for styling
- Axios for API requests

### Backend
- Python/Flask
- SQLAlchemy ORM
- JWT for authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- Python (v3.8 or later)
- npm or yarn

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   ```
   cp .env.example .env
   ```
5. Run the development server:
   ```
   python app.py
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm start
   ```

## Deployment

Instructions for deploying the application will be added here.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
