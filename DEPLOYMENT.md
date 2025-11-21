# Deployment Guide

This guide explains how to deploy the AyeePortal application to a VPS server using Docker and Jenkins.

## Prerequisites

1.  **VPS Server**: A server running Linux (Ubuntu/Debian recommended).
2.  **Docker**: Installed on the VPS.
3.  **Docker Compose**: Installed on the VPS.
4.  **Docker Hub Account**: To store your Docker images.

## Step 1: Prepare the VPS

1.  **Install Docker & Docker Compose**:

    ```bash
    # Update packages
    sudo apt update

    # Install Docker
    sudo apt install docker.io -y

    # Install Docker Compose
    sudo apt install docker-compose -y

    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker

    # Add current user to docker group (optional, to run without sudo)
    sudo usermod -aG docker $USER
    ```

2.  **Create Application Directory**:

    ```bash
    mkdir -p ~/ayee-portal
    cd ~/ayee-portal
    ```

3.  **Copy `docker-compose.yml`**:
    Copy the `docker-compose.yml` file from your project to the `~/ayee-portal` directory on your VPS.

## Step 2: Configure Jenkins Credentials

1.  **Docker Hub Credentials**:
    - Go to Jenkins > Manage Jenkins > Manage Credentials.
    - Add a new "Username with password" credential.
    - ID: `docker-hub-credentials-id`.
    - Username/Password: Your Docker Hub login.

2.  **VPS SSH Credentials**:
    - Add a new "SSH Username with private key" credential.
    - ID: `vps-ssh-credentials-id`.
    - Username: The SSH username for your VPS (e.g., `root` or `ubuntu`).
    - Private Key: The private key to access your VPS.

## Step 3: Create Jenkins Pipeline

1.  **New Item**:
    - Go to Jenkins Dashboard > New Item.
    - Enter a name (e.g., `AyeePortal`).
    - Select **Pipeline** and click OK.

2.  **Configure Pipeline**:
    - **Build Triggers**: Check **GitHub hook trigger for GITScm polling**.
    - **Pipeline Definition**: Select **Pipeline script from SCM**.
    - **SCM**: Select **Git**.
    - **Repository URL**: Enter your GitHub repository URL.
    - **Branch Specifier**: `*/main` (or your branch name).
    - **Script Path**: `Jenkinsfile`.

3.  **Environment Variables**:
    - This pipeline requires specific environment variables. You can set these in **Manage Jenkins > System > Global properties > Environment variables** OR inside the job configuration if you have the EnvInject plugin.
    - **DockerHubName**: Your Docker Hub username (e.g., `suttiporn`).
    - **VPSUser**: SSH username for your VPS (e.g., `root`).
    - **VPSIP**: IP address of your VPS.

## Step 4: Configure GitHub Webhook

1.  Go to your GitHub Repository > Settings > Webhooks.
2.  Click **Add webhook**.
3.  **Payload URL**: `http://<your-jenkins-ip>:8080/github-webhook/` (Ensure the trailing slash is present).
4.  **Content type**: `application/json`.
5.  **Which events would you like to trigger this webhook?**: Just the `push` event.
6.  Click **Add webhook**.

## Step 5: Run the Pipeline

1.  Commit and push your changes to GitHub.
2.  The Webhook should automatically trigger a build in Jenkins.
3.  The pipeline will:
    - Checkout code from GitHub.
    - Build the app.
    - Build the Docker image.
    - Push the image to Docker Hub.
    - SSH into your VPS.
    - Pull the new image and restart the container.

## Manual Deployment (Without Jenkins)

If you want to deploy manually:

1.  **Build and Push Image (Local)**:

    ```bash
    docker build -t your-username/ayee-portal:latest .
    docker push your-username/ayee-portal:latest
    ```

2.  **Run on VPS**:
    ```bash
    # On your VPS
    cd ~/ayee-portal
    docker-compose pull
    docker-compose up -d
    ```
