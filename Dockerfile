# Use the official Node.js image as the base image.
# This version is recommended for stability.
FROM node:18-alpine

# Set the working directory inside the container.
# This is where your application files will be copied.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
# This is done separately to leverage Docker's layer caching.
# If these files don't change, the dependencies won't be reinstalled.
COPY package*.json ./

# Install project dependencies.
RUN npm install --production

# Copy the rest of your application source code into the container.
COPY . .

# Expose the port on which your app runs.
# Render automatically handles the mapping to a public port.
EXPOSE 3000

# Define the command to run your application.
# This assumes your package.json has a "start" script.
CMD ["npm", "start"]
