#include <iostream>
#include <opencv2/opencv.hpp>
#include <experimental/filesystem>

namespace fs = std::experimental::filesystem;
using namespace std;
using namespace cv;

// 이미지 처리 함수
void processInverse(const string& imagePath, const Mat& image){
  
  // 출력 디렉토리 경로
	string outputDir = fs::path(imagePath).parent_path().string();
	// 처리된 이미지 파일 이름
	string outputFileName = "Inverse_" + fs::path(imagePath).filename().string();
	// 처리된 이미지의 경로
	string outputImagePath = fs::path(outputDir) / outputFileName;

  Mat blurred;
	// 이미지 반전 처리
	bitwise_not(image, blurred);
	// 이미지 반전 처리 결과 저장
	imwrite(outputImagePath, blurred);
}

int main(int argc, char** argv)
{
	if (argc != 2)
	{
		cerr << "Usage: " << argv[0] << " <image_path>" << endl;
		return -1;
	}

	const string imagePath = argv[1];
	const string ext       = fs::path(imagePath).extension().string();
	Mat image;

  // 확장자 검사
	if (ext == ".png" || ext == ".bmp" || ext == ".tiff" || ext == ".tif")
		image = imread(imagePath, IMREAD_UNCHANGED);
	else if (ext == ".jpg" || ext == ".jpeg")
		image = imread(imagePath, IMREAD_COLOR);
	else if (ext == ".webp" || ext == ".hdr" || ext == ".pfm")
		image = imread(imagePath, IMREAD_ANYCOLOR);
	else {
		cerr << "sorry, Unsupported image format : "<< ext << endl; 
    return -1;
	}
  
	processInverse(imagePath, image);
	return 0;
}
