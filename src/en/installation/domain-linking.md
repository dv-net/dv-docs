# Domain Name Binding

## Cloudflare

Simply add domain proxy to your server's IP address

## Nginx

- Install and configure Nginx.
- Get an SSL certificate for your main domain (e.g. using `certbot`).
- Make sure your site is accessible at `https://your_domain`.

## Configuring and restarting the merchant

- Open the merchant configuration file:

```bash
nano /home/dv/merchant/configs/config.yaml
```

- Add (or change) the following lines:

```yaml
  http:
    port: "8080"
```

- Save the changes and restart the backend:

```bash
sudo systemctl restart dv-merchant
```

## Configuring Nginx for a subdomain

- Create an Nginx configuration file for the subdomain:

```bash
nano /etc/nginx/conf.d/{your_domain or subdomain}.conf
```

- Insert the following block into it (if necessary, adjust the port in `proxy_pass`):

```nginx
server {
listen 80;
server_name {your_domain}; 

client_max_body_size 128M; 

access_log /var/log/nginx/{your_domain}.access.log; 
error_log /var/log/nginx/{your_domain}.error.log; 

location/{ 
proxy_pass http://localhost:8080; 
} 

location ~ /\.(ht|svn|git) { 
deny all; 
} 

#Cloudflare proxy mode 

set_real_ip_from 103.21.244.0/22; 
set_real_ip_from 103.22.200.0/22; 
set_real_ip_from 103.31.4.0/22; 
set_real_ip_from 104.16.0.0/12; 
set_real_ip_from 108.162.192.0/18; 
set_real_ip_from 131.0.72.0/22; 
set_real_ip_from 141.101.64.0/18; 
set_real_ip_from 162.158.0.0/15; 
set_real_ip_from 172.64.0.0/13; 
set_real_ip_from 173.245.48.0/20; 
set_real_ip_from 188.114.96.0/20; 
set_real_ip_from 190.93.240.0/20; 
set_real_ip_from 197.234.240.0/22; 
set_real_ip_from 198.41.128.0/17; 
set_real_ip_from 2400:cb00::/32; 
set_real_ip_from 2606:4700::/32; 
set_real_ip_from 2803:f800::/32; 
set_real_ip_from 2405:b500::/32; 
set_real_ip_from 2405:8100::/32; 
set_real_ip_from 2c0f:f248::/32; 
set_real_ip_from 2a06:98c0::/29; 

real_ip_header CF-Connecting-IP; 
}
```

- Save the changes and restart Nginx:

```bash
sudo nginx -s reload
```

## DNS setup

- In your hosting (or domain registrar) DNS settings, map the `{your_domain or subdomain}` subdomain to your server's IP address. For example, using an A record:

```
{your_domain_or_subdomain} A IP_of_your_server
```

## Issue an SSL certificate for a subdomain

- Once the DNS record is updated and points to the server, issue the certificate:

```bash
sudo certbot --nginx -d {your_domain_or_subdomain}
```

## Check the status and final configuration

- Make sure the backend has started successfully:

```bash
systemctl status dv-merchant
```

- Go to `http://{your_domain_or_subdomain}` (or `https://{your_domain_or_subdomain}` if the certificate was issued correctly) and continue configuring the merchant in the browser.