# Use the official Node.js image
FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema first (needed for prisma generate in postinstall)
COPY prisma ./prisma/

# Install dependencies (this will run prisma generate via postinstall)
RUN npm install --production

# Copy rest of source code
COPY . .

# Make start script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 3001

# Start the application (migrations will run in start.sh)
CMD ["./start.sh"]