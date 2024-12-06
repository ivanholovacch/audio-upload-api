# Audio Upload API

This is a Node.js API for uploading audio files.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
    - [Running the Docker Container](#running-the-docker-container)
    - [Running Scripts from `package.json`](#running-scripts-from-packagejson)
- [Deployment](#deployment)

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine.
- [Node.js](https://nodejs.org/) version 18 or higher installed on your machine (if running the application locally without Docker).

## Getting Started

### Running the Docker Container

1. Build the Docker image:

   ```bash
   docker build -t audio-upload-api .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 audio-upload-api
   ```

   This will start the Node.js application inside the Docker container and map port 3000 on the host to port 3000 in the container.

### Running Scripts from `package.json`

You can use the following scripts from the `package.json` file:

- `npm start`: Runs the compiled TypeScript code in the `dist/` directory.
- `npm run dev`: Starts the server in development mode using Nodemon, which will automatically restart the server when changes are detected.
- `npm run build`: Compiles the TypeScript code to JavaScript in the `dist/` directory.
- `npm run lint`: Runs the TSLint linter on the TypeScript code.
- `npm run lint:fix`: Runs the TSLint linter and automatically fixes any issues that can be resolved.

To run these scripts, simply use the `npm run <script-name>` command in your terminal.

## Deployment

To deploy your application, you can push the Docker image to a container registry, such as Docker Hub, Amazon Elastic Container Registry (ECR), or Google Container Registry, and then configure your hosting platform (e.g., AWS Elastic Beanstalk, Google Cloud Run, Azure App Service) to pull the Docker image and manage the container lifecycle.

Here's an example of how you can push your Docker image to Docker Hub:

```bash
docker login
docker tag audio-upload-api ivan629/audio-upload-api:ivan629
docker push ivan629/audio-upload-api:ivan629
```

In this example, replace `ivan629` with your Docker Hub username and `audio-upload-api` with the name of your repository.