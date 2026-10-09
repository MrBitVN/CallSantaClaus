package com.santacall.magic

import android.app.Activity
import android.media.ToneGenerator
import android.media.AudioManager
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import com.santacall.magic.audio.SoundManager

class VoicemailActivity : Activity() {

    private lateinit var btnBackFromVoicemail: Button
    private lateinit var tvDialNumber: TextView
    private lateinit var btnRecordWish: Button
    private lateinit var tvWishStatus: TextView

    private var toneGenerator: ToneGenerator? = null
    private var dialedText = StringBuilder()
    private var isRecording = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_voicemail)

        try {
            toneGenerator = ToneGenerator(AudioManager.STREAM_VOICE_CALL, 80)
        } catch (e: Exception) {
            // ignore
        }

        initViews()
        setupKeypad()
    }

    private fun initViews() {
        btnBackFromVoicemail = findViewById(R.id.btnBackFromVoicemail)
        tvDialNumber = findViewById(R.id.tvDialNumber)
        btnRecordWish = findViewById(R.id.btnRecordWish)
        tvWishStatus = findViewById(R.id.tvWishStatus)

        btnBackFromVoicemail.setOnClickListener {
            finish()
        }

        btnRecordWish.setOnClickListener {
            if (!isRecording) {
                isRecording = true
                btnRecordWish.text = "⏹️ Đang ghi âm... Nhấn để gửi Santa"
                btnRecordWish.setBackgroundColor(0xFF059669.toInt())
                tvWishStatus.text = "🎤 Bé hãy nói to điều ước muốn nhận vào micro nhé..."
                SoundManager.vibrate(this, 100)
            } else {
                isRecording = false
                btnRecordWish.text = "🎙️ Ghi Âm Điều Ước Gửi Santa"
                btnRecordWish.setBackgroundColor(0xFFDC2626.toInt())
                tvWishStatus.text = "✨ Đã gửi bản ghi âm điều ước của bé đến Bắc Cực thành công!"
                SoundManager.vibrate(this, 200)
            }
        }
    }

    private fun setupKeypad() {
        val keys = mapOf(
            R.id.btnKey1 to Pair("1", ToneGenerator.TONE_DTMF_1),
            R.id.btnKey2 to Pair("2", ToneGenerator.TONE_DTMF_2),
            R.id.btnKey3 to Pair("3", ToneGenerator.TONE_DTMF_3),
            R.id.btnKey4 to Pair("4", ToneGenerator.TONE_DTMF_4),
            R.id.btnKey5 to Pair("5", ToneGenerator.TONE_DTMF_5),
            R.id.btnKey6 to Pair("6", ToneGenerator.TONE_DTMF_6),
            R.id.btnKey7 to Pair("7", ToneGenerator.TONE_DTMF_7),
            R.id.btnKey8 to Pair("8", ToneGenerator.TONE_DTMF_8),
            R.id.btnKey9 to Pair("9", ToneGenerator.TONE_DTMF_9),
            R.id.btnKey0 to Pair("0", ToneGenerator.TONE_DTMF_0),
            R.id.btnKeyStar to Pair("*", ToneGenerator.TONE_DTMF_S),
            R.id.btnKeyHash to Pair("#", ToneGenerator.TONE_DTMF_P)
        )

        keys.forEach { (btnId, pair) ->
            findViewById<Button>(btnId).setOnClickListener {
                dialedText.append(pair.first)
                tvDialNumber.text = dialedText.toString()
                try {
                    toneGenerator?.startTone(pair.second, 120)
                } catch (e: Exception) {
                    // ignore
                }
                SoundManager.vibrate(this, 50)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        toneGenerator?.release()
        toneGenerator = null
    }
}
