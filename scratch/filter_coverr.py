import requests
import re

headers = {'User-Agent': 'Mozilla/5.0'}
r = requests.get('https://coverr.co/s?q=santa', headers=headers)
mp4s = list(set(re.findall(r'https?://[^\s"\'<>]+\.mp4', r.text)))

keywords = ['santa', 'reindeer', 'sleigh', 'christmas', 'claus', 'gift', 'snow']
filtered = [m for m in mp4s if any(k in m.lower() for k in keywords) and '720p.mp4' in m]

print(f"Filtered {len(filtered)} 720p Christmas MP4s from Coverr:")
for f in sorted(filtered):
    print(" ", f)

# Also check https://coverr.co/s?q=sleigh
r2 = requests.get('https://coverr.co/s?q=sleigh', headers=headers)
mp4s2 = list(set(re.findall(r'https?://[^\s"\'<>]+\.mp4', r2.text)))
filtered2 = [m for m in mp4s2 if any(k in m.lower() for k in keywords) and '720p.mp4' in m]
print(f"Sleigh search: {len(filtered2)} MP4s:")
for f in sorted(filtered2):
    print(" ", f)
