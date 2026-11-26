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
    private lateinit var btnNiceYes: Button
    private lateinit var btnNiceNo: Button
    private lateinit var btnSaveProfile: Button

    private lateinit var profile: ChildProfile
    private var selectedIsNice: Boolean = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parent_settings)

        profile = ChildProfile.load(this)
        selectedIsNice = profile.isNice

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
        btnNiceYes = findViewById(R.id.btnLangVi)
        btnNiceNo = findViewById(R.id.btnLangEn)
        btnSaveProfile = findViewById(R.id.btnSaveProfile)

        etChildName.setText(profile.name)
        etChildAge.setText(profile.age.toString())
        etChildGift.setText(profile.dreamGift)
        updateNiceButtons()
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
                Toast.makeText(this, "Incorrect PIN! (Default: 1225)", Toast.LENGTH_SHORT).show()
            }
        }

        btnNiceYes.setOnClickListener {
            selectedIsNice = true
            updateNiceButtons()
        }

        btnNiceNo.setOnClickListener {
            selectedIsNice = false
            updateNiceButtons()
        }

        btnSaveProfile.setOnClickListener {
            val name = etChildName.text.toString().trim().ifEmpty { "Little Star" }
            val age = etChildAge.text.toString().trim().toIntOrNull() ?: 5
            val gift = etChildGift.text.toString().trim().ifEmpty { "Lego Reindeer Sleigh" }

            profile.name = name
            profile.age = age
            profile.dreamGift = gift
            profile.isNice = selectedIsNice
            profile.language = "en"

            ChildProfile.save(this, profile)
            Toast.makeText(this, "Child profile saved successfully!", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private fun updateNiceButtons() {
        if (selectedIsNice) {
            btnNiceYes.setBackgroundColor(0xFF059669.toInt())
            btnNiceNo.setBackgroundColor(0xFF262222.toInt())
        } else {
            btnNiceYes.setBackgroundColor(0xFF262222.toInt())
            btnNiceNo.setBackgroundColor(0xFFD97706.toInt())
        }
    }
}
