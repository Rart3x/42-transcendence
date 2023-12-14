FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

RUN mkdir -p /etc/nginx/snippets /etc/ssl/private; \
	apk update && apk add --no-cache nginx openssl; \
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-subj "/C=FR/CN=*.${DOMAIN_NAME}" \
	-keyout /etc/ssl/private/localhost.key \
	-out /etc/ssl/certs/localhost.crt

CMD [ "nginx", "-g", "daemon off;" ]