package com.santacall.magic

import android.app.Activity
import android.app.Dialog
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup
import android.view.Window
import android.widget.Button
import android.widget.VideoView
import java.io.File
import java.io.FileOutputStream

class VideoMessagesActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_video_messages)

        findViewById<Button>(R.id.btnBackFromVideoMessages).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.btnPlayVideoBirthday).setOnClickListener {
            playVideo("video_birthday.mp4")
        }

        findViewById<Button>(R.id.btnPlayVideoNiceBook).setOnClickListener {
            playVideo("video_nicebook.mp4")
        }

        findViewById<Button>(R.id.btnPlayVideoSleigh).setOnClickListener {
            playVideo("video_sleigh.mp4")
        }

        findViewById<Button>(R.id.btnPlayVideoLetter).setOnClickListener {
            playVideo("video_letter.mp4")
        }
    }

    private fun playVideo(filename: String) {
        try {
            val cacheFile = File(cacheDir, filename)
            if (!cacheFile.exists() || cacheFile.length() == 0L) {
                val input = try {
                    assets.open("public/videos/$filename")
                } catch (e: Exception) {
                    assets.open("videos/$filename")
                }
                val output = FileOutputStream(cacheFile)
                input.copyTo(output)
                input.close()
                output.close()
            }

            val dialog = Dialog(this, android.R.style.Theme_Black_NoTitleBar_Fullscreen)
            dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)

            val videoView = VideoView(this)
            videoView.layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            dialog.setContentView(videoView)

            videoView.setVideoURI(Uri.fromFile(cacheFile))
            videoView.setOnPreparedListener { mp ->
                videoView.start()
            }
            videoView.setOnCompletionListener {
                dialog.dismiss()
            }
            dialog.show()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
