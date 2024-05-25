pipeline {
    agent {
        node {  
            label 'agent1'
            customWorkspace '/home/ubuntu/frontend'
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh './build.sh' 
            }
        }
    }
}
