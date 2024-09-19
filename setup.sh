#!/bin/bash

# Define the repository URL
REPO_URL="https://github.com/your-username/your-repo.git"

# Define the directory name
DIR_NAME="your-repo"

# Clone the repository
echo "Cloning the repository..."
git clone $REPO_URL

# Change to the project directory
cd $DIR_NAME

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Create .env.local file
echo "Creating .env.local file..."
cat <<EOT >> .env.local
NEXT_PUBLIC_BUILDER_API_KEY=your_api_key_here
EOT

# Start the development server
echo "Starting the development server..."
npm run dev