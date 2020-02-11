server {
    listen 80;
    server_name cutray.ru.com www.cutray.ru.com;
    return 301 https://cutray.ru.com$request_uri;
}

server {
    listen 443;

    ssl on;
    ssl_certificate /etc/nginx/ssl/cutray.crt;
    ssl_certificate_key /etc/nginx/ssl/cutray.key;

    server_name cutray.ru.com;
    root /app/public;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        internal;
   }

   location ~ \.php$ {
     return 404;
   }

   error_log /var/log/nginx/site.log;
   access_log /var/log/nginx/site.log;
}