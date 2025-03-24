#!/bin/bash

# Criar diretório da aplicação
sudo mkdir -p /var/www/etus-backoffice

# Copiar arquivos do projeto
sudo cp -r ./* /var/www/etus-backoffice/

# Instalar dependências
cd /var/www/etus-backoffice
npm install
cd frontend && npm install && npm run build
cd ../backend && npm install

# Configurar Nginx
sudo cp nginx.conf /etc/nginx/sites-available/etus-backoffice
sudo ln -s /etc/nginx/sites-available/etus-backoffice /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configurar PM2 para gerenciar o processo Node
sudo npm install -g pm2
cd /var/www/etus-backoffice/backend
pm2 start src/server.ts --name etus-backend
pm2 save

# Configurar SSL (opcional, descomente se necessário)
# sudo certbot --nginx -d backoffice.etus.digital 