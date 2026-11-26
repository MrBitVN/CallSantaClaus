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

    var scenarioId: String = "interactive_call"
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
    private let subtitleHeaderLabel = UILabel()
    private let subtitleLabel = UILabel()

    private let childInteractionContainer = UIStackView()
    private let promptHintLabel = UILabel()
    private let option1Button = UIButton(type: .system)
    private let option2Button = UIButton(type: .system)

    private let controlsStack = UIStackView()
    private let muteButton = UIButton(type: .system)
    private let muteLabel = UILabel()
    private let replayButton = UIButton(type: .system)
    private let subtitlesButton = UIButton(type: .system)
    private let endCallButton = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 21/255, green: 8/255, blue: 8/255, alpha: 1.0) // #150808
        setupUI()
        startCallTimer()
        startStage(.turn1Opening)
    }

    private func setupUI() {
        // Timer Label
        timerLabel.text = "00:00"
        timerLabel.textColor = UIColor(red: 224/255, green: 214/255, blue: 208/255, alpha: 1.0) // #E0D6D0
        timerLabel.font = UIFont.monospacedDigitSystemFont(ofSize: 14, weight: .bold)
        timerLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(timerLabel)

        // Status Badge
        statusBadge.text = "  ● North Pole • HD Audio  "
        statusBadge.textColor = UIColor(red: 134/255, green: 239/255, blue: 172/255, alpha: 1.0) // #86EFAC
        statusBadge.backgroundColor = UIColor(red: 27/255, green: 51/255, blue: 32/255, alpha: 1.0) // #1B3320
        statusBadge.font = UIFont.boldSystemFont(ofSize: 11)
        statusBadge.layer.cornerRadius = 8
        statusBadge.clipsToBounds = true
        statusBadge.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(statusBadge)

        // Avatar
        avatarImageView.image = UIImage(named: "santa_avatar") ?? UIImage(named: "Splash")
        avatarImageView.contentMode = .scaleAspectFill
        avatarImageView.layer.cornerRadius = 70
        avatarImageView.layer.borderWidth = 3
        avatarImageView.layer.borderColor = UIColor(red: 251/255, green: 191/255, blue: 36/255, alpha: 1.0).cgColor
        avatarImageView.clipsToBounds = true
        avatarImageView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(avatarImageView)

        // Stage Badge
        stageBadge.text = "  🎅 Santa speaking...  "
        stageBadge.font = UIFont.boldSystemFont(ofSize: 11)
        stageBadge.textColor = UIColor(red: 31/255, green: 21/255, blue: 0, alpha: 1.0)
        stageBadge.backgroundColor = UIColor(red: 245/255, green: 158/255, blue: 11/255, alpha: 1.0) // #F59E0B
        stageBadge.textAlignment = .center
        stageBadge.layer.cornerRadius = 10
        stageBadge.clipsToBounds = true
        stageBadge.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stageBadge)

        // Caller Name
        callerNameLabel.text = "Santa Claus"
        callerNameLabel.font = UIFont.boldSystemFont(ofSize: 26)
        callerNameLabel.textColor = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0) // #FEF3C7
        callerNameLabel.textAlignment = .center
        callerNameLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(callerNameLabel)

        // Child Info
        childInfoLabel.text = "Call for: \(profile.name) (\(profile.age) yo)"
        childInfoLabel.font = UIFont.systemFont(ofSize: 13)
        childInfoLabel.textColor = UIColor(red: 253/255, green: 230/255, blue: 138/255, alpha: 1.0) // #FDE68A
        childInfoLabel.textAlignment = .center
        childInfoLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(childInfoLabel)

        // Subtitle Card (#1E1919) matching Android
        subtitleCard.backgroundColor = UIColor(red: 30/255, green: 25/255, blue: 25/255, alpha: 1.0)
        subtitleCard.layer.cornerRadius = 12
        subtitleCard.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(subtitleCard)

        subtitleHeaderLabel.text = "Santa Claus:"
        subtitleHeaderLabel.textColor = UIColor(red: 251/255, green: 191/255, blue: 36/255, alpha: 1.0) // #FBBF24
        subtitleHeaderLabel.font = UIFont.boldSystemFont(ofSize: 11)
        subtitleHeaderLabel.translatesAutoresizingMaskIntoConstraints = false
        subtitleCard.addSubview(subtitleHeaderLabel)

        subtitleLabel.textColor = UIColor(red: 243/255, green: 244/255, blue: 246/255, alpha: 1.0) // #F3F4F6
        subtitleLabel.font = UIFont.systemFont(ofSize: 13)
        subtitleLabel.numberOfLines = 0
        subtitleLabel.textAlignment = .left
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        subtitleCard.addSubview(subtitleLabel)

        // Child Interaction Buttons
        childInteractionContainer.axis = .vertical
        childInteractionContainer.spacing = 8
        childInteractionContainer.alignment = .fill
        childInteractionContainer.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(childInteractionContainer)

        promptHintLabel.textColor = UIColor(red: 110/255, green: 231/255, blue: 183/255, alpha: 1.0) // #6EE7B7
        promptHintLabel.font = UIFont.boldSystemFont(ofSize: 12)
        promptHintLabel.textAlignment = .center
        childInteractionContainer.addArrangedSubview(promptHintLabel)

        let buttonsRow = UIStackView(arrangedSubviews: [option1Button, option2Button])
        buttonsRow.axis = .horizontal
        buttonsRow.spacing = 12
        buttonsRow.distribution = .fillEqually
        childInteractionContainer.addArrangedSubview(buttonsRow)

        option1Button.backgroundColor = UIColor(red: 5/255, green: 150/255, blue: 105/255, alpha: 1.0) // #059669
        option1Button.setTitleColor(.white, for: .normal)
        option1Button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 12)
        option1Button.titleLabel?.numberOfLines = 2
        option1Button.titleLabel?.textAlignment = .center
        option1Button.layer.cornerRadius = 10
        option1Button.heightAnchor.constraint(equalToConstant: 48).isActive = true
        option1Button.addTarget(self, action: #selector(childAnswerTapped), for: .touchUpInside)

        option2Button.backgroundColor = UIColor(red: 217/255, green: 119/255, blue: 6/255, alpha: 1.0) // #D97706
        option2Button.setTitleColor(.white, for: .normal)
        option2Button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 12)
        option2Button.titleLabel?.numberOfLines = 2
        option2Button.titleLabel?.textAlignment = .center
        option2Button.layer.cornerRadius = 10
        option2Button.heightAnchor.constraint(equalToConstant: 48).isActive = true
        option2Button.addTarget(self, action: #selector(childAnswerTapped), for: .touchUpInside)

        // Bottom Controls (with labels underneath matching Android)
        controlsStack.axis = .horizontal
        controlsStack.spacing = 32
        controlsStack.distribution = .equalCentering
        controlsStack.alignment = .center
        controlsStack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(controlsStack)

        controlsStack.addArrangedSubview(makeControlItem(button: muteButton, icon: "🎙️", label: muteLabel, labelText: "Mute", action: #selector(muteTapped)))
        let replayLabel = UILabel()
        controlsStack.addArrangedSubview(makeControlItem(button: replayButton, icon: "🔄", label: replayLabel, labelText: "Replay", action: #selector(replayTapped)))
        let subLabel = UILabel()
        controlsStack.addArrangedSubview(makeControlItem(button: subtitlesButton, icon: "💬", label: subLabel, labelText: "Subtitles", action: #selector(subtitlesTapped)))

        // Red End Call Button (#DC2626)
        endCallButton.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1.0)
        endCallButton.setTitle("✕", for: .normal)
        endCallButton.setTitleColor(.white, for: .normal)
        endCallButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 26)
        endCallButton.layer.cornerRadius = 34
        endCallButton.translatesAutoresizingMaskIntoConstraints = false
        endCallButton.addTarget(self, action: #selector(endCallTapped), for: .touchUpInside)
        view.addSubview(endCallButton)

        NSLayoutConstraint.activate([
            timerLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            timerLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),

            statusBadge.centerYAnchor.constraint(equalTo: timerLabel.centerYAnchor),
            statusBadge.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            statusBadge.heightAnchor.constraint(equalToConstant: 24),

            avatarImageView.topAnchor.constraint(equalTo: timerLabel.bottomAnchor, constant: 20),
            avatarImageView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            avatarImageView.widthAnchor.constraint(equalToConstant: 140),
            avatarImageView.heightAnchor.constraint(equalToConstant: 140),

            stageBadge.topAnchor.constraint(equalTo: avatarImageView.bottomAnchor, constant: -12),
            stageBadge.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stageBadge.heightAnchor.constraint(equalToConstant: 24),
            stageBadge.widthAnchor.constraint(greaterThanOrEqualToConstant: 140),

            callerNameLabel.topAnchor.constraint(equalTo: stageBadge.bottomAnchor, constant: 14),
            callerNameLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            childInfoLabel.topAnchor.constraint(equalTo: callerNameLabel.bottomAnchor, constant: 4),
            childInfoLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            subtitleCard.topAnchor.constraint(equalTo: childInfoLabel.bottomAnchor, constant: 14),
            subtitleCard.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            subtitleCard.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),

            subtitleHeaderLabel.topAnchor.constraint(equalTo: subtitleCard.topAnchor, constant: 12),
            subtitleHeaderLabel.leadingAnchor.constraint(equalTo: subtitleCard.leadingAnchor, constant: 14),
            subtitleHeaderLabel.trailingAnchor.constraint(equalTo: subtitleCard.trailingAnchor, constant: -14),

            subtitleLabel.topAnchor.constraint(equalTo: subtitleHeaderLabel.bottomAnchor, constant: 4),
            subtitleLabel.bottomAnchor.constraint(equalTo: subtitleCard.bottomAnchor, constant: -12),
            subtitleLabel.leadingAnchor.constraint(equalTo: subtitleCard.leadingAnchor, constant: 14),
            subtitleLabel.trailingAnchor.constraint(equalTo: subtitleCard.trailingAnchor, constant: -14),

            childInteractionContainer.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            childInteractionContainer.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            childInteractionContainer.bottomAnchor.constraint(equalTo: controlsStack.topAnchor, constant: -16),

            controlsStack.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            controlsStack.bottomAnchor.constraint(equalTo: endCallButton.topAnchor, constant: -22),

            endCallButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            endCallButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -24),
            endCallButton.widthAnchor.constraint(equalToConstant: 68),
            endCallButton.heightAnchor.constraint(equalToConstant: 68),
        ])
    }

    private func makeControlItem(button: UIButton, icon: String, label: UILabel, labelText: String, action: Selector) -> UIStackView {
        let stack = UIStackView()
        stack.axis = .vertical
        stack.alignment = .center
        stack.spacing = 4

        button.setTitle(icon, for: .normal)
        button.titleLabel?.font = UIFont.systemFont(ofSize: 20)
        button.backgroundColor = UIColor(red: 38/255, green: 34/255, blue: 34/255, alpha: 1.0) // #262222
        button.layer.cornerRadius = 26
        button.widthAnchor.constraint(equalToConstant: 52).isActive = true
        button.heightAnchor.constraint(equalToConstant: 52).isActive = true
        button.addTarget(self, action: action, for: .touchUpInside)

        label.text = labelText
        label.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1.0) // #9CA3AF
        label.font = UIFont.systemFont(ofSize: 11)
        label.textAlignment = .center

        stack.addArrangedSubview(button)
        stack.addArrangedSubview(label)
        return stack
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

        switch stage {
        case .turn1Opening:
            stageBadge.text = "  🎅 Santa speaking...  "
            stageBadge.backgroundColor = UIColor(red: 245/255, green: 158/255, blue: 11/255, alpha: 1.0)
            stageBadge.textColor = UIColor(red: 31/255, green: 21/255, blue: 0, alpha: 1.0)
            childInteractionContainer.isHidden = true

            if scenarioId == "happy_birthday" {
                subtitleLabel.text = "Ho ho ho! Happy Birthday, dear \(profile.name)! Santa Claus and all the reindeer at the North Pole are singing for you today! Wishing you a magical year full of joy and wonder!"
                SoundManager.shared.playAudioFile(named: "santa_scenario_birthday.mp3") { [weak self] in
                    DispatchQueue.main.async { self?.startStage(.callCompleted) }
                }
                return
            }

            if scenarioId == "gentle_discipline" {
                subtitleLabel.text = "Ho ho ho! Hello \(profile.name), this is Santa Claus calling from the North Pole. My elves told me you can be even better at listening to mommy and daddy. Promise Santa you'll try your best, and I'll keep your special gift ready!"
                SoundManager.shared.playAudioFile(named: "santa_scenario_discipline.mp3") { [weak self] in
                    DispatchQueue.main.async { self?.startStage(.callCompleted) }
                }
                return
            }

            subtitleLabel.text = "Ho ho ho! Hello there! Is that my little friend \(profile.name)? This is Santa Claus calling all the way from the snowy North Pole! Can you hear me loud and clear?"

            SoundManager.shared.playAudioFile(named: "santa_turn1_opening.mp3") { [weak self] in
                DispatchQueue.main.async {
                    self?.startStage(.pauseGreeting)
                }
            }

        case .pauseGreeting:
            stageBadge.text = "  👂 Santa listening...  "
            stageBadge.backgroundColor = UIColor(red: 5/255, green: 150/255, blue: 105/255, alpha: 1.0)
            stageBadge.textColor = .white
            SoundManager.shared.triggerHaptic()

            promptHintLabel.text = "Answer Santa Claus:"
            option1Button.setTitle("⭐ Yes, hello Santa!", for: .normal)
            option2Button.setTitle("🎅 I hear you loud!", for: .normal)
            childInteractionContainer.isHidden = false

            startPauseTimer(seconds: 5) { [weak self] in
                self?.startStage(.turn2Behavior)
            }

        case .turn2Behavior:
            stageBadge.text = "  🎅 Santa speaking...  "
            stageBadge.backgroundColor = UIColor(red: 245/255, green: 158/255, blue: 11/255, alpha: 1.0)
            stageBadge.textColor = UIColor(red: 31/255, green: 21/255, blue: 0, alpha: 1.0)
            childInteractionContainer.isHidden = true

            subtitleLabel.text = "Splendid! That is music to my ears! My big Golden Book of Good Children is open right in front of me. Tell Santa, have you been listening to mommy and daddy, finishing your meals, and being extra good this year?"

            SoundManager.shared.playAudioFile(named: "santa_turn2_gift_ask.mp3") { [weak self] in
                DispatchQueue.main.async {
                    self?.startStage(.pauseBehavior)
                }
            }

        case .pauseBehavior:
            stageBadge.text = "  👂 Santa listening...  "
            stageBadge.backgroundColor = UIColor(red: 5/255, green: 150/255, blue: 105/255, alpha: 1.0)
            stageBadge.textColor = .white
            SoundManager.shared.triggerHaptic()

            promptHintLabel.text = "Tell Santa about your year:"
            option1Button.setTitle("🌟 I've been very nice!", for: .normal)
            option2Button.setTitle("😇 Trying my very best!", for: .normal)
            childInteractionContainer.isHidden = false

            startPauseTimer(seconds: 5) { [weak self] in
                self?.startStage(.turn3Gift)
            }

        case .turn3Gift:
            stageBadge.text = "  🎅 Santa speaking...  "
            stageBadge.backgroundColor = UIColor(red: 245/255, green: 158/255, blue: 11/255, alpha: 1.0)
            stageBadge.textColor = UIColor(red: 31/255, green: 21/255, blue: 0, alpha: 1.0)
            childInteractionContainer.isHidden = true

            subtitleLabel.text = "Ho ho ho! Wonderful! Santa and the elves are so proud of you! Now tell me, my sweet child, what special gift do you wish for the most under your Christmas tree?"

            SoundManager.shared.playAudioFile(named: "santa_turn3_cookies_ask.mp3") { [weak self] in
                DispatchQueue.main.async {
                    self?.startStage(.pauseGift)
                }
            }

        case .pauseGift:
            stageBadge.text = "  👂 Santa listening for wishlist...  "
            stageBadge.backgroundColor = UIColor(red: 5/255, green: 150/255, blue: 105/255, alpha: 1.0)
            stageBadge.textColor = .white
            SoundManager.shared.triggerHaptic()

            let gift = profile.dreamGift.isEmpty ? "Lego Reindeer Sleigh" : profile.dreamGift
            promptHintLabel.text = "Tell Santa your wish:"
            option1Button.setTitle("🎁 \(gift)", for: .normal)
            option2Button.setTitle("✨ A surprise gift!", for: .normal)
            childInteractionContainer.isHidden = false

            startPauseTimer(seconds: 6) { [weak self] in
                self?.startStage(.turn4Farewell)
            }

        case .turn4Farewell:
            stageBadge.text = "  🎅 Santa speaking...  "
            stageBadge.backgroundColor = UIColor(red: 245/255, green: 158/255, blue: 11/255, alpha: 1.0)
            stageBadge.textColor = UIColor(red: 31/255, green: 21/255, blue: 0, alpha: 1.0)
            childInteractionContainer.isHidden = true

            subtitleLabel.text = "Ho ho ho! What a marvelous wish! The elves in my workshop are wrapping that golden gift right now! Remember to go to bed early on Christmas Eve, close your eyes tight, and keep spreading joy! Merry Christmas to you and your family, goodbye, Ho ho ho!"

            SoundManager.shared.playAudioFile(named: "santa_turn4_farewell.mp3") { [weak self] in
                DispatchQueue.main.async {
                    self?.startStage(.callCompleted)
                }
            }

        case .callCompleted:
            stageBadge.text = "  ✨ Call Completed • Merry Christmas  "
            stageBadge.backgroundColor = UIColor(red: 4/255, green: 120/255, blue: 87/255, alpha: 1.0)
            stageBadge.textColor = .white

            promptHintLabel.text = "Say goodbye to Santa:"
            option1Button.setTitle("💖 Thank you, bye Santa!", for: .normal)
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
            self.stageBadge.text = "  👂 Santa listening... (\(remaining)s)  "
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
        muteLabel.text = isMuted ? "Unmute" : "Mute"
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
