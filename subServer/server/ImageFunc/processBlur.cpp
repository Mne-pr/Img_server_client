#include <iostream>
#include <fstream>
#include <opencv2/opencv.hpp>
#include <experimental/filesystem>

//#include <vector>
//#include <Magick++.h>

namespace fs = std::experimental::filesystem;
using namespace std;
using namespace cv;
//using namespace Magick;

// 이미지 블러 함수
void processImageBlur(int width, int height, const string& imagePath, const Mat& image){

  // 출처 디렉토리 경로
	string outputDir = fs::path(imagePath).parent_path().string();
	// 처리된 이미지 파일 경로
	string outputFileName = "Blur_" + fs::path(imagePath).filename().string();
	// 처리된 이미지의 경로
	string outputImagePath = fs::path(outputDir) / outputFileName;

  Mat blurred;
	// 블러 처리
	GaussianBlur(image, blurred, Size(width, height), 0);
	// 처리된 이미지 결과 저장
	imwrite(outputImagePath, blurred);

}

// void processGifBlur(int width, int height, const string& imagePath){
  
//   // 출처 디렉토리 경로
// 	string outputDir = fs::path(imagePath).parent_path().string();
// 	// 처리된 이미지 파일 경로
// 	string outputFileName = "Blur_" + fs::path(imagePath).filename().string();
// 	// 처리된 이미지의 경로
// 	string outputImagePath = fs::path(outputDir) / outputFileName;
  
//   // 받은 gif 파일을 VideoCapture 클래스로 받음
//   VideoCapture cap(imagePath);
//   // 결과 받을 Mat 타입 vector
//   vector<Mat> blurred_frames;
//   // 처리할 때 프레임 단위의 데이터 임시저장할 Mat타입 변수
//   Mat frame;
  
//   // gif 파일 불러오기 오류가 발생한 경우
//   if (!cap.isOpened()){
//     cerr << "Error opening the file" << endl;
//     return;
//   }
  
//   // 프레임 단위로 받아 처리 후 적재
//   while(true){
//     // cap에서 한 프레임 가져옴. 없으면 끝났으므로 정지
//     cap >> frame;
//     if (frame.empty()) break;
//     // 블러 처리
//     Mat blurred_frame;
//     GaussianBlur(frame, blurred_frame, Size(width, height), 0);
    
//     // blurred에 저장
//     blurred_frames.push_back(blurred_frame);
//   }
  
//   // gif 파일로 재저장하기 위해 list<Image> 객체로 변환 후 저장
//   list<Magick::Image> images;
//   for (const Mat& frame : blurred_frames){
//     Image img
//     if (frame.type() == CV_8UC1){
//       // 흑백인 경우
//       img = Image(frame.cols, frame.rows, "I", CharPixel, frame.data);      
//     } else if (frame.type() == CV_8UC3){
//       // 컬러인 경우
//       img = Image(frame.cols, frame.rows, "BGR", CharPixel, frame.data);
//     }
//     images.push_back(img);
//   }
  
//   // 저장
//   writeImages(images.begin(), images.end(), outputImagePath);
//   return;
// }


// 메인함수
int main(int argc, char** argv)
{
  // 인자 개수 검사
	if (argc != 4)
	{
		cerr << "Usage: " << argv[0] << " <mask_width> <mask_height> <image_path>" << endl;
		return -1;
	}

	const int    blurWidth  = stoi(argv[1]);
	const int    blurHeight = stoi(argv[2]);
	const string imagePath  = argv[3];
  const string ext        = fs::path(imagePath).extension().string();
	Mat image;
  
  // 블러 크기 검사
  if (blurWidth % 2 == 0 || blurHeight % 2 == 0){
    cerr << "sorry, blurWidth and blurHeight must be odd" << endl;
    return -1;
  }
  
  // 확장자 검사
  if (ext == ".png" || ext == ".bmp" || ext == ".tiff" || ext == ".tif") 
		image = imread(imagePath, IMREAD_UNCHANGED);
	else if (ext == ".jpg" || ext == ".jpeg") 
		image = imread(imagePath, IMREAD_COLOR);
	else if (ext == ".webp" || ext == ".hdr" || ext == ".pfm")
		image = imread(imagePath, IMREAD_ANYCOLOR);
	else if (ext == ".gif"){} else{
    cerr << "sorry, Unsupported image format : " << ext << endl;
		return -1;
	}
  
  // 블러처리 시작
  if (image.data != NULL){
    processImageBlur(blurWidth, blurHeight, imagePath, image); 
  } else if (image.data == NULL && ext == ".gif"){
    // processGifBlur(blurWidth, blurHeight, imagePath);
    // 언젠가 libmagick++-dev 라이브러리가 제대로 설치되는 날이 오기를..
  }
  
	return 0;
}
