# Configuration reference

Create a file named `backend/.env` and add the following values. This file is intentionally excluded from the source archive's tracked configuration so private database credentials are not committed.

```dotenv
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/sahyog_donation_platform
JWT_SECRET=replace_this_with_a_unique_long_random_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
EMAIL_USER=
EMAIL_PASS=
```

| Variable | Required | Description |
|---|---:|---|
| `PORT` | Yes | Express API port. The frontend defaults to `5000`. |
| `NODE_ENV` | Yes | Use `development` locally. |
| `MONGO_URI` | Yes | Local MongoDB or MongoDB Atlas connection string. |
| `JWT_SECRET` | Yes | Long, unique secret for signing JSON Web Tokens. Do not reuse the example. |
| `JWT_EXPIRES_IN` | Yes | JWT lifetime such as `7d`. |
| `FRONTEND_URL` | Yes | Exact browser origin allowed by the backend CORS policy. |
| `EMAIL_USER` / `EMAIL_PASS` | No | Reserved for a future Nodemailer password-reset implementation. |

For MongoDB Atlas, replace `MONGO_URI` with the connection string from the Atlas project's database connection dialog, ensure the application user's password is URL-encoded if needed, and allow the development machine's IP address in the project network settings.

The frontend reads `REACT_APP_API_URL`. It defaults to `http://localhost:5000/api`, so no extra value is required for the standard local setup. For a different API host, start the frontend with an explicit value:

```bash
REACT_APP_API_URL=http://localhost:5000/api npm start
```
