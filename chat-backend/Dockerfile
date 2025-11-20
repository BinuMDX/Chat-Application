# Base stage
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development

# Install all dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "start:dev"]

# Build stage
FROM base AS build

# Install all dependencies
RUN npm install

# Copy all files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "run", "start:prod"]
