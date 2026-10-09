import UIKit

class AudioCallViewController: UIViewController {

    enum CallStage {
        case turn1Opening
        case pauseGreeting
        case turn2Behavior
        case pauseBehavior
        case turn3Gift
        case pauseGift
        case turn4Farewell
        case callCompleted
    }

    private var profile = ChildProfile.load()
    private var currentStage: CallStage = .turn1Opening
    private var callSeconds = 0
    private var callTimer: Timer?
    private var pauseTimer: Timer?
    private var autoEndTimer: Timer?
    private var isMuted = false
    private var showSubtitles = true

    // UI Elements
    private let timerLabel = UILabel()
    private let statusBadge = UILabel()
    private let avatarImageView = UIImageView()
    private let stageBadge = UILabel()
    private let callerNameLabel = UILabel()
    private let childInfoLabel = UILabel()
    private let subtitleCard = UIView()
    private let subtitleLabel = UILabel()

    private let childInteractionContainer = UIStackView()
    private let promptHintLabel = UILabel()
    private let option1Button = UIButton(type: .system)
    private let option2Button = UIButton(type: .system)

    private let controlsStack = UIStackView()
    private let muteButton = UIButton(type: .system)
    private let replayButton = UIButton(type: .system)
    private let subtitlesButton = UIButton(type: .system)
    private let endCallButton = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.04, green: 0.03, blue: 0.03, alpha: 1.0)
        setupUI()
        startCallTimer()
        startStage(.turn1Opening)
    }

    private func setupUI() {
        // Timer Label
        timerLabel.text = "00:00"
        timerLabel.textColor = .lightGray
        timerLabel.font = UIFont.monospacedDigitSystemFont(ofSize: 14, weight: .bold)
        timerLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(timerLabel)

        // Status Badge
        statusBadge.text = " Bắc Cực • HD AUDIO "
        statusBadge.textColor = UIColor(red: 0.52, green: 0.94, blue: 0.67, alpha: 1.0)
        statusBadge.backgroundColor = UIColor(red: 0.1, green: 0.2, blue: 0.12, alpha: 1.0)
        statusBadge.font = UIFont.boldSystemFont(ofSize: 11)
        statusBadge.layer.cornerRadius = 8
        statusBadge.clipsToBounds = true
        statusBadge.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(statusBadge)

        // Avatar
        avatarImageView.image = UIImage(named: "santa_avatar") ?? UIImage(named: "Splash")
        avatarImageView.contentMode = .scaleAspectFill
        avatarImageView.layer.cornerRadius = 65
        avatarImageView.layer.borderWidth = 3
        avatarImageView.layer.borderColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0).cgColor
        avatarImageView.clipsToBounds = true
        avatarImageView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(avatarImageView)

        // Stage Badge
        stageBadge.text = "🎅 Santa đang nói..."
        stageBadge.font = UIFont.boldSystemFont(ofSize: 11)
        stageBadge.textColor = .black
        stageBadge.backgroundColor = UIColor(red: 0.96, green: 0.62, blue: 0.04, alpha: 1.0)
        stageBadge.textAlignment = .center
        stageBadge.layer.cornerRadius = 10
        stageBadge.clipsToBounds = true
        stageBadge.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stageBadge)

        // Caller Name
        callerNameLabel.text = profile.language == "vi" ? "Ông Già Noel" : "Santa Claus"
        callerNameLabel.font = UIFont.boldSystemFont(ofSize: 26)
        callerNameLabel.textColor = UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0)
        callerNameLabel.textAlignment = .center
        callerNameLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(callerNameLabel)

        // Child Info
        childInfoLabel.text = profile.language == "vi" ? "Cuộc gọi cho: \(profile.name) (\(profile.age) tuổi)" : "Call for: \(profile.name) (\(profile.age) yo)"
        childInfoLabel.font = UIFont.systemFont(ofSize: 13)
        childInfoLabel.textColor = UIColor(red: 0.99, green: 0.9, blue: 0.54, alpha: 1.0)
        childInfoLabel.textAlignment = .center
        childInfoLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(childInfoLabel)

        // Subtitle Card
        subtitleCard.backgroundColor = UIColor(red: 0.12, green: 0.1, blue: 0.1, alpha: 0.95)
        subtitleCard.layer.cornerRadius = 16
        subtitleCard.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(subtitleCard)

        subtitleLabel.textColor = .white
        subtitleLabel.font = UIFont.italicSystemFont(ofSize: 13)
        subtitleLabel.numberOfLines = 0
        subtitleLabel.textAlignment = .center
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        subtitleCard.addSubview(subtitleLabel)

        // Child Interaction Buttons
        childInteractionContainer.axis = .vertical
        childInteractionContainer.spacing = 8
        childInteractionContainer.alignment = .fill
        childInteractionContainer.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(childInteractionContainer)

        promptHintLabel.textColor = UIColor(red: 0.43, green: 0.91, blue: 0.72, alpha: 1.0)
        promptHintLabel.font = UIFont.boldSystemFont(ofSize: 12)
        promptHintLabel.textAlignment = .center
        childInteractionContainer.addArrangedSubview(promptHintLabel)

        let buttonsRow = UIStackView(arrangedSubviews: [option1Button, option2Button])
        buttonsRow.axis = .horizontal
        buttonsRow.spacing = 10
        buttonsRow.distribution = .fillEqually
        childInteractionContainer.addArrangedSubview(buttonsRow)

        option1Button.backgroundColor = UIColor(red: 0.02, green: 0.59, blue: 0.41, alpha: 1.0)
        option1Button.setTitleColor(.white, for: .normal)
        option1Button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 12)
        option1Button.layer.cornerRadius = 12
        option1Button.heightAnchor.constraint(equalToConstant: 44).isActive = true
        option1Button.addTarget(self, action: #selector(childAnswerTapped), for: .touchUpInside)

        option2Button.backgroundColor = UIColor(red: 0.85, green: 0.47, blue: 0.02, alpha: 1.0)
        option2Button.setTitleColor(.white, for: .normal)
        option2Button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 12)
        option2Button.layer.cornerRadius = 12
        option2Button.heightAnchor.constraint(equalToConstant: 44).isActive = true
        option2Button.addTarget(self, action: #selector(childAnswerTapped), for: .touchUpInside)

        // Bottom Controls
        controlsStack.axis = .horizontal
        controlsStack.spacing = 30
        controlsStack.distribution = .equalCentering
        controlsStack.alignment = .center
        controlsStack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(controlsStack)

        setupControlBtn(muteButton, title: "Mic", action: #selector(muteTapped))
        setupControlBtn(replayButton, title: "Replay", action: #selector(replayTapped))
        setupControlBtn(subtitlesButton, title: "Phụ đề", action: #selector(subtitlesTapped))

        // End Call Button
        endCallButton.backgroundColor = UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0)
        endCallButton.setTitle("📞", for: .normal)
        endCallButton.titleLabel?.font = UIFont.systemFont(ofSize: 28)
        endCallButton.layer.cornerRadius = 35
        endCallButton.translatesAutoresizingMaskIntoConstraints = false
        endCallButton.addTarget(self, action: #selector(endCallTapped), for: .touchUpInside)
        view.addSubview(endCallButton)

        // Constraints
        NSLayoutConstraint.activate([
            timerLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            timerLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),

            statusBadge.centerYAnchor.constraint(equalTo: timerLabel.centerYAnchor),
            statusBadge.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            statusBadge.heightAnchor.constraint(equalToConstant: 24),

            avatarImageView.topAnchor.constraint(equalTo: timerLabel.bottomAnchor, constant: 24),
            avatarImageView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            avatarImageView.widthAnchor.constraint(equalToConstant: 130),
            avatarImageView.heightAnchor.constraint(equalToConstant: 130),

            stageBadge.topAnchor.constraint(equalTo: avatarImageView.bottomAnchor, constant: -12),
            stageBadge.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stageBadge.heightAnchor.constraint(equalToConstant: 24),
            stageBadge.widthAnchor.constraint(greaterThanOrEqualToConstant: 140),

            callerNameLabel.topAnchor.constraint(equalTo: stageBadge.bottomAnchor, constant: 16),
            callerNameLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            childInfoLabel.topAnchor.constraint(equalTo: callerNameLabel.bottomAnchor, constant: 4),
            childInfoLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            subtitleCard.topAnchor.constraint(equalTo: childInfoLabel.bottomAnchor, constant: 16),
            subtitleCard.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            subtitleCard.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),

            subtitleLabel.topAnchor.constraint(equalTo: subtitleCard.topAnchor, constant: 12),
            subtitleLabel.bottomAnchor.constraint(equalTo: subtitleCard.bottomAnchor, constant: -12),
            subtitleLabel.leadingAnchor.constraint(equalTo: subtitleCard.leadingAnchor, constant: 14),
            subtitleLabel.trailingAnchor.constraint(equalTo: subtitleCard.trailingAnchor, constant: -14),

            childInteractionContainer.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            childInteractionContainer.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            childInteractionContainer.bottomAnchor.constraint(equalTo: controlsStack.topAnchor, constant: -20),

            controlsStack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 50),
            controlsStack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -50),
            controlsStack.bottomAnchor.constraint(equalTo: endCallButton.topAnchor, constant: -24),

            endCallButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            endCallButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            endCallButton.widthAnchor.constraint(equalToConstant: 70),
            endCallButton.heightAnchor.constraint(equalToConstant: 70),
        ])
    }

    private func setupControlBtn(_ btn: UIButton, title: String, action: Selector) {
        btn.setTitle(title, for: .normal)
        btn.setTitleColor(.lightGray, for: .normal)
        btn.titleLabel?.font = UIFont.systemFont(ofSize: 12)
        btn.backgroundColor = UIColor(white: 0.15, alpha: 1.0)
        btn.layer.cornerRadius = 24
        btn.widthAnchor.constraint(equalToConstant: 48).isActive = true
        btn.heightAnchor.constraint(equalToConstant: 48).isActive = true
        btn.addTarget(self, action: action, for: .touchUpInside)
        controlsStack.addArrangedSubview(btn)
    }

    private func startCallTimer() {
        callTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.callSeconds += 1
            let mins = self.callSeconds / 60
            let secs = self.callSeconds % 60
            self.timerLabel.text = String(format: "%02d:%02d", mins, secs)
        }
    }

    private func startStage(_ stage: CallStage) {
        pauseTimer?.invalidate()
        currentStage = stage
        let isVi = profile.language == "vi"

        switch stage {
        case .turn1Opening:
            stageBadge.text = isVi ? "🎅 Santa đang nói..." : "🎅 Santa speaking..."
            stageBadge.backgroundColor = UIColor(red: 0.96, green: 0.62, blue: 0.04, alpha: 1.0)
            childInteractionContainer.isHidden = true

            let text = isVi ? "A lô! A lô! Có phải bé \(profile.name) đó không? Ta là Ông già Noel gọi đến từ Bắc Cực đây! Cháu yêu có nghe rõ giọng của Ông không nào?" : "Ho ho ho! Hello there! Is that my little friend \(profile.name)? This is Santa Claus calling all the way from the snowy North Pole! Can you hear me loud and clear?"
            subtitleLabel.text = text

            let file = isVi ? "santa_vi_call_turn1.mp3" : "santa_turn1_opening.mp3"
            SoundManager.shared.playAudioFile(named: file) { [weak self] in
                DispatchQueue.main.async {
                    self?.startStage(.pauseGreeting)
                }
            }

        case .pauseGreeting:
            // QUÃNG NGHỈ 1: Santa lắng nghe bé thưa (5s)
            stageBadge.text = isVi ? "👂 Santa đang lắng nghe bé thưa..." : "👂 Santa listening..."
            stageBadge.backgroundColor = UIColor(red: 0.02, green: 0.59, blue: 0.41, alpha: 1.0)
            SoundManager.shared.triggerHaptic()

            promptHintLabel.text = isVi ? "Bé thưa chuyện với Ông già Noel:" : "Answer Santa Claus:"
            option1Button.setTitle(isVi ? "⭐ Dạ vâng, con chào Ông ạ!" : "⭐ Yes, hello Santa!", for: .normal)
            option2Button.setTitle(isVi ? "🎅 Dạ con nghe rất rõ ạ!" : "🎅 I hear you loud!", for: .normal)
            childInteractionContainer.isHidden = false

            startPauseTimer(seconds: 5) { [weak self] in
                self?.startStage(.turn2Behavior)
            }

        case .turn2Behavior:
            stageBadge.text = isVi ? "🎅 Santa đang nói..." : "🎅 Santa speaking..."
            stageBadge.backgroundColor = UIColor(red: 0.96, green: 0.62, blue: 0.04, alpha: 1.0)
            childInteractionContainer.isHidden = true

            let text = isVi ? "Ừ, ngoan lắm! Ta đang ở xưởng quà Bắc Cực, mở cuốn Sổ Bé Ngoan ra kiểm tra đây. Thế năm nay ở nhà và ở trường, cháu có ngoan ngoãn nghe lời bố mẹ, chịu khó ăn ngoan và chăm học không nào?" : "Splendid! That is music to my ears! My big Golden Book of Good Children is open right in front of me. Tell Santa, have you been listening to mommy and daddy, finishing your meals, and being extra good this year?"
            subtitleLabel.text = text

            let file = isVi ? "santa_vi_call_turn2.mp3" : "santa_turn2_gift_ask.mp3"
            SoundManager.shared.playAudioFile(named: file) { [weak self] in
                DispatchQueue.main.async {
                    self?.startStage(.pauseBehavior)
                }
            }

        case .pauseBehavior:
            stageBadge.text = isVi ? "👂 Santa đang lắng nghe bé trả lời..." : "👂 Santa listening..."
            stageBadge.backgroundColor = UIColor(red: 0.02, green: 0.59, blue: 0.41, alpha: 1.0)
            SoundManager.shared.triggerHaptic()

            promptHintLabel.text = isVi ? "Bé trả lời Ông già Noel:" : "Tell Santa about your year:"
            option1Button.setTitle(isVi ? "🌟 Dạ con ngoan và nghe lời ạ!" : "🌟 I've been very nice!", for: .normal)
            option2Button.setTitle(isVi ? "😇 Dạ con hứa sẽ chăm hơn ạ!" : "😇 Trying my best!", for: .normal)
            childInteractionContainer.isHidden = false

            startPauseTimer(seconds: 5) { [weak self] in
                self?.startStage(.turn3Gift)
            }

        case .turn3Gift:
            stageBadge.text = isVi ? "🎅 Santa đang nói..." : "🎅 Santa speaking..."
            stageBadge.backgroundColor = UIColor(red: 0.96, green: 0.62, blue: 0.04, alpha: 1.0)
            childInteractionContainer.isHidden = true

            let text = isVi ? "Ho ho ho! Tuyệt vời lắm! Cháu thật là một em bé ngoan và hiếu thảo! Ông già Noel rất tự hào về cháu đấy! Nào, bây giờ nói nhỏ cho Ta nghe xem, Giáng Sinh năm nay cháu ao ước được nhận món quà gì nhất nào?" : "Ho ho ho! Wonderful! Santa and the elves are so proud of you! Now tell me, my sweet child, what special gift do you wish for the most under your Christmas tree?"
            subtitleLabel.text = text

            let file = isVi ? "santa_vi_call_turn3.mp3" : "santa_turn3_cookies_ask.mp3"
            SoundManager.shared.playAudioFile(named: file) { [weak self] in
                DispatchQueue.main.async {
                    self?.startStage(.pauseGift)
                }
            }

        case .pauseGift:
            stageBadge.text = isVi ? "👂 Santa đang lắng nghe quà ước mơ..." : "👂 Santa listening for wishlist..."
            stageBadge.backgroundColor = UIColor(red: 0.02, green: 0.59, blue: 0.41, alpha: 1.0)
            SoundManager.shared.triggerHaptic()

            let gift = profile.dreamGift.isEmpty ? "Bộ đồ chơi xếp hình" : profile.dreamGift
            promptHintLabel.text = isVi ? "Nói món quà ước mơ cho Santa:" : "Tell Santa your wish:"
            option1Button.setTitle("🎁 \(gift)", for: .normal)
            option2Button.setTitle(isVi ? "✨ Một điều ước bất ngờ!" : "✨ A surprise gift!", for: .normal)
            childInteractionContainer.isHidden = false

            startPauseTimer(seconds: 6) { [weak self] in
                self?.startStage(.turn4Farewell)
            }

        case .turn4Farewell:
            stageBadge.text = isVi ? "🎅 Santa đang nói..." : "🎅 Santa speaking..."
            stageBadge.backgroundColor = UIColor(red: 0.96, green: 0.62, blue: 0.04, alpha: 1.0)
            childInteractionContainer.isHidden = true

            let text = isVi ? "Ho ho ho! Món quà đó tuyệt vời quá! Ta đã bảo các chú lùn ghi lại ngay vào danh sách rồi nhé! Đêm Noel Ta cùng cỗ xe tuần lộc bay qua sẽ mang đến cho cháu! Nhớ là phải ngủ sớm, ăn ngoan và luôn là một em bé ngoan nhé! Chúc cháu và gia đình một mùa Giáng Sinh ấm áp và an lành! Tạm biệt cháu yêu nhé! Ho ho ho!" : "Ho ho ho! What a marvelous wish! The elves in my workshop are wrapping that golden gift right now! Remember to go to bed early on Christmas Eve, close your eyes tight, and keep spreading joy! Merry Christmas to you and your family, goodbye, Ho ho ho!"
            subtitleLabel.text = text

            let file = isVi ? "santa_vi_call_turn4.mp3" : "santa_turn4_farewell.mp3"
            SoundManager.shared.playAudioFile(named: file) { [weak self] in
                DispatchQueue.main.async {
                    self?.startStage(.callCompleted)
                }
            }

        case .callCompleted:
            stageBadge.text = isVi ? "✨ Hoàn thành cuộc gọi" : "✨ Call Completed"
            stageBadge.backgroundColor = UIColor(red: 0.02, green: 0.59, blue: 0.41, alpha: 1.0)

            promptHintLabel.text = isVi ? "Bé chào tạm biệt Santa:" : "Say goodbye to Santa:"
            option1Button.setTitle(isVi ? "💖 Dạ con chào Ông, con cảm ơn Ông!" : "💖 Goodbye Santa!", for: .normal)
            option2Button.isHidden = true
            childInteractionContainer.isHidden = false

            autoEndTimer = Timer.scheduledTimer(withTimeInterval: 3.0, repeats: false) { [weak self] _ in
                self?.endCallSafely()
            }
        }
    }

    private func startPauseTimer(seconds: Int, onFinish: @escaping () -> Void) {
        pauseTimer?.invalidate()
        var remaining = seconds
        pauseTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] timer in
            remaining -= 1
            guard let self = self else { return }
            let isVi = self.profile.language == "vi"
            self.stageBadge.text = isVi ? "👂 Santa đang lắng nghe... (\(remaining)s)" : "👂 Santa listening... (\(remaining)s)"
            if remaining <= 0 {
                timer.invalidate()
                onFinish()
            }
        }
    }

    @objc private func childAnswerTapped() {
        pauseTimer?.invalidate()
        SoundManager.shared.triggerHaptic(style: .medium)

        switch currentStage {
        case .pauseGreeting: startStage(.turn2Behavior)
        case .pauseBehavior: startStage(.turn3Gift)
        case .pauseGift: startStage(.turn4Farewell)
        case .callCompleted: endCallSafely()
        default: break
        }
    }

    @objc private func muteTapped() {
        isMuted.toggle()
        muteButton.alpha = isMuted ? 0.5 : 1.0
        muteButton.setTitle(isMuted ? "Unmute" : "Mute", for: .normal)
    }

    @objc private func replayTapped() {
        SoundManager.shared.stopAll()
        pauseTimer?.invalidate()
        autoEndTimer?.invalidate()
        option2Button.isHidden = false
        startStage(.turn1Opening)
    }

    @objc private func subtitlesTapped() {
        showSubtitles.toggle()
        subtitleCard.isHidden = !showSubtitles
    }

    @objc private func endCallTapped() {
        endCallSafely()
    }

    private func endCallSafely() {
        SoundManager.shared.stopAll()
        callTimer?.invalidate()
        pauseTimer?.invalidate()
        autoEndTimer?.invalidate()
        dismiss(animated: true)
    }

    deinit {
        SoundManager.shared.stopAll()
        callTimer?.invalidate()
        pauseTimer?.invalidate()
        autoEndTimer?.invalidate()
    }
}
