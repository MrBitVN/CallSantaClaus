package com.santacall.magic

import android.app.Activity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import com.santacall.magic.models.ChildProfile

class ParentSettingsActivity : Activity() {

    private lateinit var btnBackFromSettings: Button
    private lateinit var layoutPinGate: LinearLayout
    private lateinit var etPinCode: EditText
    private lateinit var btnVerifyPin: Button

    private lateinit var layoutProfileForm: LinearLayout
    private lateinit var etChildName: EditText
    private lateinit var etChildAge: EditText
    private lateinit var etChildGift: EditText
    private lateinit var btnLangVi: Button
    private lateinit var btnLangEn: Button
    private lateinit var btnSaveProfile: Button

    private lateinit var profile: ChildProfile
    private var selectedLanguage: String = "vi"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parent_settings)

        profile = ChildProfile.load(this)
        selectedLanguage = profile.language

        initViews()
        setupListeners()
    }

    private fun initViews() {
        btnBackFromSettings = findViewById(R.id.btnBackFromSettings)
        layoutPinGate = findViewById(R.id.layoutPinGate)
        etPinCode = findViewById(R.id.etPinCode)
        btnVerifyPin = findViewById(R.id.btnVerifyPin)

        layoutProfileForm = findViewById(R.id.layoutProfileForm)
        etChildName = findViewById(R.id.etChildName)
        etChildAge = findViewById(R.id.etChildAge)
        etChildGift = findViewById(R.id.etChildGift)
        btnLangVi = findViewById(R.id.btnLangVi)
        btnLangEn = findViewById(R.id.btnLangEn)
        btnSaveProfile = findViewById(R.id.btnSaveProfile)

        // Prepopulate values
        etChildName.setText(profile.name)
        etChildAge.setText(profile.age.toString())
        etChildGift.setText(profile.dreamGift)
        updateLanguageButtons()
    }

    private fun setupListeners() {
        btnBackFromSettings.setOnClickListener {
            finish()
        }

        btnVerifyPin.setOnClickListener {
            val pin = etPinCode.text.toString().trim()
            if (pin == "1225" || pin == "0000") {
                layoutPinGate.visibility = View.GONE
                layoutProfileForm.visibility = View.VISIBLE
            } else {
                Toast.makeText(this, "Mã PIN không chính xác! (Mặc định: 1225)", Toast.LENGTH_SHORT).show()
            }
        }

        btnLangVi.setOnClickListener {
            selectedLanguage = "vi"
            updateLanguageButtons()
        }

        btnLangEn.setOnClickListener {
            selectedLanguage = "en"
            updateLanguageButtons()
        }

        btnSaveProfile.setOnClickListener {
            val name = etChildName.text.toString().trim().ifEmpty { "Bé Yêu" }
            val age = etChildAge.text.toString().trim().toIntOrNull() ?: 5
            val gift = etChildGift.text.toString().trim().ifEmpty { "Bộ đồ chơi lego" }

            profile.name = name
            profile.age = age
            profile.dreamGift = gift
            profile.language = selectedLanguage

            ChildProfile.save(this, profile)
            Toast.makeText(this, "Đã lưu cài đặt bé thành công!", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private fun updateLanguageButtons() {
        if (selectedLanguage == "vi") {
            btnLangVi.setBackgroundColor(0xFF059669.toInt())
            btnLangEn.setBackgroundColor(0xFF262222.toInt())
        } else {
            btnLangVi.setBackgroundColor(0xFF262222.toInt())
            btnLangEn.setBackgroundColor(0xFF059669.toInt())
        }
    }
}
