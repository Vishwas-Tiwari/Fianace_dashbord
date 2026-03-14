# 🚀 Deployment Guide

This guide explains how to deploy the Personal Finance Dashboard to various cloud platforms.

## 📋 Prerequisites

- GitHub repository with your code
- Database file (`finance_dashboard.db`) - **Note**: For production, consider using a cloud database like PostgreSQL

## 🌐 Deployment Options

### 1. **Railway** (Recommended - Free tier available)

Railway provides free hosting with automatic deployments from GitHub.

**Steps:**
1. Go to [Railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select your repository
4. Railway will automatically detect it's a Python app and deploy it
5. Your app will be live at `https://your-project-name.up.railway.app`

**Environment Variables** (if needed):
- `PORT` - Automatically set by Railway
- `FLASK_ENV=production`

### 2. **Render** (Free tier available)

**Steps:**
1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure build settings:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT wsgi:app`
5. Click "Create Web Service"

### 3. **Heroku** (Requires credit card for free tier)

**Steps:**
1. Install Heroku CLI: `brew install heroku` (macOS)
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`
5. Open app: `heroku open`

### 4. **Vercel** (Serverless functions)

**Steps:**
1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel`
3. Follow the prompts to link your GitHub repository

### 5. **Docker Deployment**

**Build and run locally:**
```bash
docker build -t finance-dashboard .
docker run -p 8000:8000 finance-dashboard
```

**Deploy to cloud:**
- **Google Cloud Run**: `gcloud run deploy --source .`
- **AWS Fargate**: Use ECS with the Dockerfile
- **DigitalOcean App Platform**: Connect repository with Dockerfile

## 🔧 Configuration

### Environment Variables

For production deployment, set these environment variables:

```bash
FLASK_ENV=production
PORT=8000  # Usually set automatically by the platform
```

### Database

**For production**, replace SQLite with a cloud database:

1. **PostgreSQL** (Recommended):
   - Railway: Automatically provided
   - Heroku: `heroku addons:create heroku-postgresql`
   - Render: Use their PostgreSQL service

2. **Update `config.py`**:
```python
import os

class Config:
    DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///finance_dashboard.db')
    # For PostgreSQL, it will be something like:
    # postgresql://user:password@host:port/database
```

## 🧪 Testing Deployment

After deployment, test these endpoints:

```bash
# Summary endpoint
curl https://your-app-url/api/summary?user_id=1&month=1&year=2023

# Transactions endpoint
curl https://your-app-url/api/transactions?user_id=1&page=1&per_page=5

# Category breakdown
curl https://your-app-url/api/category-breakdown?user_id=1&month=1&year=2023
```

## 🚨 Troubleshooting

### Common Issues:

1. **Port binding errors**: Make sure your app binds to `0.0.0.0` and uses the `PORT` environment variable
2. **Database connection**: Ensure your database URL is correctly set
3. **Static files**: Flask automatically serves static files from the `/static/` directory
4. **CORS issues**: The app has CORS enabled for all origins in development

### Logs:

- **Railway**: Check logs in the Railway dashboard
- **Render**: View logs in the service dashboard
- **Heroku**: `heroku logs --tail`
- **Vercel**: Check function logs in the dashboard

## 📊 Performance

For production optimization:

1. **Database**: Use connection pooling
2. **Caching**: Implement Redis for session/cache storage
3. **CDN**: Serve static files via CDN
4. **Monitoring**: Add logging and error tracking

## 🔒 Security

Before going live:

1. **Environment variables**: Never commit secrets to code
2. **HTTPS**: All platforms provide SSL certificates
3. **Database**: Use strong passwords and restrict access
4. **Updates**: Keep dependencies updated

---

🎉 **Happy Deploying!** Your Personal Finance Dashboard is ready for the world! 🌍