package com.santacall.magic

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import com.santacall.magic.audio.SoundManager
import com.santacall.magic.models.ChildProfile

class IncomingCallActivity : Activity() {

    private lateinit var tvIncomingTitle: TextView
    private lateinit var tvIncomingCallerName: TextView
    private lateinit var tvIncomingNumber: TextView
    private lateinit var tvSpecialForChild: TextView
    private lateinit var tvDeclineLabel: TextView
    private lateinit var tvAcceptLabel: TextView
    private lateinit var btnDeclineCall: ImageButton
    private lateinit var btnAcceptCall: ImageButton

    private lateinit var profile: ChildProfile
    private var callType: String = "audio" // "audio" or "video"
    private var scenarioId: String = "interactive_call"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_incoming_call)

        profile = ChildProfile.load(this)
        callType = intent.getStringExtra("call_type") ?: "audio"
        scenarioId = intent.getStringExtra("scenario_id") ?: "interactive_call"

        initViews()
        setupListeners()

        // Start ringing sound and vibration
        SoundManager.startRingtone(this)
    }

    private fun initViews() {
        tvIncomingTitle = findViewById(R.id.tvIncomingTitle)
        tvIncomingCallerName = findViewById(R.id.tvIncomingCallerName)
        tvIncomingNumber = findViewById(R.id.tvIncomingNumber)
        tvSpecialForChild = findViewById(R.id.tvSpecialForChild)
        tvDeclineLabel = findViewById(R.id.tvDeclineLabel)
        tvAcceptLabel = findViewById(R.id.tvAcceptLabel)
        btnDeclineCall = findViewById(R.id.btnDeclineCall)
        btnAcceptCall = findViewById(R.id.btnAcceptCall)

        val isVi = profile.language == "vi"
        tvIncomingTitle.text = if (isVi) {
            if (callType == "video") "CUỘC GỌI FACETIME TỪ BẮC CỰC" else "CUỘC GỌI ĐẾN TỪ BẮC CỰC"
        } else {
            if (callType == "video") "FACETIME FROM NORTH POLE" else "INCOMING CALL FROM NORTH POLE"
        }

        tvIncomingCallerName.text = if (isVi) "Ông Già Noel" else "Santa Claus"
        tvSpecialForChild.text = if (isVi) {
            "🎅 Cuộc gọi dành riêng cho ${profile.name} (${profile.age} tuổi)!"
        } else {
            "🎅 Special call for ${profile.name} (${profile.age} yo)!"
        }

        tvDeclineLabel.text = if (isVi) "Từ chối" else "Decline"
        tvAcceptLabel.text = if (isVi) "Trả lời" else "Accept"
    }

    private fun setupListeners() {
        btnDeclineCall.setOnClickListener {
            SoundManager.stopRingtone()
            finish()
        }

        btnAcceptCall.setOnClickListener {
            SoundManager.stopRingtone()
            if (callType == "video") {
                val intent = Intent(this, VideoCallActivity::class.java).apply {
                    putExtra("scenario_id", scenarioId)
                }
                startActivity(intent)
            } else {
                val intent = Intent(this, AudioCallActivity::class.java).apply {
                    putExtra("scenario_id", scenarioId)
                }
                startActivity(intent)
            }
            finish()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        SoundManager.stopRingtone()
    }
}
