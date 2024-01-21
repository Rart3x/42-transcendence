FROM nginx:stable-alpine
EXPOSE 443

RUN mkdir ssh && openssl req -x509 -newkey rsa:4096 -keyout /ssh_key/ft_transcendence.key -out /ssh_key/ft_transcendence.crt -sha256 -days 365 -nodes -subj "/C=FR/ST=Angouleme/"

CMD ["nginx", "-g", "daemon off;"]