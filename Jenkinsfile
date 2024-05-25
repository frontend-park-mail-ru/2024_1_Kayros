pipeline {
    agent any 

    tools {nodejs "recent node"}
    
    stages {
        stage('Build') { 
            steps {
                sh './build.sh' 
            }
        }
    }
}
