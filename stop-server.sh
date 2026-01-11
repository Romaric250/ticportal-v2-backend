#!/bin/bash
# Stop the TIC Portal server

echo "🛑 Stopping TIC Portal server..."

# Find and kill Node.js processes on port 5000
if command -v lsof &> /dev/null; then
    # Mac/Linux
    PID=$(lsof -ti:5000)
    if [ ! -z "$PID" ]; then
        kill -9 $PID
        echo "✅ Server stopped (PID: $PID)"
    else
        echo "ℹ️  No server running on port 5000"
    fi
else
    # Windows (Git Bash)
    taskkill //F //IM node.exe 2>/dev/null
    echo "✅ All Node.js processes stopped"
fi

echo "Done!"
