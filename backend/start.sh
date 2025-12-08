#!/bin/sh

# Railway start script for backend
echo "🚀 Starting AskJury Backend Server..."

# Wait for database to be ready and run migrations
echo "📦 Waiting for database and running migrations..."
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "Attempt $((RETRY_COUNT + 1))/$MAX_RETRIES..."

  npx prisma db push --accept-data-loss

  if [ $? -eq 0 ]; then
    echo "✅ Database migrations completed successfully"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "⏳ Database not ready, waiting 3 seconds..."
      sleep 3
    else
      echo "❌ Failed to connect to database after $MAX_RETRIES attempts"
      echo "⚠️  Starting server anyway - it will retry on first request"
      break
    fi
  fi
done

# Start the application
echo "🎯 Starting Node.js server..."
exec node src/server.js