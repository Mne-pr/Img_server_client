#include <iostream>
#include <opencv2/opencv.hpp>
#include <experimental/filesystem>

namespace fs = std::experimental::filesystem;
using namespace std;

// 이미지 처리 함수
void processInverse(const std::string& imagePath)
{
	// 이미지 로드
	string extension = fs::path(imagePath).extension().string();
	cv::Mat image;

	if (extension == ".png" || extension == ".bmp" || extension == ".tiff" || extension == ".tif")
		image = cv::imread(imagePath, cv::IMREAD_UNCHANGED);
	else if (extension == ".jpg" || extension == ".jpeg")
		image = cv::imread(imagePath, cv::IMREAD_COLOR);
	else if (extension == ".webp" || extension == ".hdr" || extension == ".pfm")
		image = cv::imread(imagePath, cv::IMREAD_ANYCOLOR);
	else {
		// 추후에 해결하자.. 더미 파일을 대신 만든다거나,
		std::cout << "Unsupported image format" << std::endl; return;
	}

	// 이미지 반전 처리
	cv::bitwise_not(image, image);

	// 출력 디렉토리 경로
	std::string outputDir = fs::path(imagePath).parent_path().string();

	// 처리된 이미지 파일 이름
	std::string outputFileName = "Inverse_" + fs::path(imagePath).filename().string();

	// 처리된 이미지의 경로
	std::string outputImagePath = fs::path(outputDir) / outputFileName;

	// 이미지 반전 처리 결과 저장
	cv::imwrite(outputImagePath, image);
}

int main(int argc, char** argv)
{
	if (argc != 2)
	{
		cout << "Usage: " << argv[0] << " <image_path>" << endl;
		return -1;
	}

	string imagePath = argv[1];
	processInverse(imagePath);

	return 0;
}
