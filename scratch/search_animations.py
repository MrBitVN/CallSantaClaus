import sys
import requests
import re

sys.stdout.reconfigure(line_buffering=True, encoding='utf-8')
headers = {'User-Agent': 'Mozilla/5.0'}

queries = ['christmas-animation', 'santa-animation', 'flying-reindeer', 'santa-sleigh']

for q in queries:
    url = f"https://mixkit.co/free-stock-video/{q}/"
    r = requests.get(url, headers=headers)
    mp4s = list(set(re.findall(r'https://assets\.mixkit\.co/videos/\d+/\d+-720\.mp4', r.text)))
    pages = list(set(re.findall(r'href="(/free-stock-video/[^"]+-\d+/)"', r.text)))
    print(f"Query {q}: {len(pages)} pages, {len(mp4s)} mp4s")
    for m in mp4s:
        print(" ", m)
    for p in pages[:4]:
        print("  p:", p)
