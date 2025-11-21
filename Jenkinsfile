pipeline {
    agent any

    // tools {
    //    nodejs '์Node25' 
    // }

    stages {
        stage('Install & Build') {
            steps {
                script {
                    // Use a Docker container to build the app
                    // Run as root (-u 0:0) to avoid permission issues with node_modules on the mounted volume
                    docker.image('node:25-alpine').inside('-u 0:0') {
                        sh 'npm ci'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Build and tag the image
                    // Replace 'your-username' with your Docker Hub username
                    docker.build("${env.DockerHubName}/ayee-portal:${env.BUILD_ID}")
                    docker.build("${env.DockerHubName}/ayee-portal:latest")
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Example deployment steps:
                    // 1. Push image to registry
                    docker.withRegistry('', "${env.Jenkins_DockerHubCredentialId}") {
                        docker.image("${env.DockerHubName}/ayee-portal:${env.BUILD_ID}").push()
                        docker.image("${env.DockerHubName}/ayee-portal:latest").push()
                    }
                    
                    // 2. SSH into VPS and update service
                    sshagent(["${env.Jenkins_SSHCredentialId}"]) {
                        sh "ssh ${env.VPSUser}@${env.VPSIP} 'cd ../srv/apps/ayee_portal && docker compose pull && docker compose up -d'"
                    }
                    
                    echo 'Deployment stage is ready to be configured. Uncomment steps in Jenkinsfile to enable.'
                }
            }
        }
    }
}
