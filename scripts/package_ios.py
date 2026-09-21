import os
import sys
import zipfile

output_zip = 'SantaCall_iOS.zip'
ios_dir = 'ios'

print(f"Creating {output_zip} from {ios_dir}...")

total_files = 0
total_bytes = 0

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(ios_dir):
        # Exclude temporary or build directories if any
        dirs[:] = [d for d in dirs if d not in ['.build', 'DerivedData', 'Pods', '.git']]
        for file in files:
            if file in ['.DS_Store', 'Thumbs.db']:
                continue
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, os.path.dirname(ios_dir))
            zipf.write(file_path, arcname)
            total_files += 1
            total_bytes += os.path.getsize(file_path)

zip_size = os.path.getsize(output_zip)
print(f"SUCCESS: Created {output_zip}!")
print(f"  Files packaged: {total_files}")
print(f"  Uncompressed size: {total_bytes / (1024*1024):.2f} MB")
print(f"  Compressed ZIP size: {zip_size / (1024*1024):.2f} MB")
