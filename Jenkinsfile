pipeline {
    agent any

    tools {
        nodejs '์Node25' // Matches the tool name configured in Jenkins (Note: contains Thai character)
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Build and tag the image
                    // Replace 'your-username' with your Docker Hub username
                    docker.build("${env.DockerHubName}/ayee-portal:${env.BUILD_ID}")
                    docker.build("ayee-portal:latest")
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Example deployment steps:
                    // 1. Push image to registry
                    docker.withRegistry('', 'docker-hub-credentials-id') {
                        docker.image("${env.DockerHubName}/ayee-portal:${env.BUILD_ID}").push()
                        docker.image("${env.DockerHubName}/ayee-portal:latest").push()
                    }
                    
                    // 2. SSH into VPS and update service
                    sshagent(['vps-ssh-credentials-id']) {
                        sh "ssh ${env.VPSUser}@${env.VPSIP} 'cd ../srv/apps/ayee_portal && docker-compose pull && docker-compose up -d'"
                    }
                    
                    echo 'Deployment stage is ready to be configured. Uncomment steps in Jenkinsfile to enable.'
                }
            }
        }
    }
}
