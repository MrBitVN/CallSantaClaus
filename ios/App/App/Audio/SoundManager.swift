import Foundation
import AVFoundation
import UIKit

class SoundManager: NSObject, AVAudioPlayerDelegate {
    static let shared = SoundManager()

    private var audioPlayer: AVAudioPlayer?
    private var ringtonePlayer: AVAudioPlayer?
    private var onCompletionHandler: (() -> Void)?

    private override init() {
        super.init()
        configureAudioSession()
    }

    func configureAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(
                .playAndRecord,
                mode: .default,
                options: [.defaultToSpeaker, .allowBluetooth, .allowBluetoothA2DP]
            )
            try session.setActive(true)
        } catch {
            print("AVAudioSession error: \(error)")
        }
    }

    func playAudioFile(named filename: String, onCompletion: (() -> Void)? = nil) {
        stopAll()
        self.onCompletionHandler = onCompletion

        // Search in bundle resources, public/audio, or assets
        var url: URL?
        let baseName = (filename as NSString).deletingPathExtension
        let ext = (filename as NSString).pathExtension.isEmpty ? "mp3" : (filename as NSString).pathExtension

        if let bundleUrl = Bundle.main.url(forResource: filename, withExtension: nil) {
            url = bundleUrl
        } else if let bundleUrl = Bundle.main.url(forResource: baseName, withExtension: ext) {
            url = bundleUrl
        } else if let bundleUrl = Bundle.main.url(forResource: baseName, withExtension: ext, subdirectory: "public/audio") {
            url = bundleUrl
        }

        guard let validUrl = url else {
            print("Audio file not found: \(filename)")
            onCompletion?()
            return
        }

        do {
            audioPlayer = try AVAudioPlayer(contentsOf: validUrl)
            audioPlayer?.delegate = self
            audioPlayer?.prepareToPlay()
            audioPlayer?.play()
        } catch {
            print("Error playing audio: \(error)")
            onCompletion?()
        }
    }

    func startRingtone() {
        stopRingtone()

        var ringUrl = Bundle.main.url(forResource: "santa_ring_call_vi", withExtension: "mp3")
        if ringUrl == nil {
            ringUrl = Bundle.main.url(forResource: "santa_ring_call_vi", withExtension: "mp3", subdirectory: "public/audio")
        }

        guard let url = ringUrl else { return }

        do {
            ringtonePlayer = try AVAudioPlayer(contentsOf: url)
            ringtonePlayer?.numberOfLoops = -1
            ringtonePlayer?.prepareToPlay()
            ringtonePlayer?.play()
            triggerHaptic()
        } catch {
            print("Error playing ringtone: \(error)")
        }
    }

    func stopRingtone() {
        ringtonePlayer?.stop()
        ringtonePlayer = nil
    }

    func stopAll() {
        stopRingtone()
        audioPlayer?.stop()
        audioPlayer = nil
        onCompletionHandler = nil
    }

    func triggerHaptic(style: UIImpactFeedbackGenerator.FeedbackStyle = .heavy) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.prepare()
        generator.impactOccurred()
    }

    func triggerSuccessHaptic() {
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(.success)
    }

    // MARK: - AVAudioPlayerDelegate
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        let handler = onCompletionHandler
        onCompletionHandler = nil
        handler?()
    }
}
