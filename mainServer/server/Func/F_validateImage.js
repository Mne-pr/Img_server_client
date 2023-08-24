import createError from 'http-errors'
import fs from 'fs'
import path from 'path'
import imageType from 'image-type'

async function validateImage(imagePath) {
	// opencv에서 지원하는 이미지 형식인지 확인하기 위함
	const validExtensions = 
		[".jpg",".jpeg",".png",".bmp",".gif",".tiff",".tif",".hdr",".pfm",".webp"]
	const extname = path.extname(imagePath).toLowerCase()

	// 이미지 확장자와 시그니쳐가 동일한지를 확인하기 위함
	const imageBuffer = fs.readFileSync(imagePath)
	const type = imageType(imageBuffer)

	if (!type || !validExtensions.includes(extname)){
		throw createError(400, 'Invalid image format')
	}
}

export default validateImage
