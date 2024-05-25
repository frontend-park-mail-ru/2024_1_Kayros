pipeline {
    agent any

    tools {nodejs "node"}
    
    stages {
        stage('Git') {
            steps {
                git 'https://github.com/frontend-park-mail-ru/2024_1_Kayros'
            }
        }
        stage('Build') { 
            steps {
                sh './build.sh' 
            }
        }
    }
}
