#!/bin/bash

until PGPASSWORD="123" psql "postgresql://kramjatt:123@postgres:5432/PMU" -c '\q'; do
 >&2 echo "Postgres is unavailable - waiting"
 sleep 1
done

>&2 echo "Postgres is up - executing command"
exec "$@"