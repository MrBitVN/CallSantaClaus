import os
import subprocess
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

audios = [
    'public/audio/santa_voice_sample.mp3',
    'public/audio/santa_scenario_letter.mp3',
    'public/audio/santa_scenario_birthday.mp3',
    'public/audio/santa_scenario_eve.mp3'
]

def get_duration(path):
    res = subprocess.run([FFMPEG, '-i', path, '-f', 'null', '-'], stderr=subprocess.PIPE, text=True, errors='ignore')
    for line in res.stderr.split('\n'):
        if 'Duration:' in line:
            return line.split('Duration:')[1].split(',')[0].strip()
    return 'Unknown'

print("Audio Durations:")
for a in audios:
    print(f"  {os.path.basename(a)}: {get_duration(a)}")

print("\nVideo Clip Durations:")
import glob
for v in glob.glob('scratch/mixkit_clips/*.mp4'):
    print(f"  {os.path.basename(v)}: {get_duration(v)}")
