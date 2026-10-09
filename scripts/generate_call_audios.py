import asyncio
import os
import subprocess
import edge_tts
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

VI_CLIPS = [
    ("santa_vi_call_turn1.mp3", "A lô! A lô! Có phải bé đó không? Ta là Ông già Noel gọi đến từ Bắc Cực đây! Cháu yêu có nghe rõ giọng của Ông không nào?"),
    ("santa_vi_call_turn2.mp3", "Ừ, ngoan lắm! Ta đang ở xưởng quà Bắc Cực, mở cuốn Sổ Bé Ngoan ra kiểm tra đây. Thế năm nay ở nhà và ở trường, cháu có ngoan ngoãn nghe lời bố mẹ, chịu khó ăn ngoan và chăm học không nào?"),
    ("santa_vi_call_turn3.mp3", "Ho ho ho! Tuyệt vời lắm! Cháu thật là một em bé ngoan và hiếu thảo! Ông già Noel rất tự hào về cháu đấy! Nào, bây giờ nói nhỏ cho Ta nghe xem, Giáng Sinh năm nay cháu ao ước được nhận món quà gì nhất nào?"),
    ("santa_vi_call_turn4.mp3", "Ho ho ho! Món quà đó tuyệt vời quá! Ta đã bảo các chú lùn ghi lại ngay vào danh sách rồi nhé! Đêm Noel Ta cùng cỗ xe tuần lộc bay qua sẽ mang đến cho cháu! Nhớ là phải ngủ sớm, ăn ngoan và luôn là một em bé ngoan nhé! Chúc cháu và gia đình một mùa Giáng Sinh ấm áp và an lành! Tạm biệt cháu yêu nhé! Ho ho ho!"),
    ("santa_vi_scenario_birthday.mp3", "A lô, chúc mừng sinh nhật cháu yêu nhé! Ta là Ông già Noel đây! Hôm nay ở Bắc Cực, Ta và các chú tuần lộc cùng hát mừng sinh nhật cháu đấy! Chúc cháu thêm một tuổi mới luôn khỏe mạnh, chăm ngoan và nhận được thật nhiều niềm vui nhé!"),
    ("santa_vi_scenario_discipline.mp3", "A lô, Ta là Ông già Noel đây! Ta yêu quý cháu lắm, nhưng các chú tuần lộc kể với Ta dạo này cháu còn đôi lúc chưa nghe lời bố mẹ đúng không? Cháu hãy hứa với Ông già Noel từ hôm nay sẽ ngoan ngoãn hơn nhé, Ta vẫn giữ một phần quà bí mật rất đẹp cho cháu đấy!"),
]

EN_CLIPS = [
    ("santa_en_call_turn1.mp3", "Ho ho ho! Hello there! Is that my sweet little friend? This is Santa Claus calling all the way from the snowy North Pole! Can you hear me loud and clear?"),
    ("santa_en_call_turn2.mp3", "Splendid! That is music to my ears! My big Golden Book of Good Children is open right in front of me. Tell Santa, have you been listening to mommy and daddy, finishing your meals, and being extra good this year?"),
    ("santa_en_call_turn3.mp3", "Ho ho ho! Wonderful! Santa and the elves are so proud of you! Now tell me, my sweet child, what special gift do you wish for the most under your Christmas tree?"),
    ("santa_en_call_turn4.mp3", "Ho ho ho! What a marvelous wish! The elves in my workshop are wrapping that golden gift right now! Remember to go to bed early on Christmas Eve, close your eyes tight, and keep spreading joy! Merry Christmas to you and your family, goodbye, Ho ho ho!"),
]

def deepen_audio(in_path, out_path, is_vi=True):
    # Slight pitch lowering and warm bass EQ for warm Santa Claus grandfatherly presence
    pitch_filter = "asetrate=44100*0.92,aresample=44100,atempo=1.08,bass=g=5:f=180" if is_vi else "asetrate=44100*0.95,aresample=44100,atempo=1.05,bass=g=4:f=180"
    cmd = [
        FFMPEG, '-y',
        '-i', in_path,
        '-af', pitch_filter,
        '-b:a', '128k',
        out_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

async def generate_all():
    os.makedirs('scratch/raw_audio', exist_ok=True)
    os.makedirs('public/audio', exist_ok=True)

    print("Generating Vietnamese Santa Clips...", flush=True)
    for filename, text in VI_CLIPS:
        raw_path = f"scratch/raw_audio/raw_{filename}"
        final_path = f"public/audio/{filename}"
        if os.path.exists(final_path) and os.path.getsize(final_path) > 1000:
            print(f"-> Already exists: {filename}", flush=True)
            continue
        print(f"-> TTS: {filename}", flush=True)
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(text, 'vi-VN-NamMinhNeural')
                await asyncio.wait_for(comm.save(raw_path), timeout=25.0)
                if os.path.exists(raw_path) and os.path.getsize(raw_path) > 1000:
                    deepen_audio(raw_path, final_path, is_vi=True)
                    print(f"   Saved {final_path} ({os.path.getsize(final_path)} bytes)", flush=True)
                    break
                else:
                    print(f"   Attempt {attempt+1} got empty file, retrying...", flush=True)
            except Exception as e:
                print(f"   Attempt {attempt+1} error: {e}", flush=True)
            await asyncio.sleep(2)

    print("Generating English Santa Clips...", flush=True)
    for filename, text in EN_CLIPS:
        raw_path = f"scratch/raw_audio/raw_{filename}"
        final_path = f"public/audio/{filename}"
        if os.path.exists(final_path) and os.path.getsize(final_path) > 1000:
            print(f"-> Already exists: {filename}", flush=True)
            continue
        print(f"-> TTS: {filename}", flush=True)
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(text, 'en-US-ChristopherNeural')
                await asyncio.wait_for(comm.save(raw_path), timeout=25.0)
                if os.path.exists(raw_path) and os.path.getsize(raw_path) > 1000:
                    deepen_audio(raw_path, final_path, is_vi=False)
                    print(f"   Saved {final_path} ({os.path.getsize(final_path)} bytes)", flush=True)
                    break
                else:
                    print(f"   Attempt {attempt+1} got empty file, retrying...", flush=True)
            except Exception as e:
                print(f"   Attempt {attempt+1} error: {e}", flush=True)
            await asyncio.sleep(2)

    print("All Santa Audio Generated Successfully!", flush=True)

if __name__ == '__main__':
    asyncio.run(generate_all())
