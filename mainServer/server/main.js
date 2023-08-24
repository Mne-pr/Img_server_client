import express from 'express'
import path from'path'
import fs from 'fs'
import cors from 'cors'
import { execSync } from 'child_process'
// 추가로 만든 모듈
import validateImage from './Func/F_validateImage.js'
import haveToDo from './Func/detByProb.js'
// 제일 아래쪽에 한 번에 에러 처리하기
import createError from 'http-errors'
// formdata 요청을 parse 하기 위한 multer
import multer from 'multer'
// 무작위 문자열 생성
import crypto from 'crypto'
//path 불러옴
import { inputImagesPath, outputImagesPath, projPath, anotherServ, simulateFileName, simulateFile } from './paths.js'

const app = express()
// CORS 미들웨어 설정
app.use(cors({ origin: '*' }))
const upload = multer()
// 다른 서버로 toss 할 확률
const probabilityToss = 50

// 추가 옵션이 있는 작업들, 없는 작업들
const plusOptionProcess = ['Blur']
const noneOptionProcess = ['Inverse']

app.get('/', (req, res) => {
	console.log('success')
	res.json({result: "Hi"})
})


app.get('/download/:fileName', (req, res) => {
	const fileName = req.params.fileName;
	const filePath = projPath+outputImagesPath+'/'+fileName
  
	// 파일이 존재하는지 확인
	if (fs.existsSync(filePath)) {    
		// 파일이 존재하면 해당 파일을 클라이언트로 전송
		res.sendFile(filePath, (err) => {
			if (err) {
				// 전송중 오류 발생 시 에러처리
				console.error('Error while sending file:', err)
				res.status(500).json({ error: 'Failed to send file' })
			} else {
				// const randomString = crypto.randomBytes(6).toString('hex') 
				// 6자리 무작위 문자열 생성
				// const modifiedFileName = `${randomString}_${fileName}`
				// const modifiedFilePath = path.join(outputImagesPath, modifiedFileName)
				// 한 번 파일 받으면 다시 받지 못 하도록 변경.. 굳이?
				// fs.rename(filePath, modifiedFilePath, (err) => {
				//   if (err) {
				//     console.error('Error while renaming file:', err)
				//   } else {
				//     console.log('File renamed successfully:', modifiedFileName)
				//   }
				// })
			}
		})
		var whathappen = `===========================\n`
		whathappen += `command: Download, fileName: ${fileName}\n`
		whathappen += `Download Complete!\n`
		console.log(whathappen,`===========================\n\n`)
	} else {
		// 파일이 존재하지 않을 경우 에러 반환
		res.status(404).json({ error: 'File not found' })
	}
})


// POST /DoIt 엔드포인트
app.post('/DoIt', upload.single('image'),(req, res) => {
	
	var whathappen = "===========================\n"
	
	// 우선 여기서 작업할지 다른 곳에서 작업하도록 할지를 확인함
	if (haveToDo(probabilityToss)){
		console.log(whathappen,"request tossed\n===========================\n\n")
		res.status(202).json({"AnotherServ" : anotherServ, "status" : "toss"})
		return
	}

	// 클라이언트로부터 이미지 데이터 받기 전에 시뮬레이션인지 확인
	// 시뮬레이션인 경우 대상파일과 이름은 고정임
	const isThisSim = req.body.sentType
	let imageData = ''
	const command = req.body.option
	let originalFileName = ''

	if (isThisSim === "sim") {
		originalFileName = simulateFileName
	} else {
		imageData = req.file.buffer
		originalFileName = req.body.fileName
	}

	// 파일 이름에 시간 정보 추가
	const timestamp = new Date().toISOString().replace(/[:.]/g, '') 
		// 날짜와 시간에서 콜론,마침표 제거
	const fileName = `${path.parse(originalFileName).name}-${
		timestamp
		}${path.extname(originalFileName)}` 
		// 원본파일 이름에 타임스탬프 추가
	//const encodedFileName = encodeURIComponent(fileName)

	// 이미지를 파일로 저장. 시뮬레이션인 경우 파일 복사
	const imagePath = projPath+inputImagesPath+'/'+fileName
	if (isThisSim === "sim") { // 시뮬레이션 파일 복사
		fs.copyFileSync(projPath+simulateFile, imagePath)
	} else { // 받은 파일 저장
		fs.writeFileSync(imagePath, imageData, 'base64')
	}

	// 유효성 검사
	validateImage(imagePath)

	// 옵션 필요한 명령어인지 아닌지 확인. 추가 옵션에 따른 명령문 세팅
	let com = ``
	if (noneOptionProcess.includes(command)) {
		com = `${projPath}/ImageFunc/process${command} ${imagePath}`
	}
	else {
		switch(command){
			case "Blur":
				let {width: blurWidth, height: blurHeight} = JSON.parse(req.body.blurMaskSize)
				com = `${projPath}/ImageFunc/process${command} ${blurWidth} ${blurHeight} ${imagePath}`
				break;
			default:
				break;
		}
	}
	
	// 명령에 맞는 적절한 실행파일 실행
	execSync(com)

	// 이후 생성된 파일위치 이동
	fs.renameSync(`${projPath}${inputImagesPath}/${command}_${fileName}`, 
		`${projPath}${outputImagesPath}/${command}_${fileName}`)

	// 처리된 이미지 파일의 다운로드 링크(사실 이름)를 반환
	const downloadLink = `${command}_${fileName}`
	res.json({ "downloadUrl": downloadLink, "status": "complete" })
	
	whathappen += `command: ${command}, fileName: ${originalFileName}\n`
	whathappen += `${command} Complete!\n`
	console.log(whathappen,"===========================\n\n")



})

app.use(function(err, req, res, next) {
	// 에러 로깅 또는 다른작업 수행
	console.log('Request : ',req.url)
	console.log('Method : ',req.method)
	console.log('Message : ',err)
  
	// 클라이언트에게 오류 응답 반환
	res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
	return
})

app.listen(15151, () => {
	console.log('Server is running on port 15151')
})
