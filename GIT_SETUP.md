# 🚀 Git Repository Setup Guide

## 📋 Pre-commit Checklist

Before pushing to your repository, make sure you have:

- ✅ Created a `.gitignore` file (already done)
- ✅ Set up environment variables
- ✅ Installed dependencies
- ✅ Tested the application locally

## 🔧 Environment Setup

### 1. Copy Environment File
```bash
# In the backend directory
cp env.example config.env
# Edit config.env with your actual database credentials
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 📁 What's Included in Git

### ✅ Tracked Files
- Source code (TypeScript/React)
- Configuration files (package.json, tsconfig.json, etc.)
- Documentation (README, guides)
- Dataset file (AirQualityUCI.csv)
- Build configurations (webpack, nest-cli)

### ❌ Ignored Files
- `node_modules/` - Dependencies (will be installed via npm)
- `dist/` and `build/` - Build outputs
- `.env` files - Environment variables (use env.example)
- `uploads/` contents - Uploaded files
- Log files and temporary files
- IDE configuration files

## 🚀 Git Commands

### Initial Setup
```bash
# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Air Quality Data Analysis Application"

# Add remote repository
git remote add origin <your-repository-url>

# Push to repository
git push -u origin main
```

### Daily Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes
git push
```

## 📝 Commit Message Guidelines

Use clear, descriptive commit messages:

```bash
# Good examples
git commit -m "Add data ingestion API endpoint"
git commit -m "Implement interactive charts with Recharts"
git commit -m "Fix CSV parsing for European decimal format"
git commit -m "Update documentation and README"

# Avoid
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

## 🔒 Security Notes

### Never Commit
- Database passwords
- API keys
- Personal information
- Environment-specific configurations

### Use Environment Variables
- Copy `env.example` to `config.env`
- Update with your actual values
- Keep `config.env` in `.gitignore`

## 📊 Repository Structure

```
your-repo/
├── .gitignore                 # Git ignore rules
├── README.md                  # Main documentation
├── QUICKSTART.md             # Quick setup guide
├── AirQualityUCI.csv         # Dataset file
├── backend/                  # NestJS backend
│   ├── src/                  # Source code
│   ├── package.json          # Dependencies
│   ├── env.example           # Environment template
│   └── uploads/              # Upload directory (empty)
└── frontend/                 # React frontend
    ├── src/                  # Source code
    ├── public/               # Static files
    └── package.json          # Dependencies
```

## 🎯 Ready to Push!

Your repository is now ready to be pushed to GitHub, GitLab, or any other git hosting service. The `.gitignore` file ensures that only the necessary files are tracked while keeping sensitive information and build artifacts out of version control.
