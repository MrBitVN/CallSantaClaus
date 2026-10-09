package com.santacall.magic.models

import android.content.Context
import android.content.SharedPreferences

data class ChildProfile(
    var name: String = "Bé Yêu",
    var age: Int = 5,
    var gender: String = "boy", // "boy" or "girl"
    var hobby: String = "Xếp hình Lego & Vẽ tranh",
    var favoriteFood: String = "Bánh pizza & Sữa tươi",
    var goodHabit: String = "Biết vâng lời và chăm học",
    var badHabit: String = "Đi ngủ đúng giờ",
    var dreamGift: String = "Bộ lego cỗ xe tuần lộc",
    var isNice: Boolean = true,
    var language: String = "vi" // "vi" or "en"
) {
    companion object {
        private const val PREFS_NAME = "santa_profile_prefs"
        private const val KEY_NAME = "child_name"
        private const val KEY_AGE = "child_age"
        private const val KEY_GENDER = "child_gender"
        private const val KEY_HOBBY = "child_hobby"
        private const val KEY_FOOD = "child_food"
        private const val KEY_GOOD_HABIT = "child_good_habit"
        private const val KEY_BAD_HABIT = "child_bad_habit"
        private const val KEY_DREAM_GIFT = "child_dream_gift"
        private const val KEY_IS_NICE = "child_is_nice"
        private const val KEY_LANGUAGE = "child_language"

        fun load(context: Context): ChildProfile {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            return ChildProfile(
                name = prefs.getString(KEY_NAME, "Bé Yêu") ?: "Bé Yêu",
                age = prefs.getInt(KEY_AGE, 5),
                gender = prefs.getString(KEY_GENDER, "boy") ?: "boy",
                hobby = prefs.getString(KEY_HOBBY, "Xếp hình Lego & Vẽ tranh") ?: "Xếp hình Lego & Vẽ tranh",
                favoriteFood = prefs.getString(KEY_FOOD, "Bánh pizza & Sữa tươi") ?: "Bánh pizza & Sữa tươi",
                goodHabit = prefs.getString(KEY_GOOD_HABIT, "Biết vâng lời và chăm học") ?: "Biết vâng lời và chăm học",
                badHabit = prefs.getString(KEY_BAD_HABIT, "Đi ngủ đúng giờ") ?: "Đi ngủ đúng giờ",
                dreamGift = prefs.getString(KEY_DREAM_GIFT, "Bộ lego cỗ xe tuần lộc") ?: "Bộ lego cỗ xe tuần lộc",
                isNice = prefs.getBoolean(KEY_IS_NICE, true),
                language = prefs.getString(KEY_LANGUAGE, "vi") ?: "vi"
            )
        }

        fun save(context: Context, profile: ChildProfile) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit().apply {
                putString(KEY_NAME, profile.name)
                putInt(KEY_AGE, profile.age)
                putString(KEY_GENDER, profile.gender)
                putString(KEY_HOBBY, profile.hobby)
                putString(KEY_FOOD, profile.favoriteFood)
                putString(KEY_GOOD_HABIT, profile.goodHabit)
                putString(KEY_BAD_HABIT, profile.badHabit)
                putString(KEY_DREAM_GIFT, profile.dreamGift)
                putBoolean(KEY_IS_NICE, profile.isNice)
                putString(KEY_LANGUAGE, profile.language)
                apply()
            }
        }
    }
}
