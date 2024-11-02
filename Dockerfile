# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY client/ .

# Build the React application
RUN npm run build

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Expose port 5000 to the outside world
EXPOSE 5000

# Command to run the application
CMD ["serve", "-s", "build", "-l", "5000"]