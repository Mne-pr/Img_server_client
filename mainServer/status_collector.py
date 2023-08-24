# status = cpu, ram usage
import subprocess
import time
import os
import time
import sys

def format_time(timestamp):
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(timestamp))

def format_bytes(bytes):
    if bytes < 1024:
        return f"{bytes} B"
    elif bytes < 1024 ** 2:
        return f"{bytes / 1024:.2f} KB"
    elif bytes < 1024 ** 3:
        return f"{bytes / 1024 ** 2:.2f} MB"
    else:
        return f"{bytes / 1024 ** 3:.2f} GB"
  
def collect_cpu_usage():
    timestamp = int(time.time())
    command = "top -bn1 | grep '%Cpu(s)'"
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    stdout, stderr = process.communicate()
    if process.returncode == 0:
        data = stdout.strip().split()
        user_cpu = system_cpu = 0.0
        if len(data) >= 8:
            try:
                user_cpu = float(data[1])
                system_cpu = float(data[3])
            except:
                user_cpu = float(100.0)
                system_cpu = float(data[2])
            total_cpu = user_cpu + system_cpu
            return timestamp, total_cpu
    return None

def collect_ram_usage():
    timestamp = int(time.time())
    command = "free -b | grep Mem"
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    stdout, stderr = process.communicate()
    if process.returncode == 0:
        data = stdout.strip().split()
        if len(data) >= 7:
            total_ram = int(data[1])
            used_ram = int(data[2])
            available_ram = total_ram - used_ram
            return timestamp, total_ram, used_ram, available_ram
    return None

def main():
    sleep_time = 5
    if len(sys.argv) == 2:
        sleep_time = float(sys.argv[1])
    print("sleep time is " + str(sleep_time))

    if not os.path.exists("cpu_ram_usage_data.csv"):
        header = "ram_time,used_ram,free_ram,ram_use_percent,,cpu_time,cpu_use_percent\n"  # 헤더 행 생성
        with open("cpu_ram_usage_data.csv", "w") as file:
            file.write(header)  # 헤더 행 저장

    while True:
        ram_data = collect_ram_usage()
        cpu_data = collect_cpu_usage()
        if ram_data and cpu_data:
            ram_timestamp, total_ram, used_ram, available_ram = ram_data
            cpu_timestamp, cpu_use_percent = cpu_data

            formatted_ram_timestamp = format_time(ram_timestamp)
            formatted_used_ram = format_bytes(used_ram)
            formatted_available_ram = format_bytes(available_ram)
            ram_use_percent = used_ram/total_ram * 100
            formatted_cpu_timestamp = format_time(cpu_timestamp)
            
            print(f"{formatted_ram_timestamp}\nram_used(%) : {ram_use_percent}")
            print(f"{formatted_cpu_timestamp}\ncpu_used(%) : {cpu_use_percent}\n")
            with open("cpu_ram_usage_data.csv", "a") as file:
                file.write(f"{formatted_ram_timestamp},{formatted_used_ram},{formatted_available_ram},{ram_use_percent},,{formatted_cpu_timestamp},{cpu_use_percent}\n")
        time.sleep(sleep_time)

if __name__ == "__main__":
    main()


