# stage1 build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

#stage2 production
FROM node:18-alpine


#non root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /app ./

USER appuser
EXPOSE 3000

CMD ["node", "index.js"]