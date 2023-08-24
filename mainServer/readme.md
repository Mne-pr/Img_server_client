<h1>메인서버</h1>
<h3>엣지 컴퓨팅의 메인서버입니다.</h3>

AWS의 {Ubuntu Server 22.04 LTS(HVM), SSD Volume Type} 인스턴스에서 정상작동합니다.</br>
아래의 코드를 실행해 프로젝트에서 필요한 패키지들을 다운받기 바랍니다.</br></br>

apt-get install python3</br>
apt-get install nodejs</br>
apt-get install g++</br>
apt-get install libopencv-dev</br>
npm i -g nodemon</br></br>

/mainServer/server와 /mainServer/client 에서 npm install 을 실행하십시오</br></br>

이후, /mainServer/server/ImageFunc/\*.cpp 파일들을 빌드하십시오</br>
ex) processBlur.cpp 파일을 빌드하는 경우</br>
g++ -o processBlur processBlur.cpp -lopencv_core -lopencv_imgproc -lopencv_highgui -lopencv_imgcodecs -lstdc++fs</br></br>

/mainServer/server/paths.js 에서 프로젝트 폴더 위치와 서브서버의 주소를 조정하십시오</br></br>

이후 /mainServer/server/main.js 파일을 실행하십시오</br>
ex) nodemon mainServer/server/main.js</br></br>

클라이언트 서버를 실행하려면 /mainServer/server 에서 npm start 명령어를 입력하세요.</br>
클라이언트 서버는 50105 포트를 이용해 통신합니다. http://{메인서버주소}:50105 로 접속하세요.</br>
시뮬레이션용 주소는 http://{메인서버주소}:50105/simulate 입니다.</br></br>


status_collector.py 파일은 동작하는 서버의 자원 사용현황을 일정 주기마다 파악하는 프로그램입니다.</br>
python3 status_collector.py 로 실행하세요</br>
python3 status_collector.py 0.5 - 자원 확인 0.5초 주기</br></br>

방화벽에서 15151, 10501 포트를 해제하세요</br></br>
