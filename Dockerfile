# Builds only the backend (Express API). Used for Docker-based free hosts
# (e.g. Back4App Containers) as an alternative to Render, which asks some
# regions for a credit card even on the free tier.
FROM node:20-alpine

WORKDIR /app

# Install deps first so Docker can cache this layer across rebuilds
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy the rest of the backend source
COPY backend/ ./

# Most container hosts inject their own PORT at runtime; server.js already
# reads process.env.PORT, falling back to 5000 for local `docker run`.
ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
