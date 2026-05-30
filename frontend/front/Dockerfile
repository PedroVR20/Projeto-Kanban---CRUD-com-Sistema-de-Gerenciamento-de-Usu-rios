# Estágio 1: Compilar o projeto Angular
FROM node:20-alpine as builder
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm install
COPY . .
RUN node --max-old-space-size=4096 ./node_modules/@angular/cli/bin/ng build --configuration production

# Estágio 2: Servir os arquivos estáticos com Nginx
FROM nginx:alpine

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do Angular
COPY --from=builder /app/dist/kanbanapprefatorado/ /usr/share/nginx/html

# Garante que o usuário 'nginx' seja o dono dos arquivos.
# Esta é a forma mais correta de dar permissão.
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
