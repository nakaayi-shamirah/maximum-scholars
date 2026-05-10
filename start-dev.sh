#!/bin/bash

# Start Backend and Frontend servers
# This script starts both servers for development

echo "🚀 Starting Maximum Scholars Development Environment"
echo "=================================================="

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Create logs directory
mkdir -p logs

# Start backend in background
echo "📦 Starting Backend Server..."
cd backend
npm install 2>/dev/null
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Give backend time to start
sleep 3

# Start frontend
echo "📱 Starting Frontend Server..."
cd ../frontend
npm install 2>/dev/null
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "=================================================="
echo "🎉 Development servers running!"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "📋 Logs:"
echo "  Backend:  ./logs/backend.log"
echo "  Frontend: ./logs/frontend.log"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "=================================================="

# Trap Ctrl+C to stop both servers
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo 'Stopped all servers'; exit" INT TERM

# Wait for both processes
wait
