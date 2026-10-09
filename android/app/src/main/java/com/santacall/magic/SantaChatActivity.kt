package com.santacall.magic

import android.app.Activity
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import com.santacall.magic.audio.SoundManager
import com.santacall.magic.models.ChildProfile

class SantaChatActivity : Activity() {

    private lateinit var btnBackFromChat: Button
    private lateinit var scrollChat: ScrollView
    private lateinit var layoutMessagesList: LinearLayout
    private lateinit var etChatMessage: EditText
    private lateinit var btnSendMessage: Button
    private lateinit var chip1: Button
    private lateinit var chip2: Button
    private lateinit var chip3: Button

    private lateinit var profile: ChildProfile

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_santa_chat)

        profile = ChildProfile.load(this)

        initViews()
        setupListeners()
    }

    private fun initViews() {
        btnBackFromChat = findViewById(R.id.btnBackFromChat)
        scrollChat = findViewById(R.id.scrollChat)
        layoutMessagesList = findViewById(R.id.layoutMessagesList)
        etChatMessage = findViewById(R.id.etChatMessage)
        btnSendMessage = findViewById(R.id.btnSendMessage)
        chip1 = findViewById(R.id.chip1)
        chip2 = findViewById(R.id.chip2)
        chip3 = findViewById(R.id.chip3)

        val tvWelcome = findViewById<TextView>(R.id.tvSantaWelcome)
        tvWelcome.text = "Ho ho ho! Chào ${profile.name} yêu quý! Ta là Ông già Noel đây! Giáng Sinh này bé có tâm sự hay mong ước gì cứ nhắn tin cho Ta nhé!"
    }

    private fun setupListeners() {
        btnBackFromChat.setOnClickListener {
            finish()
        }

        btnSendMessage.setOnClickListener {
            val text = etChatMessage.text.toString().trim()
            if (text.isNotEmpty()) {
                sendMessage(text)
                etChatMessage.setText("")
            }
        }

        chip1.setOnClickListener {
            sendMessage("🎁 Ông ơi, xưởng quà Bắc Cực đang làm món quà gì cho con thế ạ?")
        }

        chip2.setOnClickListener {
            sendMessage("🦌 Chú tuần lộc Rudolph mũi đỏ đã sẵn sàng cất cánh chưa hả Ông?")
        }

        chip3.setOnClickListener {
            sendMessage("⭐ Năm nay con có tên trong Sổ Bé Ngoan nhận quà của Ông không ạ?")
        }
    }

    private fun sendMessage(childText: String) {
        // Add Child message bubble
        addChildBubble(childText)
        SoundManager.vibrate(this, 50)

        // Simulate Santa thinking and responding in 1.2s
        Handler(Looper.getMainLooper()).postDelayed({
            val santaReply = generateSantaReply(childText)
            addSantaBubble(santaReply)
            SoundManager.vibrate(this, 100)
        }, 1200)
    }

    private fun addChildBubble(text: String) {
        val bubble = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = getDrawable(android.R.drawable.dialog_holo_dark_frame)
            setBackgroundColor(0xFF065F46.toInt())
            setPadding(32, 24, 32, 24)
            val params = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                gravity = Gravity.END
                bottomMargin = 24
            }
            layoutParams = params
        }

        val tv = TextView(this).apply {
            this.text = text
            setTextColor(0xFFFFFFFF.toInt())
            textSize = 13f
        }
        bubble.addView(tv)
        layoutMessagesList.addView(bubble)
        scrollToBottom()
    }

    private fun addSantaBubble(text: String) {
        val bubble = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(0xFF271919.toInt())
            setPadding(32, 24, 32, 24)
            val params = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                gravity = Gravity.START
                bottomMargin = 24
            }
            layoutParams = params
        }

        val tv = TextView(this).apply {
            this.text = text
            setTextColor(0xFFFEF3C7.toInt())
            textSize = 13f
        }
        bubble.addView(tv)
        layoutMessagesList.addView(bubble)
        scrollToBottom()
    }

    private fun generateSantaReply(input: String): String {
        val lower = input.lowercase()
        return when {
            lower.contains("quà") || lower.contains("gift") ->
                "Ho ho ho! Các chú lùn ở xưởng quà Bắc Cực đang gói món quà '${profile.dreamGift}' thắt nơ vàng lấp lánh cho bé ${profile.name} rồi đấy! Nhớ ăn ngoan và ngủ sớm nhé!"
            lower.contains("tuần lộc") || lower.contains("rudolph") ->
                "Ho ho ho! Chú tuần lộc Rudolph vừa ăn xong những củ cà rốt ngon lành, mũi đỏ của chú đang sáng rực rỡ sẵn sàng kéo cỗ xe bay qua bầu trời đêm Giáng Sinh!"
            lower.contains("ngoan") || lower.contains("nice") ->
                "Ho ho ho! Ta vừa mở Sổ Vàng Bé Ngoan, tên bé ${profile.name} đang tỏa sáng lấp lánh vì con rất biết vâng lời bố mẹ và chăm học! Ông già Noel tự hào về con lắm!"
            else ->
                "Ho ho ho! Tin nhắn của ${profile.name} làm trái tim già này ấm áp vô cùng! Chúc con và gia đình một mùa Giáng Sinh an lành và ngập tràn niềm vui nhé!"
        }
    }

    private fun scrollToBottom() {
        scrollChat.post {
            scrollChat.fullScroll(ScrollView.FOCUS_DOWN)
        }
    }
}
