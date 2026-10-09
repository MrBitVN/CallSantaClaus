package com.santacall.magic

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.os.CountDownTimer
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import com.santacall.magic.models.ChildProfile

class MainActivity : Activity() {

    private lateinit var tvHeroGreeting: TextView
    private lateinit var tvNiceListBadge: TextView
    private lateinit var btnParentSettings: Button
    private lateinit var btnMainVideoCall: Button
    private lateinit var btnMainVoiceCall: Button
    private lateinit var btnMainVoicemail: Button
    private lateinit var btnMainChat: Button
    private lateinit var btnTriggerBirthday: Button
    private lateinit var btnTriggerDiscipline: Button
    private lateinit var btnSchedule10s: Button
    private lateinit var btnSchedule30s: Button
    private lateinit var btnSchedule1m: Button

    private lateinit var layoutScheduledBanner: LinearLayout
    private lateinit var tvScheduledCountdown: TextView
    private lateinit var btnCancelScheduled: Button

    private lateinit var profile: ChildProfile
    private var scheduledTimer: CountDownTimer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        profile = ChildProfile.load(this)
        initViews()
        setupListeners()
    }

    override fun onResume() {
        super.onResume()
        // Refresh child profile if parent changed it
        profile = ChildProfile.load(this)
        tvHeroGreeting.text = "Chào ${profile.name}! 🎅"
        tvNiceListBadge.text = if (profile.isNice) {
            "⭐ Tên bé: DANH SÁCH BÉ NGOAN XUẤT SẮC"
        } else {
            "⚠️ Tên bé: CẦN CỐ GẮNG THÊM ĐỂ NHẬN QUÀ"
        }
    }

    private fun initViews() {
        tvHeroGreeting = findViewById(R.id.tvHeroGreeting)
        tvNiceListBadge = findViewById(R.id.tvNiceListBadge)
        btnParentSettings = findViewById(R.id.btnParentSettings)
        btnMainVideoCall = findViewById(R.id.btnMainVideoCall)
        btnMainVoiceCall = findViewById(R.id.btnMainVoiceCall)
        btnMainVoicemail = findViewById(R.id.btnMainVoicemail)
        btnMainChat = findViewById(R.id.btnMainChat)
        btnTriggerBirthday = findViewById(R.id.btnTriggerBirthday)
        btnTriggerDiscipline = findViewById(R.id.btnTriggerDiscipline)
        btnSchedule10s = findViewById(R.id.btnSchedule10s)
        btnSchedule30s = findViewById(R.id.btnSchedule30s)
        btnSchedule1m = findViewById(R.id.btnSchedule1m)

        layoutScheduledBanner = findViewById(R.id.layoutScheduledBanner)
        tvScheduledCountdown = findViewById(R.id.tvScheduledCountdown)
        btnCancelScheduled = findViewById(R.id.btnCancelScheduled)

        tvHeroGreeting.text = "Chào ${profile.name}! 🎅"
    }

    private fun setupListeners() {
        // Direct Voice Call (Multi-turn Gọi Thưa)
        btnMainVoiceCall.setOnClickListener {
            launchCall(callType = "audio", scenarioId = "interactive_call")
        }

        // Direct Video Call
        btnMainVideoCall.setOnClickListener {
            launchCall(callType = "video", scenarioId = "interactive_call")
        }

        // Birthday Call
        btnTriggerBirthday.setOnClickListener {
            launchCall(callType = "audio", scenarioId = "happy_birthday")
        }

        // Discipline Call
        btnTriggerDiscipline.setOnClickListener {
            launchCall(callType = "audio", scenarioId = "gentle_discipline")
        }

        // Voicemail
        btnMainVoicemail.setOnClickListener {
            val intent = Intent(this, VoicemailActivity::class.java)
            startActivity(intent)
        }

        // Santa Chat
        btnMainChat.setOnClickListener {
            val intent = Intent(this, SantaChatActivity::class.java)
            startActivity(intent)
        }

        // Parent Settings (PIN Protected)
        btnParentSettings.setOnClickListener {
            val intent = Intent(this, ParentSettingsActivity::class.java)
            startActivity(intent)
        }

        // Schedulers
        btnSchedule10s.setOnClickListener { scheduleCall(10, "audio") }
        btnSchedule30s.setOnClickListener { scheduleCall(30, "audio") }
        btnSchedule1m.setOnClickListener { scheduleCall(60, "audio") }

        btnCancelScheduled.setOnClickListener {
            cancelScheduled()
        }
    }

    private fun launchCall(callType: String, scenarioId: String) {
        val intent = Intent(this, IncomingCallActivity::class.java).apply {
            putExtra("call_type", callType)
            putExtra("scenario_id", scenarioId)
        }
        startActivity(intent)
    }

    private fun scheduleCall(seconds: Int, callType: String) {
        cancelScheduled()
        layoutScheduledBanner.visibility = View.VISIBLE

        scheduledTimer = object : CountDownTimer((seconds * 1000).toLong(), 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val secLeft = (millisUntilFinished / 1000).toInt() + 1
                tvScheduledCountdown.text = "🎅 Santa đang chuẩn bị gọi... Chuông reo sau ${secLeft}s!"
            }

            override fun onFinish() {
                layoutScheduledBanner.visibility = View.GONE
                launchCall(callType, "interactive_call")
            }
        }.start()
    }

    private fun cancelScheduled() {
        scheduledTimer?.cancel()
        scheduledTimer = null
        layoutScheduledBanner.visibility = View.GONE
    }

    override fun onDestroy() {
        super.onDestroy()
        cancelScheduled()
    }
}
