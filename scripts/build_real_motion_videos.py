import os
import sys
import subprocess
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
sys.stdout.reconfigure(line_buffering=True, encoding='utf-8')

os.makedirs('public/videos', exist_ok=True)
os.makedirs('public/images', exist_ok=True)

CLIPS_DIR = 'scratch/mixkit_clips'

def run_cmd(cmd, desc):
    print(f"\n---> {desc}...")
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, errors='ignore')
    if proc.returncode != 0:
        print(f"ERROR: {proc.stderr[:400]}")
    else:
        print(f"SUCCESS: {desc}")
    return proc.returncode == 0

# 1. video_nicebook.mp4: Santa reading Nice List / card by tree
# Mixkit 51325.mp4 slowed slightly to match santa_voice_sample.mp3 (13.01s)
# 51325 is 10.51s -> pts 1.238 -> 13.01s
cmd_nicebook = [
    FFMPEG, '-y',
    '-i', f'{CLIPS_DIR}/51325.mp4',
    '-i', 'public/audio/santa_voice_sample.mp3',
    '-filter_complex', '[0:v]setpts=1.238*PTS,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720[v]',
    '-map', '[v]',
    '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    'public/videos/video_nicebook.mp4'
]
run_cmd(cmd_nicebook, "Encoding video_nicebook.mp4")

# Extract poster for nicebook
subprocess.run([
    FFMPEG, '-y', '-ss', '00:00:03', '-i', 'public/videos/video_nicebook.mp4',
    '-vframes', '1', '-q:v', '2', 'public/images/video_nicebook.jpg'
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


# 2. video_letter.mp4: Santa close-up reading snowman wishlist card
# Mixkit 51343.mp4 (portrait) placed with blurred festive wings
cmd_letter = [
    FFMPEG, '-y',
    '-ss', '00:00:01',
    '-i', f'{CLIPS_DIR}/51343.mp4',
    '-i', 'public/audio/santa_scenario_letter.mp3',
    '-filter_complex', (
        '[0:v]split[bg][fg];'
        '[bg]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,boxblur=25:5[bg_blur];'
        '[fg]scale=-1:720[fg_sc];'
        '[bg_blur][fg_sc]overlay=(W-w)/2:(H-h)/2[v]'
    ),
    '-map', '[v]',
    '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
    '-t', '15.36',
    '-movflags', '+faststart',
    'public/videos/video_letter.mp4'
]
run_cmd(cmd_letter, "Encoding video_letter.mp4")

# Extract poster for letter
subprocess.run([
    FFMPEG, '-y', '-ss', '00:00:03', '-i', 'public/videos/video_letter.mp4',
    '-vframes', '1', '-q:v', '2', 'public/images/video_letter.jpg'
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


# 3. video_sleigh.mp4: Flying through golden magical Christmas wonderland
# Mixkit 19200.mp4 slowed slightly to match santa_scenario_eve.mp3 (16.68s)
# 19200 is 15.00s -> pts 1.112 -> 16.68s
cmd_sleigh = [
    FFMPEG, '-y',
    '-i', f'{CLIPS_DIR}/19200.mp4',
    '-i', 'public/audio/santa_scenario_eve.mp3',
    '-filter_complex', '[0:v]setpts=1.112*PTS,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720[v]',
    '-map', '[v]',
    '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    'public/videos/video_sleigh.mp4'
]
run_cmd(cmd_sleigh, "Encoding video_sleigh.mp4")

# Extract poster for sleigh
subprocess.run([
    FFMPEG, '-y', '-ss', '00:00:05', '-i', 'public/videos/video_sleigh.mp4',
    '-vframes', '1', '-q:v', '2', 'public/images/santa_videocall.jpg'
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


# 4. video_birthday.mp4: Festive montage of gifts, excitement & Santa laughing
# Clip 1: 19200 (golden wonderland gifts, 3.5s)
# Clip 2: 42070 (child unwrapping gifts under Christmas tree, 6.0s)
# Clip 3: 51325 (Santa laughing and nodding with hearty smile, 9.2s)
# Total = 18.70s matching santa_scenario_birthday.mp3
cmd_birthday = [
    FFMPEG, '-y',
    '-ss', '00:00:00', '-t', '3.5', '-i', f'{CLIPS_DIR}/19200.mp4',
    '-ss', '00:00:02', '-t', '6.0', '-i', f'{CLIPS_DIR}/42070.mp4',
    '-ss', '00:00:01', '-t', '9.2', '-i', f'{CLIPS_DIR}/51325.mp4',
    '-i', 'public/audio/santa_scenario_birthday.mp3',
    '-filter_complex', (
        '[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1[v0];'
        '[1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1[v1];'
        '[2:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1[v2];'
        '[v0][v1][v2]concat=n=3:v=1:a=0[v]'
    ),
    '-map', '[v]',
    '-map', '3:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
    '-t', '18.70',
    '-movflags', '+faststart',
    'public/videos/video_birthday.mp4'
]
run_cmd(cmd_birthday, "Encoding video_birthday.mp4")

# Extract poster for birthday
subprocess.run([
    FFMPEG, '-y', '-ss', '00:00:07', '-i', 'public/videos/video_birthday.mp4',
    '-vframes', '1', '-q:v', '2', 'public/images/video_birthday.jpg'
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


# 5. santa_videocall_loop.mp4: Santa Claus speaking directly to camera from North Pole room
# 51341.mp4 (14.6s) with blurred wings
cmd_loop = [
    FFMPEG, '-y',
    '-i', f'{CLIPS_DIR}/51341.mp4',
    '-i', 'public/audio/santa_turn1_opening.mp3',
    '-filter_complex', (
        '[0:v]split[bg][fg];'
        '[bg]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,boxblur=25:5[bg_blur];'
        '[fg]scale=-1:720[fg_sc];'
        '[bg_blur][fg_sc]overlay=(W-w)/2:(H-h)/2[v]'
    ),
    '-map', '[v]',
    '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
    '-t', '14.6',
    '-movflags', '+faststart',
    'public/videos/santa_videocall_loop.mp4'
]
run_cmd(cmd_loop, "Encoding santa_videocall_loop.mp4")

# Also update santa_avatar.jpg thumbnail
subprocess.run([
    FFMPEG, '-y', '-ss', '00:00:03', '-i', 'public/videos/santa_videocall_loop.mp4',
    '-vframes', '1', '-q:v', '2', 'public/images/santa_avatar.jpg'
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("\nALL REAL MOTION VIDEOS & POSTERS SUCCESSFULLY CREATED!")
