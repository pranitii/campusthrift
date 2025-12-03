# Backend Dockerfile (TypeScript Node + Prisma)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY tsconfig.json prisma ./
COPY src ./src

# Install dev dependencies so we can build and run prisma generate
RUN npm install --legacy-peer-deps

# Generate Prisma client and build
RUN npx prisma generate || true
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --production --legacy-peer-deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY prisma ./prisma
EXPOSE 5000
CMD ["node","dist/index.js"]
