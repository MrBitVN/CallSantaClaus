import os
import sys
import subprocess
import requests
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

video_ids = ['51325', '51341', '51343', '51372', '42070']
os.makedirs('scratch/mixkit_clips', exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0'}

for vid in video_ids:
    url = f"https://assets.mixkit.co/videos/{vid}/{vid}-720.mp4"
    out_path = f"scratch/mixkit_clips/{vid}.mp4"
    if not os.path.exists(out_path):
        print(f"Downloading {vid} from {url}...")
        r = requests.get(url, headers=headers, stream=True)
        if r.status_code == 200:
            with open(out_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=1024*1024):
                    f.write(chunk)
            print(f"Downloaded {vid}: {os.path.getsize(out_path)} bytes")
        else:
            print(f"Failed {vid}: status {r.status_code}")
    
    # Extract 1 frame as jpg to inspect
    frame_jpg = f"scratch/mixkit_clips/{vid}_thumb.jpg"
    if os.path.exists(out_path) and not os.path.exists(frame_jpg):
        subprocess.run([FFMPEG, '-y', '-ss', '00:00:02', '-i', out_path, '-vframes', '1', frame_jpg],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"Generated frame {frame_jpg}")

print("Done downloading samples!")
