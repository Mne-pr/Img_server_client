from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchWindowException

import time
import os

edge_driver_path = r'C:\Users\Miline\Desktop\msedgedriver.exe'
edge_service = Service(edge_driver_path)
edge_options = Options()
edge_options.use_chromium = True

url = "http://server:50105/simulate"

def goGetEm(driver, wait, simulate_checkbox):

    simulate_checkbox.click()    

    upload_btn =wait.until(EC.element_to_be_clickable((By.ID, "uploadBtn")))
    upload_btn.click()

    wait.until(EC.visibility_of_element_located((By.ID, "uploading")))
    upload_start_time = time.time()
    wait.until(EC.visibility_of_element_located((By.ID, "uploaded")))
    upload_end_time = time.time()
    
    download_btn = wait.until(EC.element_to_be_clickable((By.ID, "downloadBtn")))
    download_btn.click()

    wait.until(EC.visibility_of_element_located((By.ID, "downloading")))
    download_start_time = time.time()
    wait.until(EC.visibility_of_element_located((By.ID, "downloaded")))
    download_end_time = time.time()

    what_server = wait.until(EC.visibility_of_element_located((By.ID, "whatServer"))).text


    with open("client_turnAround_data.csv", "a") as file:
        file.write(f"{what_server},{upload_end_time - upload_start_time},{download_end_time - download_start_time},{download_end_time - upload_start_time}\n")   
 
    simulate_checkbox.click()
    
def main():
    while True:
        try:
            if not os.path.exists("client_turnAround_data.csv"):
                header = "server,upload_time,download_time,cycle_time\n"  # 헤더 행 생성
                with open("client_turnAround_data.csv", "w") as file:
                    file.write(header)  # 헤더 행 저장
            
            driver = webdriver.Edge(service=edge_service, options=edge_options)
            wait = WebDriverWait(driver, 30)
            driver.get(url)
            driver.minimize_window()
            simulate_checkbox = driver.find_element(By.ID, "simulateCheckbox")
            while(True):
                goGetEm(driver, wait,simulate_checkbox)

        except NoSuchWindowException as e:
            print(e)
            print("종료하는 중...")
            driver.quit()
            print("종료됨")
            break
        except Exception as e:
            print(e)
            print("재시작하는 중...")
            driver.quit()

main()
