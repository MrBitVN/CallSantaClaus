import sys
import requests
import re

sys.stdout.reconfigure(line_buffering=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

r = requests.get('https://mixkit.co/free-stock-video/santa/', headers=headers)
# Find all video links and their preview MP4s
items = re.findall(r'href="(/free-stock-video/[^"]+-\d+/)"', r.text)
print(f"Total video page links: {len(items)}", flush=True)

# Also find all assets.mixkit.co/videos/...mp4
mp4_all = list(set(re.findall(r'https://assets\.mixkit\.co/videos/\d+/\d+-(?:720|1080|360)\.mp4', r.text)))
print(f"Found {len(mp4_all)} mp4 links:", flush=True)
for m in sorted(mp4_all):
    print(" ", m, flush=True)



