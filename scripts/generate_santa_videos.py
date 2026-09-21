import os
import sys
import math
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import imageio_ffmpeg

sys.stdout.reconfigure(encoding='utf-8')
FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
FPS = 30

def extract_audio_envelope(audio_path, total_frames, fps=30):
    """Extract per-frame RMS volume envelope normalized to [0.0, 1.0]."""
    cmd = [
        FFMPEG_EXE, '-y', '-i', audio_path,
        '-f', 's16le', '-ac', '1', '-ar', '16000', '-'
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    raw, _ = proc.communicate()
    samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    duration = len(samples) / 16000.0
    
    samples_per_frame = int(16000 / fps)
    rms_values = []
    
    for f in range(total_frames):
        start = f * samples_per_frame
        end = min(len(samples), start + samples_per_frame)
        if start < len(samples) and end > start:
            chunk = samples[start:end]
            rms = math.sqrt(float(np.mean(chunk ** 2)))
        else:
            rms = 0.0
        rms_values.append(rms)
    
    rms_arr = np.array(rms_values, dtype=np.float32)
    min_val = np.percentile(rms_arr, 15) if len(rms_arr) > 0 else 0.0
    max_val = np.percentile(rms_arr, 95) if len(rms_arr) > 0 else 1.0
    diff = max_val - min_val if max_val > min_val else 1.0
    
    norm_envelope = np.clip((rms_arr - min_val) / diff, 0.0, 1.0)
    
    # Smooth with moving average window = 5 (attack/release)
    smoothed = np.convolve(norm_envelope, np.ones(5)/5.0, mode='same')
    return np.clip(smoothed, 0.0, 1.0), duration

def get_audio_duration(audio_path):
    cmd = [
        FFMPEG_EXE, '-i', audio_path,
        '-f', 'null', '-'
    ]
    proc = subprocess.Popen(cmd, stderr=subprocess.PIPE, stdout=subprocess.DEVNULL)
    _, err = proc.communicate()
    err_str = err.decode('utf-8', errors='ignore')
    import re
    m = re.search(r'Duration:\s*(\d+):(\d+):(\d+\.\d+)', err_str)
    if m:
        h, m_, s = m.groups()
        return int(h)*3600 + int(m_)*60 + float(s)
    return 7.0

def create_snow_particles(count=50, width=1280, height=720):
    np.random.seed(42)
    particles = []
    for _ in range(count):
        particles.append({
            'x0': np.random.uniform(0, width),
            'y0': np.random.uniform(0, height),
            'radius': np.random.choice([1.5, 2.5, 3.5, 5.0, 9.0], p=[0.35, 0.35, 0.15, 0.1, 0.05]),
            'speed': np.random.uniform(30.0, 85.0), # px per second
            'phase': np.random.uniform(0, math.pi * 2),
            'opacity': np.random.uniform(0.35, 0.85)
        })
    return particles

def generate_video(
    image_path,
    audio_path,
    output_path,
    face_cx,
    face_cy,
    target_width=1280,
    target_height=720,
    is_loop=False,
    loop_duration=8.0
):
    print(f"\n=======================================================")
    print(f"[VIDEO] Generating AI Video: {os.path.basename(output_path)}")
    print(f"   Base image: {image_path}")
    print(f"   Audio: {audio_path if audio_path else 'Silent / Ambient loop'}")
    
    # Load base image and scale to target dimension
    base_img = Image.open(image_path).convert('RGB')
    orig_w, orig_h = base_img.size
    
    # Scale face coordinates to target resolution
    scale_x = target_width / orig_w
    scale_y = target_height / orig_h
    scale = max(scale_x, scale_y)
    
    # Center crop / resize to target_width x target_height
    new_w = int(orig_w * scale)
    new_h = int(orig_h * scale)
    scaled_img = base_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    crop_x = (new_w - target_width) // 2
    crop_y = (new_h - target_height) // 2
    canvas_img = scaled_img.crop((crop_x, crop_y, crop_x + target_width, crop_y + target_height))
    
    cx = int(face_cx * scale - crop_x)
    cy = int(face_cy * scale - crop_y)
    
    if audio_path and os.path.exists(audio_path):
        dur = get_audio_duration(audio_path) + 0.3 # slight extra margin
        total_frames = int(dur * FPS)
        envelope, _ = extract_audio_envelope(audio_path, total_frames, FPS)
    else:
        dur = loop_duration
        total_frames = int(dur * FPS)
        envelope = np.zeros(total_frames, dtype=np.float32)
        # For video call loop, simulate gentle conversational speech rhythm
        t_arr = np.linspace(0, dur, total_frames)
        envelope = 0.45 * np.clip(np.sin(2 * math.pi * 0.8 * t_arr) * np.sin(2 * math.pi * 0.25 * t_arr), 0.0, 1.0)
    
    print(f"   Total frames: {total_frames} ({dur:.2f} seconds @ {FPS} fps)")
    
    # Pre-extract mouth and eye reference regions
    eye_y = cy - int(32 * scale)
    eye_left_x = cx - int(45 * scale)
    eye_right_x = cx + int(45 * scale)
    eye_w = int(28 * scale)
    eye_h = int(14 * scale)
    
    mouth_y = cy + int(50 * scale)
    mouth_w = int(70 * scale)
    mouth_h = int(35 * scale)
    
    particles = create_snow_particles(45, target_width, target_height)
    
    # FFmpeg streaming process
    ffmpeg_cmd = [
        FFMPEG_EXE, '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{target_width}x{target_height}',
        '-pix_fmt', 'rgb24',
        '-r', str(FPS),
        '-i', '-',
    ]
    
    if audio_path and os.path.exists(audio_path):
        ffmpeg_cmd.extend([
            '-i', audio_path,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '21',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-shortest',
            '-movflags', '+faststart',
            output_path
        ])
    else:
        ffmpeg_cmd.extend([
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '21',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            output_path
        ])
    
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Render loop
    for frame_idx in range(total_frames):
        t = frame_idx / float(FPS)
        speech_energy = float(envelope[frame_idx]) if frame_idx < len(envelope) else 0.0
        
        # 1. Subtle breathing and head motion
        body_dy = 2.0 * math.sin(2 * math.pi * 0.3 * t)
        body_dx = 1.0 * math.cos(2 * math.pi * 0.15 * t)
        
        # Ken burns zoom (1.0 -> 1.04)
        zoom = 1.0 + 0.04 * (t / dur)
        zw = int(target_width * zoom)
        zh = int(target_height * zoom)
        
        # Fast transform for subtle zoom & sway
        frame_img = canvas_img.copy()
        
        # 2. Mouth Animation (Speech Reactive)
        if speech_energy > 0.08:
            # Draw natural mouth opening under mustache
            openness = min(1.0, (speech_energy - 0.08) / 0.7)
            jaw_drop = int(openness * 12.0)
            
            mouth_canvas = Image.new('RGBA', (target_width, target_height), (0, 0, 0, 0))
            m_draw = ImageDraw.Draw(mouth_canvas)
            
            # Inner mouth dark cavity
            m_box = [
                cx - mouth_w // 2,
                mouth_y + int(body_dy) - 2,
                cx + mouth_w // 2,
                mouth_y + int(body_dy) + jaw_drop + 8
            ]
            # Dark oral cavity with soft red/burgundy
            m_draw.ellipse(m_box, fill=(45, 12, 16, int(220 * openness)))
            
            # Subtle teeth highlight
            if jaw_drop > 5:
                teeth_box = [
                    cx - mouth_w // 3,
                    mouth_y + int(body_dy),
                    cx + mouth_w // 3,
                    mouth_y + int(body_dy) + int(jaw_drop * 0.4)
                ]
                m_draw.arc(teeth_box, start=0, end=180, fill=(230, 220, 215, int(180 * openness)), width=2)
            
            # Blur edges of mouth overlay
            mouth_canvas = mouth_canvas.filter(ImageFilter.GaussianBlur(radius=2.0))
            frame_img.paste(mouth_canvas, (0, 0), mouth_canvas)
        
        # 3. Natural Eye Blinking (Every ~3.8 seconds, lasts 5 frames)
        blink_cycle = 3.8
        time_in_cycle = t % blink_cycle
        if time_in_cycle < 0.16: # ~5 frames
            blink_progress = math.sin(math.pi * (time_in_cycle / 0.16))
            blink_alpha = int(220 * blink_progress)
            
            blink_overlay = Image.new('RGBA', (target_width, target_height), (0, 0, 0, 0))
            b_draw = ImageDraw.Draw(blink_overlay)
            
            # Left eyelid
            lx = eye_left_x + int(body_dx)
            ly = eye_y + int(body_dy)
            b_draw.ellipse([lx - eye_w//2, ly - eye_h//2, lx + eye_w//2, ly + int(eye_h * blink_progress)], fill=(225, 165, 140, blink_alpha))
            # Eyelash line
            b_draw.arc([lx - eye_w//2, ly, lx + eye_w//2, ly + int(eye_h * blink_progress)], start=0, end=180, fill=(90, 50, 40, blink_alpha), width=2)
            
            # Right eyelid
            rx = eye_right_x + int(body_dx)
            ry = eye_y + int(body_dy)
            b_draw.ellipse([rx - eye_w//2, ry - eye_h//2, rx + eye_w//2, ry + int(eye_h * blink_progress)], fill=(225, 165, 140, blink_alpha))
            b_draw.arc([rx - eye_w//2, ry, rx + eye_w//2, ry + int(eye_h * blink_progress)], start=0, end=180, fill=(90, 50, 40, blink_alpha), width=2)
            
            blink_overlay = blink_overlay.filter(ImageFilter.GaussianBlur(radius=1.5))
            frame_img.paste(blink_overlay, (0, 0), blink_overlay)
        
        # 4. Fireplace / Candle Warm Glow (Pulsing warm lighting)
        fire_pulse = 0.05 * math.sin(2 * math.pi * 0.6 * t) + 0.03 * math.sin(2 * math.pi * 1.4 * t)
        if abs(fire_pulse) > 0.01:
            glow_overlay = Image.new('RGB', (target_width, target_height), (int(255 * max(0, fire_pulse)), int(140 * max(0, fire_pulse)), 0))
            frame_img = Image.blend(frame_img, glow_overlay, alpha=min(0.12, max(0.0, fire_pulse)))
        
        # 5. Snow Particles & Holiday Sparkles
        snow_overlay = Image.new('RGBA', (target_width, target_height), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(snow_overlay)
        
        for p in particles:
            py = (p['y0'] + p['speed'] * t) % target_height
            px = (p['x0'] + 15.0 * math.sin(0.03 * py + p['phase'] + t)) % target_width
            rad = p['radius']
            alpha = int(255 * p['opacity'])
            
            if rad > 6.0:
                # Big soft bokeh flake
                s_draw.ellipse([px - rad, py - rad, px + rad, py + rad], fill=(255, 255, 255, int(alpha * 0.35)))
            else:
                s_draw.ellipse([px - rad, py - rad, px + rad, py + rad], fill=(255, 255, 255, alpha))
        
        snow_overlay = snow_overlay.filter(ImageFilter.GaussianBlur(radius=0.8))
        frame_img.paste(snow_overlay, (0, 0), snow_overlay)
        
        # Write raw bytes to FFmpeg stdin
        proc.stdin.write(frame_img.tobytes())
        
        if (frame_idx + 1) % 60 == 0 or (frame_idx + 1) == total_frames:
            print(f"   Progress: {frame_idx + 1}/{total_frames} frames ({(frame_idx + 1)/total_frames*100:.1f}%)")
            
    proc.stdin.close()
    proc.wait()
    print(f"   [OK] Saved: {output_path} ({os.path.getsize(output_path)/1024/1024:.2f} MB)")

def main():
    os.makedirs('public/videos', exist_ok=True)
    
    videos_to_generate = [
        {
            'name': 'video_birthday.mp4',
            'image': 'public/images/video_birthday.jpg',
            'audio': 'public/audio/santa_scenario_birthday.mp3',
            'cx': 703,
            'cy': 294,
            'width': 1280,
            'height': 720,
            'is_loop': False
        },
        {
            'name': 'video_letter.mp4',
            'image': 'public/images/video_letter.jpg',
            'audio': 'public/audio/santa_scenario_letter.mp3',
            'cx': 704,
            'cy': 281,
            'width': 1280,
            'height': 720,
            'is_loop': False
        },
        {
            'name': 'video_nicebook.mp4',
            'image': 'public/images/video_nicebook.jpg',
            'audio': 'public/audio/santa_voice_sample.mp3',
            'cx': 705,
            'cy': 283,
            'width': 1280,
            'height': 720,
            'is_loop': False
        },
        {
            'name': 'video_sleigh.mp4',
            'image': 'public/images/santa_videocall.jpg',
            'audio': 'public/audio/santa_scenario_eve.mp3',
            'cx': 400,
            'cy': 520,
            'width': 1280,
            'height': 720,
            'is_loop': False
        },
        {
            'name': 'santa_videocall_loop.mp4',
            'image': 'public/images/santa_videocall.jpg',
            'audio': None, # ambient loop for video call
            'cx': 400,
            'cy': 520,
            'width': 720,
            'height': 1280,
            'is_loop': True,
            'loop_duration': 8.0
        }
    ]
    
    for v in videos_to_generate:
        out_file = os.path.join('public/videos', v['name'])
        generate_video(
            image_path=v['image'],
            audio_path=v['audio'],
            output_path=out_file,
            face_cx=v['cx'],
            face_cy=v['cy'],
            target_width=v['width'],
            target_height=v['height'],
            is_loop=v['is_loop'],
            loop_duration=v.get('loop_duration', 8.0)
        )

if __name__ == '__main__':
    main()
