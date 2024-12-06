# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and pnpm-lock.yaml files
COPY package*.json pnpm-lock.yaml ./

# Install the dependencies
RUN npm install -g pnpm && pnpm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN pnpm run build

# Expose the port your application will run on (e.g., 3000)
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]