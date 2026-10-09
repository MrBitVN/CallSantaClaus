package com.santacall.magic

import android.app.Activity
import android.os.Bundle
import android.os.CountDownTimer
import android.os.Handler
import android.os.Looper
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView
import com.santacall.magic.audio.SoundManager
import com.santacall.magic.models.ChildProfile

class AudioCallActivity : Activity() {

    private enum class CallStage {
        TURN1_OPENING,
        PAUSE_GREETING,
        TURN2_BEHAVIOR,
        PAUSE_BEHAVIOR,
        TURN3_GIFT,
        PAUSE_GIFT,
        TURN4_FAREWELL,
        CALL_COMPLETED
    }

    private lateinit var tvCallTimer: TextView
    private lateinit var tvStageBadge: TextView
    private lateinit var tvCallerName: TextView
    private lateinit var tvChildInfo: TextView
    private lateinit var layoutSubtitles: LinearLayout
    private lateinit var tvSubtitleText: TextView
    private lateinit var layoutChildInteraction: LinearLayout
    private lateinit var tvPromptHint: TextView
    private lateinit var btnOption1: Button
    private lateinit var btnOption2: Button
    private lateinit var btnMute: ImageButton
    private lateinit var tvMuteLabel: TextView
    private lateinit var btnReplay: ImageButton
    private lateinit var btnToggleSubtitles: ImageButton
    private lateinit var btnEndCall: ImageButton

    private lateinit var profile: ChildProfile
    private var scenarioId: String = "interactive_call"
    private var callDurationSeconds: Int = 0
    private var timerHandler: Handler? = null
    private var timerRunnable: Runnable? = null
    private var pauseTimer: CountDownTimer? = null
    private var autoEndHandler: Handler? = null
    private var autoEndRunnable: Runnable? = null
    private var isMuted: Boolean = false
    private var showSubtitles: Boolean = true
    private var currentStage: CallStage = CallStage.TURN1_OPENING

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_audio_call)

        profile = ChildProfile.load(this)
        scenarioId = intent.getStringExtra("scenario_id") ?: "interactive_call"

        initViews()
        setupListeners()
        startCallTimer()
        startStage(CallStage.TURN1_OPENING)
    }

    private fun initViews() {
        tvCallTimer = findViewById(R.id.tvCallTimer)
        tvStageBadge = findViewById(R.id.tvStageBadge)
        tvCallerName = findViewById(R.id.tvCallerName)
        tvChildInfo = findViewById(R.id.tvChildInfo)
        layoutSubtitles = findViewById(R.id.layoutSubtitles)
        tvSubtitleText = findViewById(R.id.tvSubtitleText)
        layoutChildInteraction = findViewById(R.id.layoutChildInteraction)
        tvPromptHint = findViewById(R.id.tvPromptHint)
        btnOption1 = findViewById(R.id.btnOption1)
        btnOption2 = findViewById(R.id.btnOption2)
        btnMute = findViewById(R.id.btnMute)
        tvMuteLabel = findViewById(R.id.tvMuteLabel)
        btnReplay = findViewById(R.id.btnReplay)
        btnToggleSubtitles = findViewById(R.id.btnToggleSubtitles)
        btnEndCall = findViewById(R.id.btnEndCall)

        val isVi = profile.language == "vi"
        tvCallerName.text = if (isVi) "Ông Già Noel" else "Santa Claus"
        tvChildInfo.text = if (isVi) {
            "Cuộc gọi cho: ${profile.name} (${profile.age} tuổi)"
        } else {
            "Call for: ${profile.name} (${profile.age} yo)"
        }
    }

    private fun setupListeners() {
        btnOption1.setOnClickListener {
            handleChildAnswer()
        }

        btnOption2.setOnClickListener {
            handleChildAnswer()
        }

        btnMute.setOnClickListener {
            isMuted = !isMuted
            tvMuteLabel.text = if (isMuted) "Bật Mic" else "Tắt Mic"
            btnMute.alpha = if (isMuted) 0.5f else 1.0f
        }

        btnReplay.setOnClickListener {
            restartCall()
        }

        btnToggleSubtitles.setOnClickListener {
            showSubtitles = !showSubtitles
            layoutSubtitles.visibility = if (showSubtitles) View.VISIBLE else View.GONE
        }

        btnEndCall.setOnClickListener {
            endCallSafely()
        }
    }

    private fun startCallTimer() {
        timerHandler = Handler(Looper.getMainLooper())
        timerRunnable = object : Runnable {
            override fun run() {
                callDurationSeconds++
                val mins = callDurationSeconds / 60
                val secs = callDurationSeconds % 60
                tvCallTimer.text = String.format("%02d:%02d", mins, secs)
                timerHandler?.postDelayed(this, 1000)
            }
        }
        timerHandler?.postDelayed(timerRunnable!!, 1000)
    }

    private fun stopCallTimer() {
        timerRunnable?.let { timerHandler?.removeCallbacks(it) }
        timerHandler = null
    }

    private fun startStage(stage: CallStage) {
        cancelPauseTimer()
        currentStage = stage
        val isVi = profile.language == "vi"

        when (stage) {
            CallStage.TURN1_OPENING -> {
                tvStageBadge.text = if (isVi) "🎅 Santa đang nói..." else "🎅 Santa speaking..."
                tvStageBadge.setBackgroundColor(0xFFF59E0B.toInt())
                tvStageBadge.setTextColor(0xFF1F1500.toInt())
                layoutChildInteraction.visibility = View.GONE

                val text = if (isVi) {
                    "A lô! A lô! Có phải bé ${profile.name} đó không? Ta là Ông già Noel gọi đến từ Bắc Cực đây! Cháu yêu có nghe rõ giọng của Ông không nào?"
                } else {
                    "Ho ho ho! Hello there! Is that my little friend ${profile.name}? This is Santa Claus calling all the way from the snowy North Pole! Can you hear me loud and clear?"
                }
                tvSubtitleText.text = text

                val audioFile = if (isVi) "public/audio/santa_vi_call_turn1.mp3" else "public/audio/santa_turn1_opening.mp3"
                SoundManager.playAssetAudio(this, audioFile, onCompletion = {
                    runOnUiThread {
                        startStage(CallStage.PAUSE_GREETING)
                    }
                })
            }

            CallStage.PAUSE_GREETING -> {
                // QUÃNG NGHỈ 1: Santa lắng nghe bé gọi thưa (5s)
                tvStageBadge.text = if (isVi) "👂 Santa đang lắng nghe bé thưa..." else "👂 Santa listening..."
                tvStageBadge.setBackgroundColor(0xFF059669.toInt())
                tvStageBadge.setTextColor(0xFFFFFFFF.toInt())
                SoundManager.vibrate(this, 150)

                tvPromptHint.text = if (isVi) "Bé thưa chuyện với Ông già Noel:" else "Answer Santa Claus:"
                btnOption1.text = if (isVi) "⭐ Dạ vâng, con chào Ông ạ!" else "⭐ Yes, hello Santa!"
                btnOption2.text = if (isVi) "🎅 Dạ con nghe rất rõ ạ!" else "🎅 I hear you loud and clear!"
                layoutChildInteraction.visibility = View.VISIBLE

                startPauseCountdown(5) {
                    startStage(CallStage.TURN2_BEHAVIOR)
                }
            }

            CallStage.TURN2_BEHAVIOR -> {
                // LƯỢT 2: Santa hỏi thăm sinh hoạt, khen ngợi và kiểm tra Bé Ngoan
                tvStageBadge.text = if (isVi) "🎅 Santa đang nói..." else "🎅 Santa speaking..."
                tvStageBadge.setBackgroundColor(0xFFF59E0B.toInt())
                tvStageBadge.setTextColor(0xFF1F1500.toInt())
                layoutChildInteraction.visibility = View.GONE

                val text = if (isVi) {
                    "Ừ, ngoan lắm! Ta đang ở xưởng quà Bắc Cực, mở cuốn Sổ Bé Ngoan ra kiểm tra đây. Thế năm nay ở nhà và ở trường, cháu có ngoan ngoãn nghe lời bố mẹ, chịu khó ăn ngoan và chăm học không nào?"
                } else {
                    "Splendid! That is music to my ears! My big Golden Book of Good Children is open right in front of me. Tell Santa, have you been listening to mommy and daddy, finishing your meals, and being extra good this year?"
                }
                tvSubtitleText.text = text

                val audioFile = if (isVi) "public/audio/santa_vi_call_turn2.mp3" else "public/audio/santa_turn2_gift_ask.mp3"
                SoundManager.playAssetAudio(this, audioFile, onCompletion = {
                    runOnUiThread {
                        startStage(CallStage.PAUSE_BEHAVIOR)
                    }
                })
            }

            CallStage.PAUSE_BEHAVIOR -> {
                // QUÃNG NGHỈ 2: Santa lắng nghe bé khoe ngoan (5s)
                tvStageBadge.text = if (isVi) "👂 Santa đang lắng nghe bé trả lời..." else "👂 Santa listening..."
                tvStageBadge.setBackgroundColor(0xFF059669.toInt())
                tvStageBadge.setTextColor(0xFFFFFFFF.toInt())
                SoundManager.vibrate(this, 150)

                tvPromptHint.text = if (isVi) "Bé trả lời Ông già Noel:" else "Tell Santa about your year:"
                btnOption1.text = if (isVi) "🌟 Dạ con ngoan và nghe lời ạ!" else "🌟 I've been very nice!"
                btnOption2.text = if (isVi) "😇 Dạ con hứa sẽ chăm hơn ạ!" else "😇 Trying my very best!"
                layoutChildInteraction.visibility = View.VISIBLE

                startPauseCountdown(5) {
                    startStage(CallStage.TURN3_GIFT)
                }
            }

            CallStage.TURN3_GIFT -> {
                // LƯỢT 3: Santa hỏi món quà ước mơ Giáng Sinh
                tvStageBadge.text = if (isVi) "🎅 Santa đang nói..." else "🎅 Santa speaking..."
                tvStageBadge.setBackgroundColor(0xFFF59E0B.toInt())
                tvStageBadge.setTextColor(0xFF1F1500.toInt())
                layoutChildInteraction.visibility = View.GONE

                val text = if (isVi) {
                    "Ho ho ho! Tuyệt vời lắm! Cháu thật là một em bé ngoan và hiếu thảo! Ông già Noel rất tự hào về cháu đấy! Nào, bây giờ nói nhỏ cho Ta nghe xem, Giáng Sinh năm nay cháu ao ước được nhận món quà gì nhất nào?"
                } else {
                    "Ho ho ho! Wonderful! Santa and the elves are so proud of you! Now tell me, my sweet child, what special gift do you wish for the most under your Christmas tree?"
                }
                tvSubtitleText.text = text

                val audioFile = if (isVi) "public/audio/santa_vi_call_turn3.mp3" else "public/audio/santa_turn3_cookies_ask.mp3"
                SoundManager.playAssetAudio(this, audioFile, onCompletion = {
                    runOnUiThread {
                        startStage(CallStage.PAUSE_GIFT)
                    }
                })
            }

            CallStage.PAUSE_GIFT -> {
                // QUÃNG NGHỈ 3: Santa lắng nghe bé nói món quà ước mơ (6s)
                tvStageBadge.text = if (isVi) "👂 Santa đang lắng nghe quà ước mơ..." else "👂 Santa listening for wishlist..."
                tvStageBadge.setBackgroundColor(0xFF059669.toInt())
                tvStageBadge.setTextColor(0xFFFFFFFF.toInt())
                SoundManager.vibrate(this, 150)

                val gift = profile.dreamGift.ifEmpty { "Bộ đồ chơi xếp hình" }
                tvPromptHint.text = if (isVi) "Nói món quà ước mơ cho Santa:" else "Tell Santa your wish:"
                btnOption1.text = if (isVi) "🎁 $gift" else "🎁 $gift"
                btnOption2.text = if (isVi) "✨ Một điều ước bất ngờ!" else "✨ A surprise gift!"
                layoutChildInteraction.visibility = View.VISIBLE

                startPauseCountdown(6) {
                    startStage(CallStage.TURN4_FAREWELL)
                }
            }

            CallStage.TURN4_FAREWELL -> {
                // LƯỢT 4: Santa dặn dò, hẹn gặp lại đêm Noel và chúc Giáng Sinh an lành
                tvStageBadge.text = if (isVi) "🎅 Santa đang nói..." else "🎅 Santa speaking..."
                tvStageBadge.setBackgroundColor(0xFFF59E0B.toInt())
                tvStageBadge.setTextColor(0xFF1F1500.toInt())
                layoutChildInteraction.visibility = View.GONE

                val text = if (isVi) {
                    "Ho ho ho! Món quà đó tuyệt vời quá! Ta đã bảo các chú lùn ghi lại ngay vào danh sách rồi nhé! Đêm Noel Ta cùng cỗ xe tuần lộc bay qua sẽ mang đến cho cháu! Nhớ là phải ngủ sớm, ăn ngoan và luôn là một em bé ngoan nhé! Chúc cháu và gia đình một mùa Giáng Sinh ấm áp và an lành! Tạm biệt cháu yêu nhé! Ho ho ho!"
                } else {
                    "Ho ho ho! What a marvelous wish! The elves in my workshop are wrapping that golden gift right now! Remember to go to bed early on Christmas Eve, close your eyes tight, and keep spreading joy! Merry Christmas to you and your family, goodbye, Ho ho ho!"
                }
                tvSubtitleText.text = text

                val audioFile = if (isVi) "public/audio/santa_vi_call_turn4.mp3" else "public/audio/santa_turn4_farewell.mp3"
                SoundManager.playAssetAudio(this, audioFile, onCompletion = {
                    runOnUiThread {
                        startStage(CallStage.CALL_COMPLETED)
                    }
                })
            }

            CallStage.CALL_COMPLETED -> {
                tvStageBadge.text = if (isVi) "✨ Hoàn thành cuộc gọi • Giáng Sinh an lành" else "✨ Call Completed • Merry Christmas"
                tvStageBadge.setBackgroundColor(0xFF047857.toInt())
                tvStageBadge.setTextColor(0xFFFFFFFF.toInt())

                tvPromptHint.text = if (isVi) "Bé chào tạm biệt Ông già Noel:" else "Say goodbye to Santa:"
                btnOption1.text = if (isVi) "💖 Dạ con chào Ông, con cảm ơn Ông!" else "💖 Thank you, bye Santa!"
                btnOption2.visibility = View.GONE
                layoutChildInteraction.visibility = View.VISIBLE

                // Tự động kết thúc sau 3 giây
                autoEndHandler = Handler(Looper.getMainLooper())
                autoEndRunnable = Runnable {
                    endCallSafely()
                }
                autoEndHandler?.postDelayed(autoEndRunnable!!, 3000)
            }
        }
    }

    private fun startPauseCountdown(seconds: Int, onFinish: () -> Unit) {
        cancelPauseTimer()
        pauseTimer = object : CountDownTimer((seconds * 1000).toLong(), 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val secLeft = (millisUntilFinished / 1000).toInt() + 1
                val isVi = profile.language == "vi"
                val prefix = if (isVi) "👂 Santa đang lắng nghe... (${secLeft}s)" else "👂 Santa listening... (${secLeft}s)"
                tvStageBadge.text = prefix
            }

            override fun onFinish() {
                onFinish()
            }
        }.start()
    }

    private fun cancelPauseTimer() {
        pauseTimer?.cancel()
        pauseTimer = null
    }

    private fun handleChildAnswer() {
        cancelPauseTimer()
        SoundManager.vibrate(this, 100)

        when (currentStage) {
            CallStage.PAUSE_GREETING -> startStage(CallStage.TURN2_BEHAVIOR)
            CallStage.PAUSE_BEHAVIOR -> startStage(CallStage.TURN3_GIFT)
            CallStage.PAUSE_GIFT -> startStage(CallStage.TURN4_FAREWELL)
            CallStage.CALL_COMPLETED -> endCallSafely()
            else -> {}
        }
    }

    private fun restartCall() {
        SoundManager.stopAll()
        cancelPauseTimer()
        autoEndRunnable?.let { autoEndHandler?.removeCallbacks(it) }
        btnOption2.visibility = View.VISIBLE
        startStage(CallStage.TURN1_OPENING)
    }

    private fun endCallSafely() {
        SoundManager.stopAll()
        cancelPauseTimer()
        stopCallTimer()
        autoEndRunnable?.let { autoEndHandler?.removeCallbacks(it) }
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        SoundManager.stopAll()
        cancelPauseTimer()
        stopCallTimer()
        autoEndRunnable?.let { autoEndHandler?.removeCallbacks(it) }
    }
}
