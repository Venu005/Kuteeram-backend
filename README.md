# Service Booking Backend

This is the backend application for a service booking platform. It provides APIs for user authentication (registration, login, logout, validation), service management (creating and listing services - admin only), and booking management (creating and listing user bookings).

## Features

- **User Authentication:**
  - User registration with hashed passwords.
  - User login using email and password.
  - JWT-based authentication using secure HTTP-only cookies.
  - Session validation endpoint.
  - User logout.
- **Role-Based Access Control:**
  - Distinguishes between regular `user` and `admin` roles.
  - Admin user automatically created on first run if not present.
  - Specific routes protected for admin access only.
- **Service Management (Admin):**
  - Create new services with title, description, and price.
  - List all available services.
- **Booking Management (User):**
  - Create bookings for available services.
  - List bookings made by the logged-in user.
  - Booking status automatically updates (simulated in `bookingController`).
- **Secure Configuration:**
  - Uses environment variables for sensitive data (database URI, JWT secret, admin credentials).
- **Middleware:**
  - Authentication middleware to protect routes.
  - Admin middleware to restrict access to admin-only routes.
  - Error handling middleware.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT), bcryptjs (for password hashing)
- **Middleware:** `cookie-parser`, `cors`

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- MongoDB (local instance or a cloud service like MongoDB Atlas)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd intern-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

## Configuration

1.  Create a `.env` file in the root directory of the project (`c:\Users\Yalamanchili Venusai\Desktop\projects\intern-backend\.env`).
2.  Add the following environment variables to the `.env` file, replacing the placeholder values with your actual configuration:

    ```dotenv
    # Server Configuration
    PORT=5000
    NODE_ENV=development # or production

    # MongoDB Connection
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

    # JWT Configuration
    JWT_SECRET=your_strong_jwt_secret_key # Replace with a strong, random secret

    # Admin User Credentials (used for initial creation)
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=your_secure_admin_password # Replace with a strong password

    # Frontend URL (for CORS configuration)
    CLIENT_URL=http://localhost:5173 # Adjust if your frontend runs on a different port/URL
    ```

    - **`MONGO_URI`**: Your MongoDB connection string.
    - **`JWT_SECRET`**: A secret key for signing JWT tokens. Make this long and random.
    - **`ADMIN_EMAIL` / `ADMIN_PASSWORD`**: Credentials for the admin user that will be automatically created if it doesn't exist.
    - **`CLIENT_URL`**: The URL of your frontend application for CORS configuration.
    - **`NODE_ENV`**: Set to `production` when deploying. This affects cookie security settings and error handling details.

## Running the Application

1.  **Development Mode:**

    - Uses `ts-node` to run the TypeScript code directly.
    - Includes features like automatic server restarts on file changes if used with tools like `nodemon`.

    ```bash
    npm run dev
    ```

    The server will start, typically on `http://localhost:5000` (or the port specified in `.env`). The MongoDB connection will be established, and the admin user will be created if necessary.

2.  **Production Mode:**
    - First, build the TypeScript code into JavaScript:
      ```bash
      npm run build
      ```
      This compiles the code from `src` to the `dist` directory.
    - Then, start the application using Node.js:
      ```bash
      npm start
      ```
      This runs the compiled JavaScript code from the `dist` directory. Ensure `NODE_ENV` is set to `production` in your production environment's `.env` file or system environment variables.

## API Endpoints

All routes are prefixed with `/api`.

- **Authentication (`/api/auth`)**
  - `POST /register`: Register a new user.
    - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
  - `POST /login`: Log in a user.
    - Body: `{ "email": "john@example.com", "password": "password123" }`
  - `POST /logout`: Log out the current user (clears the auth cookie).
  - `GET /validate`: Validate the current user's session using the auth cookie. (Requires authentication)
- **Services (`/api/services`)**
  - `POST /`: Create a new service. (Requires admin authentication)
    - Body: `{ "title": "Service Name", "description": "Details about the service", "price": 100 }`
  - `GET /`: Get a list of all available services. (Public)
- **Bookings (`/api/bookings`)**
  - `POST /`: Create a new booking for a service. (Requires user authentication)
    - Body: `{ "serviceId": "service_object_id" }`
  - `GET /`: Get a list of bookings for the currently logged-in user. (Requires user authentication)

## Authentication Flow

1.  **Register/Login:** The user sends credentials to `/api/auth/register` or `/api/auth/login`.
2.  **Token Generation:** Upon successful registration or login, the server generates a JWT containing the user's ID (`_id`).
3.  **Cookie Setting:** The JWT is sent back to the client in an HTTP-only cookie named `token`. This cookie is configured for security (`httpOnly`, `secure` in production, `sameSite`).
4.  **Authenticated Requests:** For subsequent requests to protected routes, the browser automatically includes the `token` cookie.
5.  **Middleware Verification:** The `auth` middleware ([`src/middleware/auth.ts`](src/middleware/auth.ts)) intercepts requests, extracts the token from the cookie (or `Authorization` header as a fallback), verifies it using the `JWT_SECRET`, and fetches the user data (excluding the password) from the database. The user object is attached to `req.user`.
6.  **Logout:** The `/api/auth/logout` endpoint clears the `token` cookie.

## Roles

- **`user`**: Default role for registered users. Can book services and view their own bookings.
- **`admin`**: Special role assigned based on the `ADMIN_EMAIL` environment variable during login. Can create and manage services, in addition to user privileges. The `admin` middleware ([`src/middleware/auth.ts`](src/middleware/auth.ts)) checks for this role on specific routes.

## Project Structure

```
.
├── dist/                 # Compiled JavaScript output (after running npm run build)
├── node_modules/         # Project dependencies
├── src/                  # Source code directory
│   ├── config/           # Configuration files (e.g., database connection)
│   │   └── db.ts
│   ├── controllers/      # Route handlers (request/response logic)
│   │   ├── authController.ts
│   │   ├── bookingController.ts
│   │   └── servicecontroller.ts
│   ├── middleware/       # Express middleware (auth, error handling, etc.)
│   │   ├── auth.ts
│   │   └── error.ts
│   ├── models/           # Mongoose models and schemas
│   │   ├── Booking.ts
│   │   ├── Service.ts
│   │   └── User.ts
│   ├── routes/           # Express route definitions
│   │   ├── authRoute.ts
│   │   ├── bookingRoutes.ts
│   │   └── serviceRoutes.ts
│   ├── utils/            # Utility functions (e.g., token generation - if refactored)
│   │   └── generateToken.ts # (Note: Token generation is currently within authController)
│   └── app.ts            # Main application setup and entry point
├── .env                  # Environment variables (ignored by Git)
├── .gitignore            # Specifies intentionally untracked files that Git should ignore
├── package.json          # Project metadata and dependencies
├── README.md             # This file
└── tsconfig.json         # TypeScript compiler options
```
## Postman Api Collection
## Postman Api Collection
[Find the Postman API collection here](https://www.postman.com/satellite-operator-42903359/workspace/my-workspace/collection/27500107-77b30f81-3531-4351-907a-25473e6c2740?action=share&creator=27500107&active-environment=27500107-68996419-1979-4d7e-8500-1c7b00d89dda)