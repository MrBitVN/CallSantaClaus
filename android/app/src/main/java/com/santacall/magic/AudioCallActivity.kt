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

        tvCallerName.text = "Santa Claus"
        tvChildInfo.text = "Call for: ${profile.name} (${profile.age} yo)"
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
            tvMuteLabel.text = if (isMuted) "Unmute" else "Mute"
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

        when (stage) {
            CallStage.TURN1_OPENING -> {
                tvStageBadge.text = "🎅 Santa speaking..."
                tvStageBadge.setBackgroundColor(0xFFF59E0B.toInt())
                tvStageBadge.setTextColor(0xFF1F1500.toInt())
                layoutChildInteraction.visibility = View.GONE

                if (scenarioId == "happy_birthday") {
                    tvSubtitleText.text = "Ho ho ho! Happy Birthday, dear ${profile.name}! Santa Claus and all the reindeer at the North Pole are singing for you today! Wishing you a magical year full of joy and wonder!"
                    SoundManager.playAssetAudio(this, "public/audio/santa_scenario_birthday.mp3", onCompletion = {
                        runOnUiThread { startStage(CallStage.CALL_COMPLETED) }
                    })
                    return
                }

                if (scenarioId == "gentle_discipline") {
                    tvSubtitleText.text = "Ho ho ho! Hello ${profile.name}, this is Santa Claus calling from the North Pole. My elves told me you can be even better at listening to mommy and daddy. Promise Santa you'll try your best, and I'll keep your special gift ready!"
                    SoundManager.playAssetAudio(this, "public/audio/santa_scenario_discipline.mp3", onCompletion = {
                        runOnUiThread { startStage(CallStage.CALL_COMPLETED) }
                    })
                    return
                }

                tvSubtitleText.text = "Ho ho ho! Hello there! Is that my little friend ${profile.name}? This is Santa Claus calling all the way from the snowy North Pole! Can you hear me loud and clear?"

                SoundManager.playAssetAudio(this, "public/audio/santa_turn1_opening.mp3", onCompletion = {
                    runOnUiThread {
                        startStage(CallStage.PAUSE_GREETING)
                    }
                })
            }

            CallStage.PAUSE_GREETING -> {
                tvStageBadge.text = "👂 Santa listening..."
                tvStageBadge.setBackgroundColor(0xFF059669.toInt())
                tvStageBadge.setTextColor(0xFFFFFFFF.toInt())
                SoundManager.vibrate(this, 150)

                tvPromptHint.text = "Answer Santa Claus:"
                btnOption1.text = "⭐ Yes, hello Santa!"
                btnOption2.text = "🎅 I hear you loud and clear!"
                layoutChildInteraction.visibility = View.VISIBLE

                startPauseCountdown(5) {
                    startStage(CallStage.TURN2_BEHAVIOR)
                }
            }

            CallStage.TURN2_BEHAVIOR -> {
                tvStageBadge.text = "🎅 Santa speaking..."
                tvStageBadge.setBackgroundColor(0xFFF59E0B.toInt())
                tvStageBadge.setTextColor(0xFF1F1500.toInt())
                layoutChildInteraction.visibility = View.GONE

                tvSubtitleText.text = "Splendid! That is music to my ears! My big Golden Book of Good Children is open right in front of me. Tell Santa, have you been listening to mommy and daddy, finishing your meals, and being extra good this year?"

                SoundManager.playAssetAudio(this, "public/audio/santa_turn2_gift_ask.mp3", onCompletion = {
                    runOnUiThread {
                        startStage(CallStage.PAUSE_BEHAVIOR)
                    }
                })
            }

            CallStage.PAUSE_BEHAVIOR -> {
                tvStageBadge.text = "👂 Santa listening..."
                tvStageBadge.setBackgroundColor(0xFF059669.toInt())
                tvStageBadge.setTextColor(0xFFFFFFFF.toInt())
                SoundManager.vibrate(this, 150)

                tvPromptHint.text = "Tell Santa about your year:"
                btnOption1.text = "🌟 I've been very nice!"
                btnOption2.text = "😇 Trying my very best!"
                layoutChildInteraction.visibility = View.VISIBLE

                startPauseCountdown(5) {
                    startStage(CallStage.TURN3_GIFT)
                }
            }

            CallStage.TURN3_GIFT -> {
                tvStageBadge.text = "🎅 Santa speaking..."
                tvStageBadge.setBackgroundColor(0xFFF59E0B.toInt())
                tvStageBadge.setTextColor(0xFF1F1500.toInt())
                layoutChildInteraction.visibility = View.GONE

                tvSubtitleText.text = "Ho ho ho! Wonderful! Santa and the elves are so proud of you! Now tell me, my sweet child, what special gift do you wish for the most under your Christmas tree?"

                SoundManager.playAssetAudio(this, "public/audio/santa_turn3_cookies_ask.mp3", onCompletion = {
                    runOnUiThread {
                        startStage(CallStage.PAUSE_GIFT)
                    }
                })
            }

            CallStage.PAUSE_GIFT -> {
                tvStageBadge.text = "👂 Santa listening for wishlist..."
                tvStageBadge.setBackgroundColor(0xFF059669.toInt())
                tvStageBadge.setTextColor(0xFFFFFFFF.toInt())
                SoundManager.vibrate(this, 150)

                val gift = profile.dreamGift.ifEmpty { "Lego Reindeer Sleigh" }
                tvPromptHint.text = "Tell Santa your wish:"
                btnOption1.text = "🎁 $gift"
                btnOption2.text = "✨ A surprise gift!"
                layoutChildInteraction.visibility = View.VISIBLE

                startPauseCountdown(6) {
                    startStage(CallStage.TURN4_FAREWELL)
                }
            }

            CallStage.TURN4_FAREWELL -> {
                tvStageBadge.text = "🎅 Santa speaking..."
                tvStageBadge.setBackgroundColor(0xFFF59E0B.toInt())
                tvStageBadge.setTextColor(0xFF1F1500.toInt())
                layoutChildInteraction.visibility = View.GONE

                tvSubtitleText.text = "Ho ho ho! What a marvelous wish! The elves in my workshop are wrapping that golden gift right now! Remember to go to bed early on Christmas Eve, close your eyes tight, and keep spreading joy! Merry Christmas to you and your family, goodbye, Ho ho ho!"

                SoundManager.playAssetAudio(this, "public/audio/santa_turn4_farewell.mp3", onCompletion = {
                    runOnUiThread {
                        startStage(CallStage.CALL_COMPLETED)
                    }
                })
            }

            CallStage.CALL_COMPLETED -> {
                tvStageBadge.text = "✨ Call Completed • Merry Christmas"
                tvStageBadge.setBackgroundColor(0xFF047857.toInt())
                tvStageBadge.setTextColor(0xFFFFFFFF.toInt())

                tvPromptHint.text = "Say goodbye to Santa:"
                btnOption1.text = "💖 Thank you, bye Santa!"
                btnOption2.visibility = View.GONE
                layoutChildInteraction.visibility = View.VISIBLE

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
                tvStageBadge.text = "👂 Santa listening... (${secLeft}s)"
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
