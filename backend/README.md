# Backend API

This is the backend API for the Data Visualization MVP application.

## Project Structure

The backend is organized using Flask Blueprints for better modularity:

```
backend/
├── app.py                  # Main application entry point
├── models/                 # Database models
│   ├── __init__.py
│   └── models.py           # SQLAlchemy models
├── blueprints/             # API routes organized by feature
│   ├── __init__.py
│   ├── auth/               # Authentication routes
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── integrations/       # Integration routes
│   │   ├── __init__.py
│   │   └── routes.py
│   └── user/               # User routes
│       ├── __init__.py
│       └── routes.py
├── config/                 # Configuration files
├── integrations/           # Integration modules
└── requirements.txt        # Python dependencies
```

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` as needed

5. Run the application:
   ```
   flask run
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/refresh` - Refresh access token

### User

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Integrations

- `GET /api/integrations/status` - Get integration status
- `GET /api/integrations/settings` - Get integration settings
- `POST /api/integrations/settings` - Save integration settings
- `POST /api/integrations/google/test` - Test Google Analytics connection
- `POST /api/integrations/meta/test` - Test Meta Ads connection

## Database

The application uses SQLAlchemy with SQLite by default. You can change the database by updating the `DATABASE_URL` in the `.env` file.

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Access tokens expire after 1 day by default. 