# Vercel Deployment Guide

This Digital Concierge application has been prepared for deployment on Vercel. Here's how to deploy it:

## Prerequisites

1. Push your code to a GitHub repository
2. Create a Vercel account at [vercel.com](https://vercel.com)

## Deployment Steps

### 1. Connect to Vercel
1. Go to your Vercel dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Select this project

### 2. Configure Build Settings
Vercel should auto-detect the configuration, but ensure these settings:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables
Since this project uses in-memory storage, no database environment variables are needed for basic functionality.

If you want to add OpenAI integration later:
- Add `OPENAI_API_KEY` in Vercel dashboard under "Environment Variables"

### 4. Deploy
Click "Deploy" and Vercel will:
- Install dependencies
- Build the frontend
- Deploy API routes as serverless functions
- Provide a live URL

## Project Structure for Vercel

```
/
├── api/                    # Serverless API routes
│   ├── chat.ts            # Chat endpoint
│   ├── assets.ts          # Assets endpoint
│   └── assets/
│       └── search.ts      # Asset search endpoint
├── client/                # React frontend
├── server/                # Original server code (used by API routes)
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies and build scripts
```

## Features Available After Deployment

✅ **Voice Input**: Speech-to-text functionality  
✅ **Text Chat**: Full conversation interface  
✅ **AI Responses**: Pattern-based responses with content cards  
✅ **Asset Search**: TF-IDF vector search for hotel information  
✅ **Responsive Design**: Mobile-friendly interface  
✅ **Dark Mode**: Theme switching capability  

## API Endpoints

After deployment, your app will have these endpoints:
- `GET /api/assets` - Get all assets
- `GET /api/assets/search?q=query` - Search assets
- `POST /api/chat` - Send chat messages

## Notes

- The app uses in-memory storage, so data resets with each deployment
- For production, consider adding a persistent database like PostgreSQL
- Voice input requires HTTPS (provided by Vercel automatically)
- All static assets are served from the `/client/dist` directory