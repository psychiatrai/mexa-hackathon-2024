# Mexa Hackathon 2024

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js**
- **npm** or **yarn**
- **Python**
- **pip**

## Running the Project

### Backend


1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. In the backend directory, create a file  `secrets.env` and add the following environment variables:
   ```env
   GEMINI_API_KEY=your_api_key
   ```
3. Ideally create and activate a virtual environment
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the server:
   ```bash
   fastapi dev src/app.py
   ```

The backend application Swagger docs will be available at [http://localhost:8000](http://localhost:8000)

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

The frontend application will be available at [http://localhost:3000](http://localhost:3000)
