FROM nginx:stable-alpine
COPY ./requirements/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=backend /test/dist /usr/share/nginx/back
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]