FROM adoptopenjdk/openjdk11:latest

RUN apt-get update && apt-get install -y wget

RUN wget -O /tmp/dbeaver.tar.gz https://dbeaver.io/files/dbeaver-ce-latest-linux.gtk.x86_64.tar.gz && \
    tar -xzvf /tmp/dbeaver.tar.gz -C /opt/ && \
    rm /tmp/dbeaver.tar.gz

CMD ["/opt/dbeaver/dbeaver"]