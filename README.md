# 🎅 SantaCall Magic - Native iOS (Swift) & Android (Kotlin)

Ứng dụng gọi điện và nhắn tin video với Ông già Noel dành cho trẻ em, hoàn toàn **KHÔNG sử dụng Flutter**.
- **iOS**: 100% Native Xcode Project viết bằng **Swift** (`AppDelegate.swift`, `SceneDelegate.swift`, Swift Package Manager `CapApp-SPM`, `Info.plist`).
- **Android**: 100% Native Android Studio Project viết bằng **Kotlin** (`MainActivity.kt`, Kotlin Gradle Plugin `kotlin-android`, Gradle 8.13).

---

## 📱 File Cài đặt & Triển khai

1. **Android (Kotlin)**:
   - File APK: [`SantaCall_Magic.apk`](./SantaCall_Magic.apk) (nằm ngay thư mục gốc).
   - Cài đặt nhanh qua ADB: chạy file [`CAI_DAT_LEN_ANDROID_ADB.bat`](./CAI_DAT_LEN_ANDROID_ADB.bat).

2. **iOS (Swift)**:
   - Thư mục dự án: [`ios/App`](./ios/App)
   - File đóng gói hoàn chỉnh: [`SantaCall_iOS.zip`](./SantaCall_iOS.zip) (35.7 MB, chứa toàn bộ Xcode project, Swift source code, video HD chuyển động thực tế và âm thanh).
   - **Cách mở trên macOS/Xcode**:
     1. Giải nén `SantaCall_iOS.zip` hoặc copy thư mục `ios/`.
     2. Mở file `ios/App/App.xcodeproj` bằng Xcode.
     3. Trong Xcode, chọn mục **Signing & Capabilities** -> chọn Team của bạn (Personal Team hoặc Developer Account).
     4. Chọn thiết bị iPhone/iPad hoặc Simulator rồi nhấn nút **Run (Cmd + R)** để chạy hoặc **Product > Archive** để xuất file `.ipa`.

---

## 🛠️ Cấu hình Native Đã Hoàn Thiện

### 🍎 iOS (Swift):
- **Ngôn ngữ**: Swift 5.9+ / iOS 15.0+
- **Audio Session (`AppDelegate.swift`)**: Cấu hình `AVAudioSession` dạng `.playAndRecord` với `.defaultToSpeaker`, `.allowBluetooth` giúp chuông điện thoại và giọng nói Ông già Noel phát to rõ ngay cả khi gạt nút im lặng (Silent/Mute switch) trên iPhone.
- **Quyền hạn (`Info.plist`)**:
  - `NSCameraUsageDescription`: Camera cho cuộc gọi Video Call với Ông già Noel.
  - `NSMicrophoneUsageDescription`: Micro trò chuyện và ghi âm điều ước.
  - `NSPhotoLibraryUsageDescription`: Quyền lưu video thư Giáng sinh vào Photos.
  - `UIBackgroundModes`: Chế độ âm thanh nền `audio` không bị tắt khi màn hình khóa.
  - `ITSAppUsesNonExemptEncryption`: `false` (tuân thủ chuẩn xuất bản App Store).
- **Icons & Splash**: Bộ ảnh 1024x1024 chuẩn Apple trong `Assets.xcassets`.

### 🤖 Android (Kotlin):
- **Ngôn ngữ**: Kotlin 2.1.0 (`MainActivity.kt`)
- **JVM Target**: Java 21 / Kotlin 21 compatibility
- **Build System**: Android Gradle Plugin 8.13.0
