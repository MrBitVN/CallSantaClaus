import requests

headers = {'User-Agent': 'SantaClausApp/1.0'}
params = {
    'action': 'query',
    'generator': 'search',
    'gsrsearch': 'sleigh filetype:video',
    'gsrnamespace': '6',
    'gsrlimit': '10',
    'prop': 'imageinfo',
    'iiprop': 'url|size|mime',
    'format': 'json'
}
r = requests.get('https://commons.wikimedia.org/w/api.php', params=params, headers=headers)
pages = r.json().get('query', {}).get('pages', {})
print(f"Found {len(pages)} sleigh videos on Wikimedia:")
for pid, p in pages.items():
    info = p.get('imageinfo', [{}])[0]
    print(" ", p.get('title', ''), "->", info.get('url', ''))
