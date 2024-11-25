# MERN chat app

A real-time chat application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). This app provides chat functionality with JWT authentication, a MongoDB backend, and real-time communication using **Socket.io**.

## Setup

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/mernChat.git
cd mernChat
```

### 2. Add Environment Variables

Create a `.env` file in the `backend` of the project and add the following environment variables:

```bash
PORT=5002
MONGODB_PASSWORD=your_mongo_password
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRY=1d
NODE_ENV=production
```

**Explanation:**

- **`PORT`**: The port where the server will run.
- **`MONGODB_PASSWORD`**: Your MongoDB password.
- **`MONGODB_URI`**: The URI to your MongoDB database.
- **`JWT_SECRET`**: Secret key used for signing JWT tokens.
- **`JWT_ACCESS_EXPIRY`**: Expiration time for JWT tokens (default is `1d`).
- **`NODE_ENV`**: Set this to `production` when running in production.

### 3. Install Dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

### 4. Build & Run the Application

To build and run the application, run the following command:

```bash
npm run build
npm start
```

The application will be available at `http://localhost:5002`.
