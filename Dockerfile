FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package definitions
COPY package.json ./
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
COPY client/package*.json ./client/

# Install dependencies inside the container
RUN cd server && npm install
RUN cd client && npm install

# Copy source files
COPY server/ ./server/
COPY client/ ./client/

# Generate Prisma client and build both projects
RUN cd server && npx prisma generate && npm run build
RUN cd client && npm run build

# Default environment variables
ENV PORT=5000
ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"
ENV JWT_SECRET="swapskill_super_secret_jwt_key_2026_secure"

EXPOSE 5000

# Start backend server which also serves the client build
CMD ["node", "server/dist/index.js"]
