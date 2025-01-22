import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from scipy import signal
from scipy.io import wavfile
import numpy as np
import moviepy
import subprocess

def get_spectrum(sampling_rate, audio):
    winsize = round(sampling_rate/10)
    # print(winsize)
    window = signal.windows.gaussian(winsize, std=round(winsize/8), sym = True)
    SFT = signal.ShortTimeFFT(window, hop=round(winsize/8), fs=sampling_rate, scale_to='magnitude')
    sx = SFT.stft(audio)
    mags = []
    for r in sx:
        mags.append(np.mean(r * np.conjugate(r)))
    mags = np.real(np.array(mags))[1:]
    mags /= np.sum(mags)
    return mags

def compress_by(audio, s):
    arr = []
    for i in range(0, len(audio), s):
        arr.append(np.mean(audio[i:i+s]))
    return np.array(arr)

def smooth(x):
    y = signal.convolve(x, signal.windows.gaussian(6, 1, sym = True), mode = "same")
    return y / np.sum(y)

def get_final_spectrum_single(file_name, base_sampling_rate = 16000):
    sampling_rate, audio = wavfile.read(file_name)
    assert sampling_rate % base_sampling_rate == 0
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    s = get_spectrum(base_sampling_rate, compress_by(audio, sampling_rate//base_sampling_rate))
    return s
    # return smooth(s)

# IF CHANGING BASE SAMPLING RATE, SMOOTH NEEDS TO BE UPDATED TOO

def get_final_spectrum_multiple(arr, base_sampling_rate = 16000):
    s = -1
    for name in arr:
        cur = get_final_spectrum_single(name, base_sampling_rate)
        if s is -1:
            s = cur
        else:
            assert len(s) == len(cur)
            s += cur
    return s / len(arr)

def compare(a, b):
    return np.dot(a, b) / np.linalg.norm(a) / np.linalg.norm(b)

def webm_to_wave(input_file, output_file):
    try:
        # Run the FFmpeg command to convert the file
        subprocess.run(
            ['ffmpeg', '-i', input_file, '-vn', output_file, '-y']
        )
        print(f"Conversion successful: {output_file}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred during conversion: {e}")

sample_folder = "audio_samples"
sample_audio_files = [os.path.join(sample_folder, f) for f in os.listdir(sample_folder)]
base_spectrum = get_final_spectrum_multiple(sample_audio_files)
UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
@app.route("/process-audio", methods = ['POST'])

def process_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    request.files['audio'].stream.seek(0)
    audio_file_path = os.path.join(UPLOAD_FOLDER, request.files['audio'].filename)
    request.files['audio'].save(audio_file_path);
    request.files['audio'].flush()
    request.files['audio'].close()
    
    fixed_path = os.path.join(UPLOAD_FOLDER, "final_recording.wav")
    webm_to_wave(audio_file_path, fixed_path)

    cur_spectrum = smooth(get_final_spectrum_single(fixed_path));
    similarity = compare(cur_spectrum, base_spectrum)
    return jsonify({"message":"successful comparison", "data": similarity}), 200

if __name__ == "__main__":
    app.run(port = 6900, debug = True, host = "0.0.0.0")