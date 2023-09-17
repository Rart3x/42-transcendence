FROM alpine:3.18

WORKDIR /var/www/html

RUN mkdir -p /etc/nginx/snippets /etc/ssl/private; \
	apk update && apk add --no-cache nginx openssl; \
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-subj "/C=FR/CN=*.${DOMAIN_NAME}" \
	-keyout /etc/ssl/private/kramjatt.42.fr.key \
	-out /etc/ssl/certs/kramjatt.42.fr.crt

COPY conf/nginx.conf /etc/nginx/http.d/default.conf

ENTRYPOINT ["nginx"]

CMD ["-g", "daemon off;"]
