package com.santacall.magic

import android.app.Activity
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.ImageButton
import android.widget.TextView
import android.widget.VideoView
import com.santacall.magic.audio.SoundManager
import java.io.File
import java.io.FileOutputStream

class VideoCallActivity : Activity() {

    private lateinit var videoViewSanta: VideoView
    private lateinit var tvVideoTimer: TextView
    private lateinit var btnEndVideoCall: ImageButton

    private var callDurationSeconds: Int = 0
    private var timerHandler: Handler? = null
    private var timerRunnable: Runnable? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_video_call)

        videoViewSanta = findViewById(R.id.videoViewSanta)
        tvVideoTimer = findViewById(R.id.tvVideoTimer)
        btnEndVideoCall = findViewById(R.id.btnEndVideoCall)

        btnEndVideoCall.setOnClickListener {
            endCall()
        }

        startTimer()
        playSantaVideo()
    }

    private fun playSantaVideo() {
        try {
            // Copy asset video to internal cache so VideoView can stream it cleanly
            val cacheFile = File(cacheDir, "santa_call_video.mp4")
            if (!cacheFile.exists() || cacheFile.length() == 0L) {
                val input = try {
                    assets.open("public/videos/santa_videocall_loop.mp4")
                } catch (e: Exception) {
                    assets.open("videos/santa_videocall_loop.mp4")
                }
                val output = FileOutputStream(cacheFile)
                input.copyTo(output)
                input.close()
                output.close()
            }

            videoViewSanta.setVideoURI(Uri.fromFile(cacheFile))
            videoViewSanta.setOnPreparedListener { mp ->
                mp.isLooping = true
                videoViewSanta.start()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun startTimer() {
        timerHandler = Handler(Looper.getMainLooper())
        timerRunnable = object : Runnable {
            override fun run() {
                callDurationSeconds++
                val mins = callDurationSeconds / 60
                val secs = callDurationSeconds % 60
                tvVideoTimer.text = String.format("%02d:%02d", mins, secs)
                timerHandler?.postDelayed(this, 1000)
            }
        }
        timerHandler?.postDelayed(timerRunnable!!, 1000)
    }

    private fun endCall() {
        timerRunnable?.let { timerHandler?.removeCallbacks(it) }
        try {
            if (videoViewSanta.isPlaying) {
                videoViewSanta.stopPlayback()
            }
        } catch (e: Exception) {
            // ignore
        }
        SoundManager.stopAll()
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        endCall()
    }
}
