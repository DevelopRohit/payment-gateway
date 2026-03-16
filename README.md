# Payment Gateway

This project is a Vite React frontend with a Flask and MySQL backend.

## Frontend setup

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL` to your backend URL.
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev`.

## Backend setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Fill in your MySQL connection details and a real `SECRET_KEY`.
3. Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

4. Start the API:

```bash
cd backend
python app.py
```

## Production notes

- Frontend build: `npm run build`
- The frontend reads the backend URL from `VITE_API_BASE_URL`.
- The backend reads database, port, host, secret, and CORS settings from `backend/.env`.
- `public/_redirects` is included so SPA routes work on Netlify-style static hosting.

## Verified locally

- `npm run lint`
- `npm run build`
- `python -m py_compile backend/app.py backend/db.py backend/update_db.py`
