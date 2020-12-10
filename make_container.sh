#!/bin/bash
read -p "DB_NAME: " POSTGRES_DB
read -p "USER: " POSTGRES_USER
read -p "PASS: " POSTGRES_PASSWORD

if [[ ! "$(docker ps -aqf name=$POSTGRES_DB)" ]]; then
  docker run \
    -e "POSTGRES_USER=$POSTGRES_USER" \
    -e "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" \
    -e "POSTGRES_DB=$POSTGRES_DB" \
    -p 9876:5432 \
    --name "$POSTGRES_DB" \
    postgres:alpine
else
  docker start -ia "$POSTGRES_DB"
fi