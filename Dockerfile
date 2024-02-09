# BUILD STAGE
FROM node:16-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Build the app
COPY tsconfig.json .
COPY public ./public
COPY src ./src
RUN npm run build


# PROD STAGE
FROM nginx:stable-alpine

# Copy static app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Add config for nginx and start script
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY start.sh ./

EXPOSE 3000

ENTRYPOINT [ "./start.sh" ]
