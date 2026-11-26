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
        tvWelcome.text = "Ho ho ho! Hello dear ${profile.name}! This is Santa Claus from the North Pole! Send me your Christmas wishes and questions anytime! 🎅✨"
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
            sendMessage("🎁 What gift is the North Pole workshop making for me?")
        }

        chip2.setOnClickListener {
            sendMessage("🦌 Is Rudolph the red-nosed reindeer ready to fly?")
        }

        chip3.setOnClickListener {
            sendMessage("⭐ Am I on the Nice List this year, Santa?")
        }
    }

    private fun sendMessage(childText: String) {
        addChildBubble(childText)
        SoundManager.vibrate(this, 50)

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
            lower.contains("gift") || lower.contains("present") || lower.contains("want") || lower.contains("wish") || lower.contains("toy") ->
                "Ho ho ho! The elves in my North Pole workshop are wrapping '${profile.dreamGift}' with a golden ribbon just for ${profile.name}! Remember to eat well and go to bed early! 🎁✨"
            lower.contains("reindeer") || lower.contains("rudolph") || lower.contains("sleigh") ->
                "Ho ho ho! Rudolph just finished munching on crunchy sweet carrots, and his red nose is shining bright for our magical Christmas Eve flight! 🦌✨"
            lower.contains("nice") || lower.contains("good") || lower.contains("list") || lower.contains("promise") ->
                if (profile.isNice) {
                    "Ho ho ho! I just checked my Golden Nice List, and ${profile.name}'s name is shining at the very top! Santa is so proud of you! ⭐🎄"
                } else {
                    "Ho ho ho! Keep listening to mommy and daddy and doing your best, ${profile.name}! Santa believes in you and knows you'll earn your spot on the Nice List! ⭐"
                }
            lower.contains("cold") || lower.contains("snow") || lower.contains("north pole") || lower.contains("weather") ->
                "It is -18°C here at the North Pole with fluffy white snow falling all over the elf workshop! Good thing Mrs. Claus made hot cocoa! ❄️☕"
            lower.contains("hello") || lower.contains("hi") || lower.contains("hey") ->
                "Ho ho ho! Hello there, ${profile.name}! It makes Santa so happy to hear from you! How has your day been? 🎅❤️"
            lower.contains("merry christmas") || lower.contains("love") || lower.contains("thank") ->
                "Ho ho ho! Merry Christmas to you and your wonderful family, ${profile.name}! Sending warm North Pole hugs! 🎄❤️"
            else ->
                "Ho ho ho! Your message warms my jolly heart, ${profile.name}! Keep smiling, be kind, and have a magical Christmas season! 🎅✨"
        }
    }

    private fun scrollToBottom() {
        scrollChat.post {
            scrollChat.fullScroll(ScrollView.FOCUS_DOWN)
        }
    }
}
