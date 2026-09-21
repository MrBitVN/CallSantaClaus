import sys
import requests
import re

sys.stdout.reconfigure(line_buffering=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

queries = ['santa', 'santa-claus', 'christmas']

found_pages = set()
for q in queries:
    url = f"https://mixkit.co/free-stock-video/{q}/"
    r = requests.get(url, headers=headers)
    links = re.findall(r'href="(/free-stock-video/[^"]+-\d+/)"', r.text)
    for l in links:
        if 'santa' in l or 'claus' in l:
            found_pages.add(l)

print(f"Found {len(found_pages)} Santa pages:")
for p in sorted(found_pages):
    print(" ", p)
