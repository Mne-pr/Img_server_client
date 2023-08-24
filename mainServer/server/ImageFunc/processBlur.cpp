#include <iostream>
#include <fstream>
#include <opencv2/opencv.hpp>
#include <experimental/filesystem>

namespace fs = std::experimental::filesystem;
using namespace std;

// 이미지 블러 함수
void processBlur(int blurWidth, int blurHeight, const string& imagePath)
{
	string extension = fs::path(imagePath).extension().string();
	cv::Mat image;

	// 출처 디렉토리 경로
	string outputDir = fs::path(imagePath).parent_path().string();
  
	// 처리된 이미지 파일 경로
	string outputFileName = "Blur_" + fs::path(imagePath).filename().string();

	// 처리된 이미지의 경로
	string outputImagePath = fs::path(outputDir) / outputFileName;
  
	// 확장자 유효성 검사
	if (extension == ".png" || extension == ".bmp" || extension == ".tiff" || extension == ".tif") 
		image = cv::imread(imagePath, cv::IMREAD_UNCHANGED);
	else if (extension == ".jpg" || extension == ".jpeg") 
		image = cv::imread(imagePath, cv::IMREAD_COLOR);
	else if (extension == ".webp" || extension == ".hdr" || extension == ".pfm")
		image = cv::imread(imagePath, cv::IMREAD_ANYCOLOR);
	else {
		// 여기까지 오지도 않을테지만.. 이미지를 처리하지 않고 더미이미지를 내보낼 것
		ifstream src("./Dummy.jpg", ios::binary);
		ofstream dest(outputImagePath+".jpg", ios::binary);
		dest << src.rdbuf();
		return;
	}

	// 블러 처리
	cv::GaussianBlur(image, image, cv::Size(blurWidth, blurHeight), 0);

	// 처리된 이미지 결과 저장
	cv::imwrite(outputImagePath, image);

}

// 메인함수
int main(int argc, char** argv)
{
	if (argc != 4)
	{
		cout << "Usage: " << argv[0] << " <image_path>" << endl;
		return -1;
	}

	int blurWidth = stoi(argv[1]);
	int blurHeight = stoi(argv[2]);
	string imagePath = argv[3];
	processBlur(blurWidth, blurHeight, imagePath);

	return 0;
}
