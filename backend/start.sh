#!/bin/sh

# Railway start script for backend
echo "🚀 Starting AskJury Backend Server..."

# Run database migrations first
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Check if migrations succeeded
if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migration failed!"
  exit 1
fi

# Start the application
echo "🎯 Starting Node.js server..."
exec node src/server.js