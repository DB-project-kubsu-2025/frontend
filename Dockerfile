# --- build ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- run ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# NEXT_PUBLIC_API_URL=http://backend:8050
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node","server.js"]
