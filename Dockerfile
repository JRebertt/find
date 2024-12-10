# Use uma imagem base com Node.js 22 ou superior
FROM node:22

# Configuração do diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json (se disponível)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação, excluindo node_modules
COPY . .

# Executa a build
RUN npm run build

# Define o comando de inicialização
CMD ["npm", "run", "start"]
