# Load Management Frontend

React-based frontend application for the Load Management System.

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env` if backend is on different URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start development server:

```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

### `npm start`

Runs the app in development mode.

### `npm build`

Builds the app for production.

### `npm test`

Runs the test suite.

### Login Form

- Email: Required
- Password: Required

## Development

For development with hot reload:

```bash
npm start
```

This starts the development server with hot module reloading.

## Production Build

```bash
npm run build
```

Creates optimized production build in `build/` directory.

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy build/ folder to Netlify
```

### Custom Server

```bash
npm run build
# Copy build/ folder to web server
```

## Environment Variables

```
REACT_APP_API_URL    - Backend API URL (default: http://localhost:5000/api)
```
