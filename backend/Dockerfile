FROM node:20-alpine

# Cài đặt build tools cần thiết cho native C/C++ binding của sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

# Cài đặt và build native binary trực tiếp trong Linux container
RUN npm install --production

COPY . .

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]