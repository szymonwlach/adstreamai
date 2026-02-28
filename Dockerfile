# 1. Budowanie aplikacji
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Poprawiony format (z dodanym "=")
ENV NEXT_OUTPUT_STANDALONE=true
RUN npm run build

# 2. Uruchamianie aplikacji
FROM node:20-alpine AS runner
WORKDIR /app

# Poprawiony format (z dodanym "=")
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Poprawiony format (z dodanym "=")
ENV PORT=3000

CMD ["node", "server.js"]