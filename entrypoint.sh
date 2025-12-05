#!/bin/sh
set -e

echo "⚙️ Running database migrations..."
npm run docker:migration:run

echo "🚀 Starting application..."
exec node dist/main.js
