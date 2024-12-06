# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and npm-lock.yaml files
COPY package*.json package-lock.json ./

# Install the dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your application will run on (e.g., 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]