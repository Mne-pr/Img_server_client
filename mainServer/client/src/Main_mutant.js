import React, { useRef, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

// real server address 
const S = 'http://shr.mne-pr.site:15151' 

function App(props) {
	
	// entire page needed
	const [selectedImage, setSelectedImage] = useState(null)
	// eslint-disable-next-line
	const [errorMessage, setErrorMessage] = useState('')
	// eslint-disable-next-line
	const [imageSize, setImageSize] = useState({ width: 0, height: 0})
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
	const [isThisSimulate, setIsThisSimulate] = useState("normal")
	// const operationList = ["Blur","Inverse"]

	// plus option
	const [blurMaskSize, setBlurMaskSize] = useState({width: 11, height: 11})
	// const handleBlurWidthChange = (event) => {setBlurMaskSize((prevState) => ({...prevState, width:event.target.value}))}
	// const handleBlurHeightChange = (event) => {setBlurMaskSize((prevState) => ({...prevState, height:event.target.value}))}


	// 이미지 너비높이
	const imgContainerRef = useRef(null)
	const [containerH, setContainerH] = useState(0)
	// useEffect == onCreate
	useEffect(()=> {
		const updateContainerH = () => {
			const containerW = imgContainerRef.current.clientWidth
			setContainerH(containerW)
		}
		// 초기 로딩 시 호출
		updateContainerH()
		// 윈도우 크기 변경할 때마다 호출
		window.addEventListener('resize',updateContainerH)
		// 컴포넌트가 언마운트될 때? 이벤트 리스너 제거
		return () => {
			window.removeEventListener('resize',updateContainerH)
		}
	}, [])

	  

	// function getRandomInt(min, max) {
	// 	// 실수 입력방지용
	// 	min = Math.ceil(min)
	// 	max = Math.floor(max)
	// 	return Math.floor(Math.random() * (max - min + 1)) + min
	// }



	const onDrop = (acceptedFiles) => {
		handleCancel()
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
						setSelectedImage(file)
						setImageSize({width: image.width, height: image.height})
					}
				}
			} else {
				setErrorMessage('Invalid Image File')
				setSelectedImage(null)
				return
			}
			setServerLink(S)
			reader.readAsDataURL(file)
		}
	}

	const isImageFile = (file) => {
		return file.type.startsWith('image/')
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	const handleCancel = () => {
		setSelectedImage(null)
		setImageSize({width: 0, height: 0})
		setErrorMessage('')
		setDownloadBtn(false)
		setDownloadLink('')
		setServerLink(S)
		setUploadOrDownload("n")
		setIsWhatServer("")
		optionInitialize()
	}

	const optionInitialize = () => {
		setIsThisSimulate("normal")
		setBlurMaskSize({width:11, height:11})
	}
	// const handleRadioSelect = (selected) => {
	// 	setErrorMessage('')
	// 	setDownloadBtn(false)
	// 	setDownloadLink('')
	// 	setSelectedOperation(selected)
	// 	setServerLink(S)
	// }

	const handleSubmit = async (e) => {
		e.preventDefault()

		// image trasmit logic by axios
		if(selectedImage) {
			try{
				setUploadOrDownload("u_ing")
				const formData = new FormData()
				formData.append('image', selectedImage)
				formData.append('option', selectedOperation)
				formData.append('fileName', fileName)
				formData.append('sentType', isThisSimulate)
				// add plus option
				formData.append('blurMaskSize',JSON.stringify(blurMaskSize))

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
				setDownloadBtn(true)
				setUploadOrDownload("u_complete")

			} catch(err){
				console.error('Submit Error',err)
			}
		}
	}

	// const handleDownload = () => {
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
	// }

	// 시뮬레이션 전용으로, 다른 옵션은 모두 랜덤으로 진행함
	// const handleSimulateChange = (event) => {
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

	// }
	
	return (
		<div class="main">
			
			<div id="mainText" style={{ justifyContent: 'center', marginBottom: '-2%'}}>
					<h1 style={{ fontSize: "4vw" }}>image transformer</h1>
			</div>
			
			<div ref={imgContainerRef} class="imgRow" style={{height: `${containerH/2}px`}}>
				<form onSubmit={handleSubmit} style={{ width: "50%", margin: '5px' }}>
					{/* input image pannel */}
					<div
						{...getRootProps()}
						id="imgUploadContainer"
						class="imgBox" style={{height: `${containerH/2}px`}}
					>
						{/* input image place message */}				
						<input {...getInputProps()} />
						{isDragActive && !selectedImage ? (
							<p style={{ fontSize: "1.5vw" }}>drop image here</p>
						) : !selectedImage ? (
							<React.Fragment> <p style={{ fontSize: "1.5vw" }}>select image by "CLICK" or drag and drop</p> </React.Fragment>
						) : null}

						{/* selected image */}
						{selectedImage && (
							<img
								src={isThisSimulate === "sim" ? "Marigold.webp" : URL.createObjectURL(selectedImage)}
								alt="selected" class="img"
							/>
						)}
					</div>
				</form>

				<div style={{ width: "50%", margin: '5px' }}>
					<div
						id="imgDownloadContainer"
						class="imgBox" style={{height: `${containerH/2}px`}}
					>
						<React.Fragment> <p style={{ fontSize: "1.5vw" }}>transformed image from server</p> </React.Fragment>
						{/* 서버에서 이미지 받아서 출력하는 곳 */}
					</div>
				</div>
			</div>
		
			<div class="optRow">
				{/* 사용할 수 있는 정보처리의 옵션들도 모두 서버에서 받아오는 게 맞지 않을까 */}
				<div class="selectOpColumn">
					<button class="selectOpBtn">옵션 1</button>
					<button class="selectOpBtn">옵션 2</button>
					<button class="selectOpBtn">옵션 3</button>
					<button class="selectOpBtn">옵션 4</button>
					<button class="selectOpBtn">옵션 5</button>
					<button class="selectOpBtn">옵션 6</button>
					<button class="selectOpBtn">옵션 7</button>
					<button class="selectOpBtn">옵션 8</button>
					<button class="selectOpBtn">옵션 9</button>
					<button class="selectOpBtn">옵션 10</button>
					<button class="selectOpBtn">옵션 11</button>
					<button class="selectOpBtn">옵션 12</button>
				</div>
				<div style={{ width: "60%", border: '1.5px solid black',  margin:'5px', backgroundColor: "#eee" }}>
					옵션창
				</div>
				<div class="selectedOpColumn">
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw", width: "100%"}}>옵션 1</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw"}}>옵션 2</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw"}}>옵션 3</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw"}}>옵션 4</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw"}}>옵션 5</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw", width: "100%"}}>옵션 1</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw"}}>옵션 2</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw"}}>옵션 3</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw"}}>옵션 4</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
					<div class="selectedOpRow">
						<div style={{ fontSize: "1.2vw"}}>옵션 5</div>
						<button title="확인/삭제" style={{ fontSize: "1.2vw", padding: "0.6vw" }}></button>
					</div>
				</div>
			</div>
		
		</div>
		

		// <div style={{ display: 'flex', justifyContent: 'center' }}>
		// 	{/* selected image */}
		// 	<div style={{ margin: '20px' }}>
		// 		<div style={{justifyContent: 'center'}}>
		// 			<h1 style={{ fontSize: isMobile ? '24px' : '36px' }}>image transformer</h1>
		// 		</div>
		// 		<form onSubmit={handleSubmit}>

		// 			{/* input image pannel */}
		// 			<div
		// 				{...getRootProps()}
		// 				id="imgUploadContainer"
		// 				style={{
		// 					width:  isMobile ? 300 : 500, 
		// 					height: isMobile ? 300 : 500,
		// 					border: '1.5px dashed black',
		// 					display: 'flex',
		// 					flexDirection: 'column',
		// 					alignItems: 'center',
		// 					justifyContent: 'center',
		// 					cursor: 'pointer',
		// 					marginBottom: '10px',
		// 					position: 'relative',
		// 				}}
		// 			>

		// 				{/* input image place message */}
		// 				<input {...getInputProps()} />
		// 				{isDragActive && !selectedImage ? (
		// 					<p style={{ fontSize: isMobile ? '10px' : '18px' }}>drop image here</p>
		// 				) : !selectedImage ? (
		// 					<React.Fragment>
		// 						<p style={{ fontSize: isMobile ? '10px' : '18px' }}>select image by click or drag and drop</p>
		// 					</React.Fragment>
		// 				) : null}

		// 				{/* selected image */}
		// 				{selectedImage && (
		// 					<img
		// 						src={isThisSimulate === "sim" ? "Marigold.webp" : URL.createObjectURL(selectedImage)}
		// 						alt="selected"
		// 						style={{
		// 							maxWidth: '100%', maxHeight: '100%',
		// 							position: 'absolute',
		// 							top: '50%', left: '50%',
		// 							transform: 'translate(-50%, -50%)',
		// 						}}
		// 					/>
		// 				)}
		// 			</div>

		// 			{/* print information of selected image */}
		// 			{errorMessage ? (
		// 				<div>
		// 					<p style={{ color: 'red' }}>{errorMessage} - {fileName}</p>
		// 					<p style={{ color: 'white', userSelect: 'none' }}>T</p>
		// 				</div>
		// 			) : selectedImage ? (
		// 				<div>
		// 					<p>{selectedImage.name}</p>
		// 					<p>{imageSize.width} x {imageSize.height}</p>
		// 				</div>
		// 			) : (
		// 				<div>
		// 					<p style={{ color: 'white', userSelect: 'none' }}>T</p>
		// 					<p style={{ color: 'white', userSelect: 'none' }}>T</p>
		// 				</div>
		// 			)}

		// 			{/* select option */}
		// 			<div style={{marginBottom: '10px'}}>
		// 				<label>
		// 					<input
		// 						type="radio" value="Blur"
		// 						checked={selectedOperation === 'Blur'}
		// 						onChange={() => handleRadioSelect('Blur')}
		// 						disabled={uploadOrDownload !== "n"}
		// 					/>
		// 					Blur
		// 				</label>
		// 				<label>
		// 					<input
		// 						type="radio" value="Inverse"
		// 						checked={selectedOperation === 'Inverse'}
		// 						onChange={() => handleRadioSelect('Inverse')}
		// 						disabled={uploadOrDownload !== "n"}
		// 					/>
		// 					Inverse
		// 				</label>
		// 			</div>

		// 			{/* option and option */}
		// 			{(selectedOperation === "Blur" && selectedImage) ? (
		// 				<div style={{ marginBottom: '10px', display: 'flex' }}>
		// 					<div style={{ marginRight: '10px' }}>
		// 						<label>width (11 ~ {Math.floor((imageSize.width - 11) / 2) * 2 - 1})</label><br />
		// 						<label>height(11 ~ {Math.floor((imageSize.height - 11) / 2) * 2 - 1})</label>
		// 					</div>
		// 					<div>
		// 						<input
		// 						type="range" name="blurWidth"
		// 						value={blurMaskSize.width}
		// 						min={11} max={Math.floor((imageSize.width - 10) / 2) * 2 - 1} step="2"
		// 						disabled={uploadOrDownload !== "n"} onChange={handleBlurWidthChange}
		// 						/>{blurMaskSize.width}<br />
								
		// 						<input
		// 						type="range" name="blurHeight"
		// 						value={blurMaskSize.height}
		// 						min={11} max={Math.floor((imageSize.height - 10) / 2) * 2 - 1} step="2"
		// 						disabled={uploadOrDownload !== "n"} onChange={handleBlurHeightChange}
		// 						/>{blurMaskSize.height}
		// 					</div>
		// 				</div>
		// 			) : null}




		// 			{/* buttons */}
		// 			<div style={{marginBottom: '10px'}}>
		// 				<button type="button" id="cancelBtn" onClick={handleCancel} disabled={!selectedImage}>
		// 					cancel
		// 				</button>
		// 				{downloadBtn ? (
		// 					<button type="button" id="downloadBtn" onClick={handleDownload}>
		// 						download
		// 					</button>
		// 				) : (
		// 					<button type="submit" id="uploadBtn" onClick={handleSubmit} disabled={!selectedImage || errorMessage}>
		// 						upload
		// 					</button>
		// 				)}
		// 			</div>

		// 			{/* simulation checkbox */}
		// 			{(servType === "simulate") ? (
		// 				<div style={{marginBottom: '10px'}}>
		// 					<input type="checkbox" id="simulateCheckbox" checked={isThisSimulate === "sim"} onChange={handleSimulateChange}/>
		// 					<label>Simulation?</label>
		// 				</div>
		// 			) : null}

		// 			{/* status message */}
		// 			<div style={{marginBottom: '10px'}}>
		// 				{(uploadOrDownload === "u_ing") ? (
		// 					<label id="uploading">uploading... </label>
		// 				) : (uploadOrDownload === "u_complete") ? (
		// 					<label id="uploaded">upload complete. </label>
		// 				) : (uploadOrDownload === "d_ing") ? (
		// 					<label id="downloading">downloading... </label>
		// 				) : (uploadOrDownload === "d_complete") ? (
		// 					<label id="downloaded">download complete. </label>
		// 				) : null}
		// 				{(isWhatServer !== "") ? (<label id="whatServer">{isWhatServer}</label>) : (<label>{isWhatServer}</label>)}
		// 			</div>

		// 		</form>
		// 	</div>
		// </div>
	)
}

export default App
