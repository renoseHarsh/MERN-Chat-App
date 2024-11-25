FROM node:lts
WORKDIR /app
COPY . .
RUN npm run build
CMD ["npm", "start", "build"]