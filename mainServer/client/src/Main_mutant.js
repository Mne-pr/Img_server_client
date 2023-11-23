import React, { useRef, useEffect } from 'react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

import { BlurOption, InverseOption } from './additional_option'

// real server address 
const S = 'http://shr.mne-pr.site:15151' 

function App(props) {
	
	
	// eslint-disable-next-line
	const [errorMessage, setErrorMessage] = useState('')
	// eslint-disable-next-line
	const [fileName, setFileName] = useState('')
	// eslint-disable-next-line
	const [selectedOperation, setSelectedOperation] = useState('Blur')
	// eslint-disable-next-line
	const [downloadBtn, setDownloadBtn] = useState(false)
	// eslint-disable-next-line
	const [downloadLink, setDownloadLink] = useState('')
	const [serverLink, setServerLink] = useState(S)
	// eslint-disable-next-line
	const [uploadOrDownload, setUploadOrDownload] = useState("n")
	// eslint-disable-next-line
	const [isWhatServer, setIsWhatServer] = useState("")

	// simulation
	// const [isThisSimulate, setIsThisSimulate] = useState("normal")
	// const operationList = ["Blur","Inverse"]


	// ---------------------------------------------- 정리된 상태들

	// 가로길이 구하기 위한 훅
	const imgContainerRef               = useRef(null)
	// 전체화면 높이
	const [containerH, setContainerH]   = useState(0)
	// 작업목록
	const [taskList, setTaskList]       = useState([[0,'블러','블러처리를 합니다'],[1,'반전','반전처리를 합니다']])
	// 작업내용
	const [curTask, setCurTask]         = useState(-1)
	// 진행된 작업목록 - 서버로 넘길 것
	const [comTaskList,setComTaskList]  = useState([]);
	// 이미지 선택여부 - 이미지 데이터
	const [iSelected, setISelected]     = useState(null)
	// 이미지 크기
	const [iSize, setISize]             = useState({ w: 0, h: 0})
	// 블러 마스크 크기
	const [mSize, setMSize]             = useState({ w: 11, h: 11 })
	// 진행된 작업 상세정보 출력여부
	const [showComTask, setShowComTask] = useState(-1)
	// 진행된 작업 아이디
	var comTaskId = 0



	// function getRandomInt(min, max) { // 시뮬레이션용 랜덤
	// 	// 실수 입력방지용
	// 	min = Math.ceil(min)
	// 	max = Math.floor(max)
	// 	return Math.floor(Math.random() * (max - min + 1)) + min
	// }

	const resetOptSelected = () => {
		setMSize({ w:11, h:11 })
		setCurTask(-1)
	}

	const resetAll = () => { // 작업목록까지 들고올까 했는데 일단보류
		resetOptSelected()
		setComTaskList([])
		setISelected(null)
		setISize({ w:0, h:0 })
	}

	// 이미지 입력받기 - 차후 수정(상태관련)
	const isImageFile = (file) => { return file.type.startsWith('image/') }
	const onDrop = (acceptedFiles) => {
		resetAll()
		const originalFileName = acceptedFiles[0].name
		const renamedFileName = originalFileName.replace(/[( )]/g, '')
		setFileName(renamedFileName)

		if (acceptedFiles && acceptedFiles.length > 0) {
			const file = acceptedFiles[0]
			const reader = new FileReader()

			if(isImageFile(file)){
				reader.onload = () => {
					const image = new Image()
					image.src = reader.result
					image.onload = () => {
						setISelected(file)
						setISize({w: image.width, h: image.height})
					}
				}
			} else {
				//setErrorMessage('Invalid Image File')
				setISelected(null)
				return
			}
			setServerLink(S)
			reader.readAsDataURL(file)
		}
		// 이미지 받아서 서버로 토스
		//handleSubmit()
	}
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	// 이미지 서버에 보냄 - 받아서 출력까지
	const handleSubmit = async (e) => {
		e.preventDefault()

		// image trasmit logic by axios
		if(iSelected) {
			try{
				//setUploadOrDownload("u_ing")
				const formData = new FormData()
				formData.append('image', iSelected)
				formData.append('option', selectedOperation)
				formData.append('fileName', fileName)
				//formData.append('sentType', isThisSimulate)
				// add plus option
				formData.append('blurMaskSize',JSON.stringify(mSize))

				let response = await axios.post(serverLink + '/DoIt', formData)
				if (response.data['status'] === "toss"){
					setIsWhatServer("sub")
					setServerLink(response.data['AnotherServ'])
					console.log('new link : ', response.data['AnotherServ'])
					response = await axios.post(response.data['AnotherServ'] + '/DoIt', formData)
				} else {
					setIsWhatServer("main")
				}

				// get download link from server 
				setDownloadLink(response.data['downloadUrl'])

				// active download button
				//setDownloadBtn(true)
				//setUploadOrDownload("u_complete")

			} catch(err){
				console.error('Submit Error',err)
			}
		}
	}

	const handleDownload = () => {
	// 	setUploadOrDownload("d_ing")
	// 	if (downloadLink) {
	// 		axios
	// 			.get(serverLink + '/download/' + downloadLink, { responseType: 'blob' })
	// 			.then((response) => {
	// 				const url = window.URL.createObjectURL(new Blob([response.data]))
	// 				const link = document.createElement('a')
	// 				link.href = url
	// 				link.setAttribute('download', downloadLink)
	// 				document.body.appendChild(link)
	// 				link.click()
	// 				document.body.removeChild(link)
	// 				window.URL.revokeObjectURL(url)
	// 				setUploadOrDownload("d_complete")
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error downloading file:', error)
	// 			})
	// 	}
	}

	// 시뮬레이션 전용으로, 다른 옵션은 모두 랜덤으로 진행함
	const handleSimulateChange = (event) => {
	// 	if(event.target.checked){
	// 		// 일단 기본세팅
	// 		handleCancel()
	// 		setErrorMessage('')
	// 		setIsThisSimulate("sim")
	// 		setSelectedImage({name: "Marigold.webp"})
	// 		setImageSize({width: 690, height: 690})

	// 		// 이제 옵션마다 변화를 준다거나..? 자동선택한다거나 하기. 일단은 작업만
	// 		// 시뮬레이션 프로그램은 단지 simulation? 체크박스만 클릭하고 업로드버튼 클릭하도록 ㅇㅇ
	// 		setSelectedOperation(operationList[getRandomInt(0,1)])

	// 	} else {
	// 		handleCancel()
	// 	}

	}

	// 작업 선택 끝 -> 서버에 보낼 데이터를 갱신
	const addCompleteTask = (who, data) => {
		const task = taskList.find(item => item[0] === who)
		if (task) {
			setComTaskList(prev => [...prev, [...task, comTaskId, data]])
		}
		comTaskId += 1
	} 


	//onCreate
	useEffect ( () => {
		// 함수 정의
		const updateContainerH = () => {
			const containerW = imgContainerRef.current.clientWidth
			setContainerH(containerW)
		}
		// eslint-disable-next-line 
		const getTasks = async () => {
			let res = await axios.get(serverLink + '/tasks')
			setTaskList(res.data)
		}

		// 초기 로딩 시 호출
		updateContainerH()

		// 윈도우 크기 변경할 때마다 호출
		window.addEventListener('resize',updateContainerH)
		
		// 서버에 가능한 작업목록 요청, 저장
		// getTasks()
		
		// 컴포넌트 언마운트 - 이벤트 리스너 제거
		return () => { window.removeEventListener('resize',updateContainerH) }
	}, [])

	return (
		<div className="main">
			
			<div id="mainText" style={{ justifyContent: 'center', marginBottom: '-2%'}}>
					<h1 style={{ fontSize: "3vw" }}>image transformer</h1>
			</div>
			
			<div ref={imgContainerRef} className="imgRow" style={{height: `${containerH/2}px`}}>
				<form onSubmit={handleSubmit} style={{ width: "50%", margin: '5px' }}>
					{/* input image pannel */}
					<div
						{...getRootProps()}
						id="imgUploadContainer" className="imgBox" style={{height: `${containerH/2}px`}}
					>
						{/* input image place message */}				
						<input {...getInputProps()} />
						
						{isDragActive && !iSelected ? ( <p style={{ fontSize: "1.2vw" }}>drop image here</p> ) 
						: !iSelected ? ( <React.Fragment> <p style={{ fontSize: "1.2vw" }}>select image by "CLICK" or drag and drop</p> </React.Fragment> ) : null}

						{/* selected image */}
						{/*{iSelected && ( <img src={isThisSimulate === "sim" ? "Marigold.webp" : URL.createObjectURL(iSelected)} alt="selected" className="img" /> )}*/}
						{iSelected && <img src={URL.createObjectURL(iSelected)} alt="selected" className="img"/>}
					</div>
				</form>

				<div style={{ width: "50%", margin: '5px' }}>
					<div
						id="imgDownloadContainer" className="imgBox" style={{height: `${containerH/2}px`}}
					>
						<React.Fragment> <p style={{ fontSize: "1.2vw" }}>transformed image from server</p> </React.Fragment>
						{/* 서버에서 이미지 받아서 출력하는 곳 */}
					</div>
				</div>
			</div>

			{/* 서버로부터 받아온 옵션목록 출력 */}
			<div className="optRow">
				<div className="selectOpColumn">
					{taskList.map( (item, index) => (
						<button disabled={iSelected ? false : true} key={index} className="selectOpBtn" onClick={() => {setCurTask(item[0]); setShowComTask(-1)}}>{item[1]}</button>
					))}
				</div>

				<div className="addMoreOp" onClick={() => {showComTask !== -1 && setShowComTask(-1)}}>
					{(showComTask !== -1) ? (
						<>
							<p>Option #{showComTask}</p>
							<p className='opName'>{comTaskList[showComTask][1]}</p>
							<p className='opName'>{comTaskList[showComTask][2]}</p>
		
							{Object.entries(comTaskList[showComTask][4]).map(([key, value]) => (
								<p className='opName'>{key} : {value}</p>
							))}
						</>
					) :(curTask === -1) ? null : (
						<>
							<p className='opName'>{taskList[curTask][1]}</p>
							<p className='opName'>{taskList[curTask][2]}</p>
							{(curTask === 0) ? (
								<BlurOption 
									submit={addCompleteTask}
									i={iSize} m={mSize} setm={setMSize}
									reset={resetOptSelected}
								/>
							) : (curTask === 1) ? (
								<InverseOption submit={addCompleteTask} reset={resetOptSelected} />
							) : null}
						</>
					)}
				</div>

				<div className="selectedOpColumn">
					{comTaskList.map( (item, index) => (
						<div key={index} className="selectedOpRow">
							<div style={{ fontSize: "0.9vw", width: "100%"}}>{item[1]}</div>
							<button title="확인/삭제" style={{ fontSize: "0.9vw", padding: "0.6vw" }} onClick={() => {setShowComTask(index)}}></button>
						</div>
					))}			
				</div>
			</div>
		
		</div>

	)
}

export default App

// 일단 들어가자마자 서버한테 연락해야함 -ok
// 받아온 정보를 토대로 할 수 있는 옵션버튼을 생성해야 함 - 비활성화 - ok

// 이미지를 받아오면 바로 서버에게 보냄 - 결과 이미지를 받아서 출력 - not yet - 문제가 있는데 상태 도입하면 해결될지도

// 옵션버튼을 클릭하면 그에대한 상세옵션 창이 정보에 맞게 떠야 함 - ok
// 상세옵션 창에서 확인 클릭하면 서버로 바로 요청 들어가야 함 -not yet
// 받은 거 출력, 적용후 옵션이 떠야 함 - 버튼 클릭하면 상세옵션 떠야하고 - not yet

// 옵