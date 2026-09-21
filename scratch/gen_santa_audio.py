import asyncio
import edge_tts

async def gen(text, filename, voice='en-US-ChristopherNeural', pitch='-16Hz', rate='-10%'):
    communicate = edge_tts.Communicate(text, voice, pitch=pitch, rate=rate)
    await communicate.save(filename)
    print(f"Generated {filename}")

async def main():
    clips = [
        ("Ho ho ho! Merry Christmas to all! I'm making my list, and checking it twice. Now have you been naughty? Or have you been nice?", "public/audio/santa_turn1_opening.mp3"),
        ("Ho ho ho! Merry Christmas to all! I'm making my list, and checking it twice. Now have you been naughty? Or have you been nice?", "public/audio/santa_voice_sample.mp3"),
        ("Ho ho ho! Merry Christmas to all! I'm making my list, and checking it twice. Now have you been naughty? Or have you been nice?", "public/audio/santa_voice_master.mp3"),
        ("Ho ho ho! Splendid! That is music to my ears! My golden Nice Book says you have been doing wonderful, helping out and being so kind! Now tell me, my dear child, what special gift do you wish for most this Christmas?", "public/audio/santa_turn2_gift_ask.mp3"),
        ("Ho ho ho! What a wonderful wish! The elves in my North Pole workshop are tying a golden ribbon on it right now! Now tell me, will you leave some sweet chocolate chip cookies for Santa and crunchy carrots for Rudolph on Christmas Eve?", "public/audio/santa_turn3_cookies_ask.mp3"),
        ("Ho ho ho! That warms my old heart! Remember to go to bed early on Christmas Eve, close your eyes tight, and keep spreading love and joy! Merry Christmas to you and your family, and a very Happy New Year! Ho ho ho, goodbye!", "public/audio/santa_turn4_farewell.mp3"),
        ("Ho ho ho! A very special Happy Birthday to you! Mrs. Claus, the elves, and I are singing for you today! May your birthday be filled with sweet cake, laughter, and magical surprises! Happy Birthday!", "public/audio/santa_scenario_birthday.mp3"),
        ("Ho ho ho! Look what I have in my mittens! Your letter arrived safely at the North Pole! The reindeer loved hearing your sweet message, and the elves are working hard to make your Christmas magical!", "public/audio/santa_scenario_letter.mp3"),
        ("Ho ho ho! Hello my dear friend! Santa loves you very much. I know it can be tough sometimes, but I need you to listen to your parents and try your best. If you do your best, I will have a wonderful surprise for you on Christmas morning!", "public/audio/santa_scenario_discipline.mp3"),
        ("Ho ho ho! The snow is falling and Rudolph's red nose is shining bright! The sleigh is packed to the brim with presents, and we are getting ready to take flight across the starry night sky! Merry Christmas Eve!", "public/audio/santa_scenario_eve.mp3"),
        ("Ho ho ho! Greetings from the snowy North Pole! I am Santa Claus, and I am so delighted to talk with you!", "public/audio/santa_intro_en.mp3"),
        ("Ho ho ho! Merry Christmas to all!", "public/audio/santa_laugh_en.mp3"),
        ("Ring ring! Incoming call from Santa Claus at the North Pole! Pick up the phone!", "public/audio/santa_ring_call_en.mp3")
    ]
    for text, path in clips:
        await gen(text, path)

if __name__ == '__main__':
    asyncio.run(main())
