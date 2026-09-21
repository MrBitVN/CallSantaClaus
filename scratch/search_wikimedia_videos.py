import requests

headers = {'User-Agent': 'SantaClausApp/1.0 (contact: admin@example.com)'}

for query in ['Santa sleigh', 'Santa Claus', 'Father Christmas', 'reindeer snow']:
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrsearch': f'{query} filetype:video',
        'gsrnamespace': '6',
        'gsrlimit': '10',
        'prop': 'imageinfo',
        'iiprop': 'url|size|mime',
        'format': 'json'
    }
    r = requests.get('https://commons.wikimedia.org/w/api.php', params=params, headers=headers)
    pages = r.json().get('query', {}).get('pages', {})
    print(f"\nQuery '{query}': found {len(pages)} videos")
    for pid, p in pages.items():
        title = p.get('title', '')
        info = p.get('imageinfo', [{}])[0]
        url = info.get('url', '')
        size = info.get('size', 0)
        print(f"  {title} ({size / (1024*1024):.1f} MB) -> {url}")
