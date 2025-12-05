#!/bin/sh

# Solo ejecutar migraciones si DATABASE_URL está configurado
if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npm run docker:migration:run || {
    echo "Migration failed, continuing to start application..."
  }
fi

echo "Starting application..."
exec node dist/main.js
