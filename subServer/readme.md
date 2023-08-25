<h1>서브서버</h1>
<h3>엣지 컴퓨팅을 위한 서브서버입니다.</h3>

구름ide의 인스턴스, AWS의 {Ubuntu Server 22.04 LTS(HVM), SSD Volume Type} 인스턴스에서 정상작동합니다.</br>
아래의 코드를 실행해 프로젝트에서 필요한 패키지들을 다운받기 바랍니다.</br></br>

apt-get install python3</br>
apt-get install nodejs</br>
apt-get install g++</br>
apt-get install libopencv-dev</br>
~~apt-get install libmagick++-dev.. gif를 처리하기 위한 라이브러리였으나.. 라이브러리 다운 시 빌드가 안 되어 실패~~</br>
npm i -g nodemon</br></br>

/subServer/server 에서 npm install 을 실행하십시오</br></br>

이후, /subServer/server/ImageFunc/\*.cpp 파일들을 빌드하십시오</br>
ex) processBlur.cpp 파일을 빌드하는 경우</br>
g++ -o processBlur processBlur.cpp -lopencv_core -lopencv_imgproc -lopencv_highgui -lopencv_imgcodecs -lstdc++fs</br></br>

/subServer/server/paths.js 에서 프로젝트 폴더 위치를 조정하십시오</br></br>

이후 /subServer/server/main.js 파일을 실행하십시오</br>
ex) nodemon subServer/server/main.js</br></br>

status_collector.py 파일은 동작하는 서버의 자원 사용현황을 일정 주기마다 파악하는 프로그램입니다.</br>
python3 status_collector.py 로 실행하세요</br>
python3 status_collector.py 0.5 - 자원 확인 0.5초 주기<br></br>

방화벽에서 15151 포트를 해제하세요</br></br>
