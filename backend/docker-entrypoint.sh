#!/bin/sh
# Container start-up: adapt to the hosting platform, prepare the database, then start Apache.
set -e

# Render and similar hosts tell the app which port to listen on.
PORT="${PORT:-80}"
sed -i "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# Laravel expects "base64:..." keys; generated secrets from hosts usually lack the prefix.
case "$APP_KEY" in
  base64:*) ;;
  *) export APP_KEY="base64:${APP_KEY}" ;;
esac

# Public address: Render provides RENDER_EXTERNAL_URL automatically.
export APP_URL="${APP_URL:-${RENDER_EXTERNAL_URL:-http://localhost}}"

# Managed MySQL (e.g. Aiven) requires SSL: save the CA certificate from an env var to a file.
if [ -n "$MYSQL_SSL_CA_PEM" ]; then
  printf '%s\n' "$MYSQL_SSL_CA_PEM" > /tmp/mysql-ca.pem
  export MYSQL_ATTR_SSL_CA=/tmp/mysql-ca.pem
fi

# The database may still be starting (e.g. MySQL restarts once after first boot), so retry for ~30 s.
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  php artisan migrate --force && break
  [ "$attempt" = 10 ] && exit 1
  echo "Database not ready (attempt $attempt), retrying in 3 s..."
  sleep 3
done
php artisan db:seed --force

# Create the first staff login from env vars (skipped if it already exists).
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  php artisan admin:create "$ADMIN_EMAIL" --name="Gym Owner" --password="$ADMIN_PASSWORD" || true
fi

php artisan config:cache
chown -R www-data:www-data storage bootstrap/cache

exec apache2-foreground
