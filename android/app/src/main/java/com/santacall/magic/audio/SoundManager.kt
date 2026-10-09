package com.santacall.magic.audio

import android.content.Context
import android.content.res.AssetFileDescriptor
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log

object SoundManager {
    private const val TAG = "SantaSoundManager"
    private var mediaPlayer: MediaPlayer? = null
    private var ringtonePlayer: MediaPlayer? = null
    var isPlaying: Boolean = false
        private set

    fun playAssetAudio(
        context: Context,
        assetPath: String,
        onStart: (() -> Unit)? = null,
        onCompletion: (() -> Unit)? = null
    ) {
        stopAll()
        try {
            val afd: AssetFileDescriptor = try {
                context.assets.openFd(assetPath)
            } catch (e: Exception) {
                // Try with "public/" prefix or without
                if (assetPath.startsWith("public/")) {
                    context.assets.openFd(assetPath.removePrefix("public/"))
                } else {
                    context.assets.openFd("public/$assetPath")
                }
            }

            mediaPlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION)
                        .build()
                )
                setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                afd.close()
                prepare()
                setOnPreparedListener {
                    this@SoundManager.isPlaying = true
                    it.start()
                    onStart?.invoke()
                }
                setOnCompletionListener {
                    this@SoundManager.isPlaying = false
                    onCompletion?.invoke()
                }
                setOnErrorListener { _, what, extra ->
                    Log.w(TAG, "Audio error: what=$what, extra=$extra")
                    this@SoundManager.isPlaying = false
                    onCompletion?.invoke()
                    true
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to play asset audio: $assetPath", e)
            isPlaying = false
            onCompletion?.invoke()
        }
    }

    fun startRingtone(context: Context) {
        stopRingtone()
        try {
            val ringPath = "public/audio/santa_ring_call_vi.mp3"
            val afd = try {
                context.assets.openFd(ringPath)
            } catch (e: Exception) {
                context.assets.openFd("audio/santa_ring_call_vi.mp3")
            }

            ringtonePlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                        .build()
                )
                setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                afd.close()
                isLooping = true
                prepare()
                start()
            }
            vibratePattern(context, longArrayOf(0, 1000, 1000, 1000), 1)
        } catch (e: Exception) {
            Log.w(TAG, "Failed to start ringtone", e)
        }
    }

    fun stopRingtone() {
        try {
            ringtonePlayer?.let {
                if (it.isPlaying) it.stop()
                it.release()
            }
        } catch (e: Exception) {
            // ignore
        }
        ringtonePlayer = null
    }

    fun stopAll() {
        stopRingtone()
        try {
            mediaPlayer?.let {
                if (it.isPlaying) it.stop()
                it.release()
            }
        } catch (e: Exception) {
            // ignore
        }
        mediaPlayer = null
        isPlaying = false
    }

    fun vibrate(context: Context, durationMs: Long = 200) {
        try {
            val vibrator = getVibrator(context)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(durationMs)
            }
        } catch (e: Exception) {
            // ignore
        }
    }

    fun vibratePattern(context: Context, pattern: LongArray, repeat: Int = -1) {
        try {
            val vibrator = getVibrator(context)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createWaveform(pattern, repeat))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(pattern, repeat)
            }
        } catch (e: Exception) {
            // ignore
        }
    }

    fun cancelVibrate(context: Context) {
        try {
            getVibrator(context)?.cancel()
        } catch (e: Exception) {
            // ignore
        }
    }

    private fun getVibrator(context: Context): Vibrator? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val manager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            manager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }
    }
}
