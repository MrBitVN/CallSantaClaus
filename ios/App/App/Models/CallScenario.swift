import Foundation

struct CallScenario: Identifiable {
    let id: String
    let titleVi: String
    let titleEn: String
    let descVi: String
    let descEn: String
    let category: String
    let audioVi: String
    let audioEn: String

    func title(for lang: String) -> String {
        return lang == "vi" ? titleVi : titleEn
    }

    func desc(for lang: String) -> String {
        return lang == "vi" ? descVi : descEn
    }

    func audio(for lang: String) -> String {
        return lang == "vi" ? audioVi : audioEn
    }

    static let defaultScenarios: [CallScenario] = [
        CallScenario(
            id: "interactive_call",
            titleVi: "Cuộc Gọi Tương Tác (Gọi - Thưa 4 Lượt)",
            titleEn: "Interactive Call (4-Turn Dialogue)",
            descVi: "Santa gọi đến, xác nhận bé thưa chuyện, khen bé ngoan và hỏi quà ước mơ",
            descEn: "Santa rings, verifies child identity, praises good habits, and asks for dream gift",
            category: "praise",
            audioVi: "santa_vi_call_turn1.mp3",
            audioEn: "santa_turn1_opening.mp3"
        ),
        CallScenario(
            id: "happy_birthday",
            titleVi: "Chúc Mừng Sinh Nhật Từ Bắc Cực",
            titleEn: "Happy Birthday from Santa",
            descVi: "Santa mở lịch Bắc Cực và gửi lời chúc mừng sinh nhật kỳ diệu cho bé",
            descEn: "Santa marks child's birthday on North Pole calendar with magical blessings",
            category: "special",
            audioVi: "santa_scenario_birthday.mp3",
            audioEn: "santa_scenario_birthday.mp3"
        ),
        CallScenario(
            id: "gentle_discipline",
            titleVi: "Nhắc Nhở Bé Ngoan & Vâng Lời",
            titleEn: "Gentle Discipline & Encouragement",
            descVi: "Santa nhẹ nhàng khuyên bảo bé nghe lời bố mẹ và hứa giữ quà Noel",
            descEn: "Santa gently reminds child to listen to parents and keep their special promise",
            category: "discipline",
            audioVi: "santa_scenario_discipline.mp3",
            audioEn: "santa_scenario_discipline.mp3"
        ),
        CallScenario(
            id: "christmas_eve_flight",
            titleVi: "Cỗ Xe Tuần Lộc Đêm Giáng Sinh",
            titleEn: "Christmas Eve Sleigh Flight",
            descVi: "Santa và tuần lộc Rudolph đang bay qua các đám mây mang quà tới",
            descEn: "Santa and Rudolph flying through starry skies delivering holiday gifts",
            category: "flight",
            audioVi: "santa_scenario_eve.mp3",
            audioEn: "santa_scenario_eve.mp3"
        )
    ]
}
