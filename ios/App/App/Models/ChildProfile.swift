import Foundation

struct ChildProfile: Codable {
    var name: String = "Bé Yêu"
    var age: Int = 5
    var gender: String = "boy"
    var hobby: String = "Xếp hình Lego & Vẽ tranh"
    var favoriteFood: String = "Bánh pizza & Sữa tươi"
    var goodHabit: String = "Biết vâng lời và chăm học"
    var badHabit: String = "Đi ngủ đúng giờ"
    var dreamGift: String = "Bộ lego cỗ xe tuần lộc"
    var isNice: Boolean = true
    var language: String = "vi" // "vi" or "en"

    static let userDefaultsKey = "SantaChildProfileKey"

    static func load() -> ChildProfile {
        if let data = UserDefaults.standard.data(forKey: userDefaultsKey),
           let profile = try? JSONDecoder().decode(ChildProfile.self, from: data) {
            return profile
        }
        return ChildProfile()
    }

    func save() {
        if let data = try? JSONEncoder().encode(self) {
            UserDefaults.standard.set(data, forKey: ChildProfile.userDefaultsKey)
        }
    }
}
