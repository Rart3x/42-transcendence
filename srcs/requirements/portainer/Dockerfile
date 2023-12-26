FROM alpine:3.17

RUN apk update && apk add wget

RUN wget https://github.com/portainer/portainer/releases/download/2.19.1/portainer-2.19.1-linux-amd64.tar.gz \
	&& tar -xf portainer-2.19.1-linux-amd64.tar.gz

WORKDIR /portainer

ENTRYPOINT ["./portainer"]