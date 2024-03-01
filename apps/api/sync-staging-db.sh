#!/usr/bin/bash

echo "✅ Starting prod->staging db sync..." &&
rm -f ~/staging-db-sync-err.txt && touch ~/staging-db-sync-err.txt &&
pg_dump \
  --dbname staging \
  --inserts \
  --data-only \
  --table orders \
  --table order_items \
  --table free_order_requests \
  --table tokens \
  --table token_scopes \
  > ~/staging-preserved-tables.sql \
  && echo "✅ Dumped staging db tables for preservation..." &&
pg_dump \
  --dbname flp \
  --inserts \
  --exclude-table-data orders \
  --exclude-table-data order_items \
  --exclude-table-data free_order_requests \
  --exclude-table-data tokens \
  --exclude-table-data token_scopes \
  > ~/prod-to-staging.sql \
  && echo "✅ Dumped prod db for staging overwrite..." &&
pm2 stop /^staging_/ > /dev/null \
  && echo "✅ Stopped pm2 staging process temporarily..." &&
dropdb staging \
  && echo "✅ Dropped staging db..." &&
createdb staging \
  && echo "✅ Recreated staging db..." &&
psql --dbname staging --file ~/prod-to-staging.sql 1> /dev/null 2>> ~/staging-db-sync-err.txt \
  && echo "✅ Recreated database from prod export..." &&
psql --dbname staging --file ~/staging-preserved-tables.sql 1> /dev/null 2>> ~/staging-db-sync-err.txt \
  && echo "✅ Restored preserved staging db tables..." &&
pm2 restart /^staging_/ > /dev/null \
  && echo "✅ Restarted pm2 staging process..."

rm -f ~/prod-to-staging.sql

if [ -s ~/staging-db-sync-err.txt ]; then
  echo "🚨 Errors from psql during sync:" > /dev/stderr
  cat ~/staging-db-sync-err.txt > /dev/stderr
  rm ~/staging-db-sync-err.txt
  exit 1
fi

rm ~/staging-db-sync-err.txt
exit 0

