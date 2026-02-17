# ----------- Stage 1: Install Dependencies ----------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files
COPY package*.json ./

# Fix npm timeout issues (common on slow networks)
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm install

# ----------- Stage 2: Build App ----------
FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ----------- Stage 3: Run App ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
