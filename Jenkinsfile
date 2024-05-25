pipeline {
    agent {
        node {  
            label 'мастер'
            customWorkspace '/home/ubuntu/frontend'
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'ls'
                sh './build.sh' 
            }
        }
    }
}
