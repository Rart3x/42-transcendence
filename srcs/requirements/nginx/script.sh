#!/bin/sh

mkdir /ssh_key

openssl req -x509 -newkey rsa:4096 -keyout /ssh_key/ft_transcendence.key -out /ssh_key/ft_transcendence.crt -sha256 -days 365 -nodes -subj "/C=FR/ST=Angouleme/"

exec nginx -g "daemon off;"