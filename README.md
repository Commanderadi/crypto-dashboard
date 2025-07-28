# AI Portfolio Platform

A full-stack platform for cryptocurrency portfolio analytics, AI-powered insights, and price prediction.

## Project Structure
- `client/` – React frontend (TypeScript, Chart.js, Tailwind)
- `server/` – Node.js/Express backend (API, routes, services)
- `ml/` – Machine learning scripts (CatBoost, Python)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repo-url>
cd ai-portfolio-platform
```

### 2. Environment Variables
Create a `.env` file in `server/` and add:
```
API_KEY=your_api_key_here
```

### 3. Install Dependencies
#### Frontend
```bash
cd client
npm install
```
#### Backend
```bash
cd ../server
npm install
```
#### ML (optional)
```bash
cd ../ml
pip install -r requirements.txt
```

### 4. Running the App
#### Start Backend
```bash
cd server
node index.js
```
#### Start Frontend
```bash
cd client
npm start
```
#### Train ML Model
```bash
cd ml
python train_model.py
```
#### Predict with ML Model
```bash
python predict.py bitcoin 60000
```

## Features
- Crypto dashboard and coin details
- Interactive price charts
- AI-powered analysis and fraud detection
- ML-based price prediction

## License
MIT 