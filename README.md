# 🎅 SantaCall Magic - 100% Native iOS (Swift) & Android (Kotlin)

Ứng dụng gọi điện và nhắn tin video với Ông già Noel dành cho trẻ em, hoàn toàn **THUẦN NATIVE 100%**, **KHÔNG sử dụng React Native** và **KHÔNG dùng Flutter hay Webview**:
- **iOS**: 100% Native Xcode Project viết bằng **Swift 5.9+ / UIKit / AVFoundation / AVKit / AudioToolbox**.
- **Android**: 100% Native Android Studio Project viết bằng **Kotlin 2.1+ / Android SDK / Media / Camera / Material Components**.

---

## 📱 File Cài đặt & Triển khai

1. **Android (Kotlin)**:
   - File APK: [`SantaCall_Magic.apk`](./SantaCall_Magic.apk) (nằm ngay thư mục gốc, dung lượng ~44 MB đầy đủ trọn bộ video & âm thanh).
   - Cài đặt nhanh qua ADB: chạy file [`CAI_DAT_LEN_ANDROID_ADB.bat`](./CAI_DAT_LEN_ANDROID_ADB.bat).

2. **iOS (Swift)**:
   - File cài đặt hoàn thiện (.IPA): [`SantaCall_Magic.ipa`](./SantaCall_Magic.ipa) (nằm ngay thư mục gốc, dung lượng ~37.8 MB, dùng để kéo cài trực tiếp vào iPhone qua Sideloadly / AltStore).
   - Thư mục dự án: [`ios/App`](./ios/App)
   - File đóng gói hoàn chỉnh: [`SantaCall_iOS.zip`](./SantaCall_iOS.zip) (chứa toàn bộ Xcode project `App.xcodeproj`, Swift source code, video HD chuyển động thực tế và âm thanh).
   - **Cách mở trên macOS/Xcode**:
     1. Giải nén `SantaCall_iOS.zip` hoặc copy thư mục `ios/`.
     2. Mở file `ios/App/App.xcodeproj` bằng Xcode.
     3. Trong Xcode, chọn mục **Signing & Capabilities** -> chọn Team của bạn (Personal Team hoặc Developer Account).
     4. Chọn thiết bị iPhone/iPad hoặc Simulator rồi nhấn nút **Run (Cmd + R)** để chạy hoặc **Product > Archive** để xuất file `.ipa`.

---

## 🏗️ Kiến Trúc Native Chi Tiết

### 🤖 Android (100% Native Kotlin)
- `MainActivity.kt`: Màn hình chính phong cách Giáng Sinh sang trọng, hiển thị thời tiết Bắc Cực, huy hiệu Bé Ngoan, nút hẹn giờ cuộc gọi (10s, 30s, 60s) và điều hướng các chức năng.
- `AudioCallActivity.kt`: Cuộc gọi thoại tương tác đa lượt (Gọi - Thưa 4 Lượt) có lời thoại, phụ đề, âm thanh thực tế từ Santa.
- `IncomingCallActivity.kt`: Màn hình chuông điện thoại đến mô phỏng chân thực cuộc gọi từ Bắc Cực với nhạc chuông, rung haptic và nút Nhận/Từ chối.
- `VideoCallActivity.kt`: Cuộc gọi video FaceTime HD với Santa đang trò chuyện lặp video sắc nét, bộ đếm thời gian thực và khung camera trước của bé.
- `VideoMessagesActivity.kt`: Thư viện phát video lời nhắn từ Santa (Sinh nhật, Cuốn sổ bé ngoan, Cỗ xe tuần lộc, Đọc thư).
- `SantaChatActivity.kt`: Nhắn tin tương tác thời gian thực với Ông già Noel kèm gợi ý câu trả lời nhanh và phản hồi thông minh theo hồ sơ bé.
- `VoicemailActivity.kt`: Bàn phím số gọi thư thoại với âm thanh DTMF và nút ghi âm điều ước Giáng sinh gửi về Bắc Cực.
- `ParentSettingsActivity.kt`: Khóa bảo mật mã PIN phụ huynh (mặc định: `1225`), tùy biến tên bé, tuổi, trạng thái Bé Ngoan ⭐, món quà ước mơ và ngôn ngữ (Tiếng Việt / English).
- `SoundManager.kt`: Quản lý phát âm thanh, nhạc chuông nền và hiệu ứng rung.

### 🍎 iOS (100% Native Swift)
- `MainViewController.swift`: Giao diện chính UIKit điều hướng mượt mà, hỗ trợ hẹn giờ cuộc gọi đến.
- `AudioCallViewController.swift`: Cuộc gọi thoại tương tác Gọi - Thưa đa lượt với AVAudioPlayer, phụ đề và gợi ý trả lời.
- `IncomingCallViewController.swift`: Giao diện nhận cuộc gọi đến chuẩn iOS với nhạc chuông, rung phản hồi và phân luồng gọi thoại / video.
- `VideoCallViewController.swift`: Cuộc gọi video FaceTime HD với `AVPlayer` + `AVPlayerLayer` và camera trước của bé (PIP) với `AVCaptureSession`.
- `VideoMessagesViewController.swift`: Danh sách lời nhắn video và phát video trực tiếp qua `AVPlayerViewController`.
- `SantaChatViewController.swift`: Khung chat tin nhắn với Santa Claus bằng `UITableView` và các bong bóng chat sinh động.
- `VoicemailViewController.swift`: Bàn phím số quay số âm thanh DTMF `AudioServicesPlaySystemSound` và ghi âm điều ước.
- `ParentSettingsViewController.swift`: Màn hình khóa PIN và cấu hình hồ sơ bé lưu vào `UserDefaults`.
- `SoundManager.swift`: Quản lý âm thanh `AVAudioSession` chuẩn cuộc gọi (phát to rõ ngay cả khi gạt nút im lặng).
- `ChildProfile.swift` & `CallScenario.swift`: Data models chuẩn Swift `Codable`.
