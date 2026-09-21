import requests

ids_to_check = [
    42176, 42175, 42177, 42178, 42179,
    42068, 42069, 42071, 42072,
    51324, 51326, 51340, 51342, 51344, 51345,
    39748, 101679, 101690, 101692, 101688
]

headers = {'User-Agent': 'Mozilla/5.0'}
for i in ids_to_check:
    url = f"https://assets.mixkit.co/videos/{i}/{i}-720.mp4"
    r = requests.head(url, headers=headers)
    if r.status_code == 200:
        print(f"FOUND ID {i}: {r.headers.get('content-length')} bytes -> {url}")
