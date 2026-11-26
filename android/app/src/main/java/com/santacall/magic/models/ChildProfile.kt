package com.santacall.magic.models

import android.content.Context

data class ChildProfile(
    var name: String = "Little Star",
    var age: Int = 5,
    var gender: String = "boy", // "boy" or "girl"
    var hobby: String = "Lego & Drawing",
    var favoriteFood: String = "Pizza & Milk",
    var goodHabit: String = "Listening to parents and studying hard",
    var badHabit: String = "Going to bed on time",
    var dreamGift: String = "Lego Reindeer Sleigh",
    var isNice: Boolean = true,
    var language: String = "en"
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
                name = prefs.getString(KEY_NAME, "Little Star") ?: "Little Star",
                age = prefs.getInt(KEY_AGE, 5),
                gender = prefs.getString(KEY_GENDER, "boy") ?: "boy",
                hobby = prefs.getString(KEY_HOBBY, "Lego & Drawing") ?: "Lego & Drawing",
                favoriteFood = prefs.getString(KEY_FOOD, "Pizza & Milk") ?: "Pizza & Milk",
                goodHabit = prefs.getString(KEY_GOOD_HABIT, "Listening to parents and studying hard") ?: "Listening to parents and studying hard",
                badHabit = prefs.getString(KEY_BAD_HABIT, "Going to bed on time") ?: "Going to bed on time",
                dreamGift = prefs.getString(KEY_DREAM_GIFT, "Lego Reindeer Sleigh") ?: "Lego Reindeer Sleigh",
                isNice = prefs.getBoolean(KEY_IS_NICE, true),
                language = "en"
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
                putString(KEY_LANGUAGE, "en")
                apply()
            }
        }
    }
}
