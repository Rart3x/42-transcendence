FROM alpine:3.18.5

RUN apk update && apk add nginx openssl

COPY nginx.conf /etc/nginx/http.d/nginx.conf
COPY script.sh /script.sh

ENTRYPOINT ["sh", "script.sh"]
