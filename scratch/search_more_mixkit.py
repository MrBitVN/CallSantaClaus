import sys
import requests
import re

sys.stdout.reconfigure(line_buffering=True)
headers = {'User-Agent': 'Mozilla/5.0'}

keywords = ['sleigh', 'reindeer', 'christmas-tree', 'fireplace', 'snow', 'santa-claus']

for kw in keywords:
    url = f"https://mixkit.co/free-stock-video/{kw}/"
    r = requests.get(url, headers=headers)
    mp4s = list(set(re.findall(r'https://assets\.mixkit\.co/videos/\d+/\d+-720\.mp4', r.text)))
    pages = list(set(re.findall(r'href="(/free-stock-video/[^"]+-\d+/)"', r.text)))
    print(f"\nKeyword '{kw}': {len(pages)} pages, {len(mp4s)} direct 720p mp4s")
    for m in mp4s[:4]:
        print("  MP4:", m)
    for p in pages[:4]:
        print("  Page:", p)
