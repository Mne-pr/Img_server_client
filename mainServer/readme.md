<h1>메인서버</h1>
<h3>엣지 컴퓨팅의 메인서버입니다.</h3>

AWS의 {Ubuntu Server 22.04 LTS(HVM), SSD Volume Type} 인스턴스에서 정상작동합니다.</br>
아래의 코드를 실행해 프로젝트에서 필요한 패키지들을 다운받습니다.</br></br>

apt-get install python3</br>
apt-get install nodejs</br>
apt-get install g++</br>
apt-get install libopencv-dev</br>
apt-get install cmake</br>
npm i -g nodemon</br></br>

/mainServer/server와 /mainServer/client 에서 npm install 을 실행합니다.</br></br>

이후, /mainServer/server/ImageFunc/\*.cpp 파일들을 빌드합니다.</br>
ex) processBlur.cpp 파일을 빌드하는 경우,</br>
g++ -o processBlur processBlur.cpp -lopencv_core -lopencv_imgproc -lopencv_highgui -lopencv_imgcodecs -lstdc++fs</br></br>

/mainServer/server/paths.js 에서 프로젝트 폴더 위치와 서브서버의 주소를 지정합니다.</br></br>

이후 /mainServer/server/main.js 파일을 실행합니다.</br>
ex) nodemon mainServer/server/main.js</br></br>

클라이언트 서버를 실행하려면 /mainServer/server 에서 npm start 명령어를 입력하세요.</br>
클라이언트 서버는 50105 포트를 이용해 통신합니다. http://{메인서버주소}:50105 로 접속하세요.</br>
시뮬레이션용 주소는 http://{메인서버주소}:50105/simulate 입니다.</br></br>

status_collector.py 파일은 동작하는 서버의 자원 사용현황을 일정 주기마다 파악하는 프로그램입니다.</br>
python3 status_collector.py 로 실행하세요</br>
python3 status_collector.py 0.5 - 자원 확인 0.5초 주기</br></br>

방화벽에서 15151, 10501 포트를 해제합니다.</br></br>

nodejs 설치/실행에 문제가 있는 경우 조치할 수 있는 해결방안은 다음과 같습니다.</br>
libnode72 패키지, nodejs 패키지를 삭제하고 nodejs 패키지를 재설치합니다.</br>
설치된 nodejs 버전이 16 이상인지 확인하고, update 시도 후에도 버전의 변화가 없다면(wsl2) nvm을 이용해 16버전을 사용하도록 합니다.
