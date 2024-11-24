import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # 使用非交互模式
import matplotlib.pyplot as plt
import neurokit2 as nk
from datetime import datetime, timezone
from scipy.signal import find_peaks
import io
import base64

# 通用函数：将Matplotlib图像保存为Base64
def save_plot_as_base64():
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
    buffer.seek(0)
    base64_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()
    return base64_image

# 皮电信号分析函数
def eda_proc(file_path):
    # 加载 EDA 数据文件
    eda_data = pd.read_csv(file_path, sep='\t', header=None, names=['time', 'signal'])

    # 生成等间隔的时间序列（假设每个点1秒间隔）
    eda_data['time_sec'] = np.arange(len(eda_data))

    # 计算 SCL（皮肤电导水平） - 移动平均
    window_size = 20  # 移动平均窗口大小，取决于数据特点
    eda_data['SCL'] = eda_data['signal'].rolling(window=window_size, min_periods=1).mean()

    # 计算 SCR（瞬时皮电反应） - 差分法
    eda_data['SCR'] = eda_data['signal'].diff().apply(lambda x: x if x > 0 else 0)

    # 保存图表
    plt.figure(figsize=(15, 8))

    # 原始信号
    plt.subplot(3, 1, 1)
    plt.plot(eda_data['time_sec'], eda_data['signal'], color='blue', label='EDA Signal')
    plt.xlabel('Time (s)')
    plt.ylabel('EDA Signal')
    plt.legend()

    # SCL
    plt.subplot(3, 1, 2)
    plt.plot(eda_data['time_sec'], eda_data['SCL'], color='orange', label='SCL (Baseline)')
    plt.xlabel('Time (s)')
    plt.ylabel('SCL')
    plt.legend()

    # SCR
    plt.subplot(3, 1, 3)
    plt.plot(eda_data['time_sec'], eda_data['SCR'], color='green', label='SCR (Response)')
    plt.xlabel('Time (s)')
    plt.ylabel('SCR')
    plt.legend()

    plt.tight_layout()
    image_base64 = save_plot_as_base64()
    # plt.savefig("./sample/eda_analysis.png", dpi=300)  # 保存为高清图片
    plt.close()

    # 返回结果字典
    return {
        # "EDA信号": eda_data['signal'].tolist(),
        # "SCL（皮肤电导水平）": eda_data['SCL'].tolist(),
        # "SCR（瞬时皮电反应）": eda_data['SCR'].tolist(),
        "eda_image": image_base64
    }


# 心率信号分析函数
def ecg_proc(file_path):
    # 加载 ECG 数据文件
    ecg_data = pd.read_csv(file_path, sep='\t', header=None, names=['time', 'signal'])
    
    # 转换时间单位为秒
    ecg_data['time'] = ecg_data['time'] / 1000  # 将毫秒转换为秒
    
    # 使用 NeuroKit2 处理信号以检测 R 峰和其他波形（包括QT间期）
    ecg_signal = ecg_data['signal'].values
    sampling_rate = 1 / np.mean(np.diff(ecg_data['time']))  # 估计采样率，单位为Hz
    
    # 使用 NeuroKit2 进行信号预处理
    ecg_cleaned = nk.ecg_clean(ecg_signal, sampling_rate=sampling_rate)
    signals, info = nk.ecg_process(ecg_cleaned, sampling_rate=sampling_rate)
    
    # 提取 R-R 间隔
    r_peaks = np.where(signals["ECG_R_Peaks"] == 1)[0]
    rr_intervals = np.diff(ecg_data['time'][r_peaks])

    # 计算 HRV 指标
    sdnn = np.std(rr_intervals)  # SDNN
    rmssd = np.sqrt(np.mean(np.square(np.diff(rr_intervals))))  # RMSSD
    pnn50 = np.sum(np.abs(np.diff(rr_intervals)) > 0.05) / len(rr_intervals) * 100  # pNN50

    # 计算 QT 间期
    qt_intervals = []
    t_offsets = np.where(signals["ECG_T_Offsets"] == 1)[0]
    for r_peak in r_peaks:
        t_offset = t_offsets[t_offsets > r_peak]
        if len(t_offset) > 0:
            qt_interval = (t_offset[0] - r_peak) / sampling_rate  # 转换为秒
            qt_intervals.append(qt_interval)

    # 校正 QTc 值
    rr_mean = np.mean(rr_intervals)
    qtc_intervals = qt_intervals / np.sqrt(rr_mean)  # Bazett校正

    # 保存图表
    plt.figure(figsize=(12, 6))
    plt.plot(ecg_data['time'], ecg_signal, label='Raw ECG Signal')
    plt.plot(ecg_data['time'], ecg_cleaned, label='Cleaned ECG Signal', alpha=0.7)
    plt.plot(ecg_data['time'][r_peaks], ecg_cleaned[r_peaks], "x", label='R Peaks')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.title("ECG Signal with R Peaks and Cleaned Signal")  # 调整标题与图表的距离
    # 使用 subplots_adjust 手动调整边距
    plt.subplots_adjust(top=0.85, bottom=0.1, left=0.1, right=0.95, hspace=0.3)
    image_base64 = save_plot_as_base64()
    # plt.savefig("./sample/ecg_analysis.png", dpi=300)  # 保存为高清图片
    plt.close()

    # 返回结果字典
    return {
        "HRV Analysis": {
            "SDNN": sdnn,
            "RMSSD": rmssd,
            "pNN50": pnn50,
        },
        "QT Interval Analysis": {
            "Mean QT Interval": np.nanmean(qt_intervals),
            "Corrected QT Interval": np.nanmean(qtc_intervals)
        },
        "ecg_image": image_base64
    }



# 脉搏波传播速度 (PWV) 分析函数
def PWV_analysis(ecg_file_path, ppg_file_path):
    """
    使用ECG和PPG信号计算脉搏波传播速度（PWV）。
    
    Parameters:
    - file_path (str): 包含ECG和PPG信号的数据文件路径。
    - distance_m (float): ECG和PPG检测位置之间的距离，单位为米。
    """
    ecg_data = pd.read_csv(ecg_file_path, sep='\t', header=None, names=['time', 'signal'])
    ppg_data = pd.read_csv(ppg_file_path, header=None, names=['time1', 'time2', 'signal'])
    ppg_data['real_time'] = ppg_data['time1'].apply(lambda x: datetime.fromtimestamp(x/1e8, timezone.utc))
    # 取两个数据集的最小行数
    min_length = min(len(ecg_data), len(ppg_data))

    # 对齐两个数据集并忽略时间列
    aligned_data = pd.DataFrame({
       'ECG_Signal': ecg_data['signal'].iloc[:min_length].reset_index(drop=True),
       'PPG_Signal': ppg_data['signal'].iloc[:min_length].reset_index(drop=True)
    })
    
    # 假设的心脏到测量点的距离（单位：米）
    distance_m = 0.25

    # 读取对齐的 ECG 和 PPG 数据
    # 假设 aligned_data 已经存在
    ecg_signal = aligned_data['ECG_Signal']
    ppg_signal = aligned_data['PPG_Signal']

    # 使用 NeuroKit2 清理信号并检测 R 波和 PPG 波峰
    ecg_cleaned = nk.ecg_clean(ecg_signal, sampling_rate=100)
    ppg_cleaned = nk.ppg_clean(ppg_signal, sampling_rate=100)

    # 提取 ECG 的 R 波位置
    ecg_signals, ecg_info = nk.ecg_process(ecg_cleaned, sampling_rate=100)
    r_peaks = ecg_info['ECG_R_Peaks']

    # 提取 PPG 的波峰位置
    ppg_peaks = nk.ppg_findpeaks(ppg_cleaned, sampling_rate=100)
    ppg_peak_indices = ppg_peaks["PPG_Peaks"]

    # 计算 R 波到 PPG 波峰的时间差
    pwv_intervals = []
    for r_peak in r_peaks:
        # 找到第一个在该 R 波之后的 PPG 波峰
        ppg_peak = [peak for peak in ppg_peak_indices if peak > r_peak]
        if len(ppg_peak) > 0:
            time_delay = (ppg_peak[0] - r_peak) / 1000  # 转换为秒
            pwv_intervals.append(time_delay)

    # 计算 PWV
    pwv_values = distance_m / np.array(pwv_intervals)
    mean_pwv = np.mean(pwv_values)

    # 返回结果字典
    return {"Mean PWV": mean_pwv}


# 动脉硬化指数 (ASI) 分析函数
def ASI_analysis(ppg_file_path):
    # 读取脉搏波数据
    ppg_data = pd.read_csv(ppg_file_path, header=None, names=['time1', 'time2', 'signal'])
    ppg_data['real_time'] = ppg_data['time1'].apply(lambda x: datetime.fromtimestamp(x/1e8, timezone.utc))
    signal = ppg_data["signal"]

    # 找到脉搏波的最大峰值
    peak_indices, _ = find_peaks(signal)
    P_max = signal[peak_indices].max()

    # 找到80% P_max对应的峰值位置
    target_amplitude = 0.8 * P_max
    close_peaks = [idx for idx in peak_indices if np.isclose(signal[idx], target_amplitude, atol=0.05 * P_max)]

    if len(close_peaks) >= 2:
        # 假设第一个和最后一个接近80% P_max的峰值对应P1和P2
        P1 = signal[close_peaks[0]]
        P2 = signal[close_peaks[-1]]

        # 假设K值已知
        K = 1.0  # 根据具体情况调整

        # 计算ASI
        ASI = K * (P1 - P2)
    else:
        ASI = 0
        print("未找到足够的接近80% P_max的峰值，无法计算ASI")

    # 返回结果字典
    return {"ASI": ASI}

import os
import zipfile
import tempfile
from pathlib import Path

def process_and_analyze_zip(data_path):
    """
    验证压缩包中是否包含指定的文件后缀 (_ecg.txt, _eda.txt, _ppg.csv)，并进行解压和分析。

    :param data_path: 压缩包路径
    :return: 结果字典
    """
    required_suffixes = ['_ecg.txt', '_eda.txt', '_ppg.csv']

    try:
        # 创建临时目录
        with tempfile.TemporaryDirectory() as temp_dir:
            # 解压缩文件
            with zipfile.ZipFile(data_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)

            # 获取解压后的所有文件
            extracted_files = os.listdir(temp_dir)
            extracted_paths = [Path(temp_dir) / file for file in extracted_files]

            # 验证是否包含指定后缀的文件
            missing_suffixes = [suffix for suffix in required_suffixes
                                if not any(file.name.endswith(suffix) for file in extracted_paths)]
            if missing_suffixes:
                return {"error": f"缺少以下文件: {', '.join(missing_suffixes)}"}

            # 找到对应的文件路径
            ecg_file = next(file for file in extracted_paths if file.name.endswith('_ecg.txt'))
            eda_file = next(file for file in extracted_paths if file.name.endswith('_eda.txt'))
            ppg_file = next(file for file in extracted_paths if file.name.endswith('_ppg.csv'))

            # 调用分析函数
            eda_results = eda_proc(eda_file)
            ecg_results = ecg_proc(ecg_file)
            pwv_results = PWV_analysis(ecg_file, ppg_file)
            asi_results = ASI_analysis(ppg_file)

            # 汇总分析结果
            # analyze_results = {
            #     "EDA Image": eda_results["eda_image"],
            #     "ECG Image": ecg_results["ecg_image"],
            #     "HRV Analysis": ecg_results["HRV Analysis"],  # 包括 SDNN、RMSSD、pNN50
            #     "QT Interval Analysis": ecg_results["QT Interval Analysis"],  # 包括 Mean QT Interval 和 Corrected QT Interval (QTc)
            #     "Pulse Wave Velocity (PWV)": pwv_results,  # 平均 PWV 值
            #     "Arterial Stiffness Index (ASI)": asi_results  # 动脉硬化指数
            # }
            analyze_results = {
                "EDAPic": eda_results["eda_image"],
                "ECGPic": ecg_results["ecg_image"],
                "SDNN": ecg_results["HRV Analysis"]["SDNN"],
                "RMSSD": ecg_results["HRV Analysis"]["RMSSD"],
                "pNN50": ecg_results["HRV Analysis"]["pNN50"],
                "QTm": ecg_results["QT Interval Analysis"]["Mean QT Interval"],
                "QTc": ecg_results["QT Interval Analysis"]["Corrected QT Interval"],
                "PWVm": pwv_results["Mean PWV"], 
                "ASI": asi_results["ASI"]
            }

            return analyze_results

    except zipfile.BadZipFile:
        return {"error": "提供的文件不是有效的压缩包"}
    except Exception as e:
        return {"error": f"处理过程中发生错误: {str(e)}"}

if __name__ == "__main__":
#     eda_results = eda_proc('./sample/liu_eda.txt')
#     ecg_results = ecg_proc('./sample/liu_ecg.txt')
#     pwv_results = PWV_analysis('./sample/liu_ecg.txt', './sample/liu_ppg.csv')
#     asi_results = ASI_analysis('./sample/liu_ppg.csv')

#    # 汇总所有结果
#     all_results = {
#         "EDA Image": eda_results["eda_image"],
#         "ECG Image": ecg_results["ecg_image"],
#         "HRV Analysis": ecg_results["HRV Analysis"],  # 包括 SDNN、RMSSD、pNN50
#         "QT Interval Analysis": ecg_results["QT Interval Analysis"],  # 包括 Mean QT Interval 和 Corrected QT Interval (QTc)
#         "Pulse Wave Velocity (PWV)": pwv_results,  # 平均 PWV 值
#         "Arterial Stiffness Index (ASI)": asi_results  # 动脉硬化指数
#     }

    data_path = "./sample/王子杰_男.zip"
    try:
        results = process_and_analyze_zip(data_path)
        print("分析结果:")
        for category, metrics in results.items():
            print(f"{category}:")
            if isinstance(metrics, dict):
                for key, value in metrics.items():
                    print(f"  {key}: {value}")
            else:
                print(f"  {metrics}")
    except Exception as e:
        print(f"发生错误: {e}")

