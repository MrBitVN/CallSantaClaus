import Foundation

struct ChildProfile: Codable {
    var name: String = "Little Star"
    var age: Int = 5
    var gender: String = "boy"
    var hobby: String = "Lego & Drawing"
    var favoriteFood: String = "Pizza & Milk"
    var goodHabit: String = "Listening to parents and studying hard"
    var badHabit: String = "Going to bed on time"
    var dreamGift: String = "Lego Reindeer Sleigh"
    var isNice: Bool = true
    var language: String = "en"

    static let userDefaultsKey = "SantaChildProfileKey"

    static func load() -> ChildProfile {
        if let data = UserDefaults.standard.data(forKey: userDefaultsKey),
           var profile = try? JSONDecoder().decode(ChildProfile.self, from: data) {
            profile.language = "en"
            return profile
        }
        return ChildProfile()
    }

    func save() {
        var copy = self
        copy.language = "en"
        if let data = try? JSONEncoder().encode(copy) {
            UserDefaults.standard.set(data, forKey: ChildProfile.userDefaultsKey)
        }
    }
}
