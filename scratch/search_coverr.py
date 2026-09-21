import requests
import re

headers = {'User-Agent': 'Mozilla/5.0'}
r = requests.get('https://coverr.co/s?q=santa', headers=headers)
print("Coverr Santa status:", r.status_code)
mp4s = list(set(re.findall(r'https?://[^\s"\'<>]+\.mp4', r.text)))
print("Coverr MP4s:", len(mp4s))
for m in mp4s[:5]:
    print(" ", m)

# Look for nextjs data or urls
urls = list(set(re.findall(r'https://storage\.googleapis\.com/coverr-main/[^\s"\'<>]+', r.text)))
print("Coverr GCS urls:", len(urls))
for u in urls[:5]:
    print(" ", u)
