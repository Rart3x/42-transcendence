FROM nginx:latest as production-stage
#copie le fichier de configuration nginx depuis le host dans le container
COPY ./tools/default.conf /etc/nginx/conf.d/default.conf

#creer le certificat et la cle ssl
RUN openssl req -x509 -newkey rsa:4096 -keyout ft_transcendence.key -out ft_transcendence.crt -sha256 -days 365 -nodes -subj "/C=FR/L=Angouleme/O=42school/CN=ft_transcendence"

#copier la cle et le certificat a la root du container
COPY ft_transcendence.* .

#export le port 80
EXPOSE 80
#demarre le serveur nginx
CMD ["nginx", "-g", "daemon off;"]
