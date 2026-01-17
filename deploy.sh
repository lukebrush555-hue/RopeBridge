#!/bin/bash

# MonsterMaker Dashboard - Deployment Script
# Following Luke's Verified Vercel Deployment Playbook

echo "🎨 MonsterMaker Dashboard Deployment"
echo "===================================="
echo "Following your verified deployment method"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the monstermaker-dashboard directory"
    exit 1
fi

# Deploy using your verified method
echo "🚀 Deploying to Vercel using your token..."
echo ""
echo "Team: Luke's projects"
echo "Token: nETtsXJd2vwPZEYruRBnxQmG"
echo ""

# Run the exact deployment command from your playbook
npx vercel --prod --token nETtsXJd2vwPZEYruRBnxQmG

if [ $? -eq 0 ]; then
    echo ""
    echo "===================================="
    echo "✅ Deployment successful!"
    echo "===================================="
    echo ""
    echo "🎉 Your dashboard is now live!"
    echo "Check the URL above to access it."
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo "Check the error messages above"
    exit 1
fi
