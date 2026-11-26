import UIKit

class MainViewController: UIViewController {

    private var profile = ChildProfile.load()

    private let scrollView = UIScrollView()
    private let contentView = UIStackView()

    // Header & Hero views
    private let greetingLabel = UILabel()
    private let subGreetingLabel = UILabel()
    private let niceListBadge = UILabel()

    // Scheduled Call Countdown Banner
    private let scheduledBannerView = UIView()
    private let scheduledLabel = UILabel()
    private let cancelScheduledBtn = UIButton(type: .system)
    private var scheduledTimer: Timer?
    private var scheduledSecondsRemaining = 0

    // Android exact palette
    private let bgDark = UIColor(red: 10/255, green: 7/255, blue: 8/255, alpha: 1.0)         // #0A0708
    private let cardBg = UIColor(red: 28/255, green: 20/255, blue: 20/255, alpha: 1.0)        // #1C1414
    private let scenarioBg = UIColor(red: 30/255, green: 25/255, blue: 25/255, alpha: 1.0)    // #1E1919
    private let secondaryBtnBg = UIColor(red: 39/255, green: 25/255, blue: 25/255, alpha: 1.0)// #271919
    private let redPrimary = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1.0)   // #DC2626
    private let greenPrimary = UIColor(red: 5/255, green: 150/255, blue: 105/255, alpha: 1.0) // #059669
    private let goldAccent = UIColor(red: 251/255, green: 191/255, blue: 36/255, alpha: 1.0)  // #FBBF24
    private let creamText = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0)  // #FEF3C7
    private let amberBtnBg = UIColor(red: 180/255, green: 83/255, blue: 9/255, alpha: 1.0)    // #B45309
    private let grayBtnBg = UIColor(red: 55/255, green: 65/255, blue: 81/255, alpha: 1.0)     // #374151
    private let mintText = UIColor(red: 110/255, green: 231/255, blue: 183/255, alpha: 1.0)   // #6EE7B7

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = bgDark
        setupUI()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        profile = ChildProfile.load()
        updateProfileUI()
    }

    private func updateProfileUI() {
        greetingLabel.text = "Hello \(profile.name)! 🎅"
        subGreetingLabel.text = "Santa is eager to speak with you from the North Pole!"

        if profile.isNice {
            niceListBadge.text = "⭐ CHILD STATUS: OFFICIAL NICE LIST"
            niceListBadge.textColor = mintText
            niceListBadge.backgroundColor = UIColor(red: 6/255, green: 78/255, blue: 59/255, alpha: 1.0) // #064E3B
        } else {
            niceListBadge.text = "⚠️ CHILD STATUS: NEEDS IMPROVEMENT"
            niceListBadge.textColor = goldAccent
            niceListBadge.backgroundColor = UIColor(red: 115/255, green: 64/255, blue: 12/255, alpha: 1.0)
        }
    }

    private func setupUI() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)

        contentView.axis = .vertical
        contentView.spacing = 12
        contentView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)

        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),

            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 12),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor, constant: -40),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 16),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -16),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor, constant: -32)
        ])

        // 1. Top App Bar
        let topBar = UIStackView()
        topBar.axis = .horizontal
        topBar.distribution = .equalSpacing
        topBar.alignment = .center

        let appTitleCol = UIStackView()
        appTitleCol.axis = .vertical
        appTitleCol.spacing = 2

        let appTitle = UILabel()
        appTitle.text = "🎅 SantaCall Magic"
        appTitle.font = UIFont.boldSystemFont(ofSize: 22)
        appTitle.textColor = creamText
        appTitleCol.addArrangedSubview(appTitle)

        let weatherLabel = UILabel()
        weatherLabel.text = "North Pole: -18°C • Light Snow ❄️"
        weatherLabel.font = UIFont.systemFont(ofSize: 11)
        weatherLabel.textColor = mintText
        appTitleCol.addArrangedSubview(weatherLabel)
        topBar.addArrangedSubview(appTitleCol)

        let parentBtn = UIButton(type: .system)
        parentBtn.setTitle("🔒 Parents", for: .normal)
        parentBtn.setTitleColor(goldAccent, for: .normal)
        parentBtn.backgroundColor = secondaryBtnBg
        parentBtn.layer.cornerRadius = 8
        parentBtn.contentEdgeInsets = UIEdgeInsets(top: 8, left: 12, bottom: 8, right: 12)
        parentBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 11)
        parentBtn.addTarget(self, action: #selector(openParentSettings), for: .touchUpInside)
        topBar.addArrangedSubview(parentBtn)

        contentView.addArrangedSubview(topBar)

        // 2. Scheduled Countdown Banner (Hidden by default)
        setupScheduledBanner()
        contentView.addArrangedSubview(scheduledBannerView)

        // 3. Child Greeting Hero Card
        let heroCard = UIView()
        heroCard.backgroundColor = cardBg
        heroCard.layer.cornerRadius = 14

        let avatarView = UIImageView(image: UIImage(named: "santa_avatar") ?? UIImage(named: "Splash"))
        avatarView.contentMode = .scaleAspectFill
        avatarView.layer.cornerRadius = 28
        avatarView.clipsToBounds = true
        avatarView.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(avatarView)

        greetingLabel.font = UIFont.boldSystemFont(ofSize: 18)
        greetingLabel.textColor = creamText
        greetingLabel.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(greetingLabel)

        subGreetingLabel.font = UIFont.systemFont(ofSize: 12)
        subGreetingLabel.textColor = UIColor(red: 209/255, green: 213/255, blue: 219/255, alpha: 1.0)
        subGreetingLabel.numberOfLines = 2
        subGreetingLabel.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(subGreetingLabel)

        niceListBadge.font = UIFont.boldSystemFont(ofSize: 11)
        niceListBadge.textAlignment = .center
        niceListBadge.layer.cornerRadius = 6
        niceListBadge.clipsToBounds = true
        niceListBadge.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(niceListBadge)

        NSLayoutConstraint.activate([
            avatarView.leadingAnchor.constraint(equalTo: heroCard.leadingAnchor, constant: 16),
            avatarView.topAnchor.constraint(equalTo: heroCard.topAnchor, constant: 16),
            avatarView.widthAnchor.constraint(equalToConstant: 56),
            avatarView.heightAnchor.constraint(equalToConstant: 56),

            greetingLabel.topAnchor.constraint(equalTo: heroCard.topAnchor, constant: 18),
            greetingLabel.leadingAnchor.constraint(equalTo: avatarView.trailingAnchor, constant: 14),
            greetingLabel.trailingAnchor.constraint(equalTo: heroCard.trailingAnchor, constant: -16),

            subGreetingLabel.topAnchor.constraint(equalTo: greetingLabel.bottomAnchor, constant: 2),
            subGreetingLabel.leadingAnchor.constraint(equalTo: avatarView.trailingAnchor, constant: 14),
            subGreetingLabel.trailingAnchor.constraint(equalTo: heroCard.trailingAnchor, constant: -16),

            niceListBadge.topAnchor.constraint(equalTo: avatarView.bottomAnchor, constant: 12),
            niceListBadge.leadingAnchor.constraint(equalTo: heroCard.leadingAnchor, constant: 16),
            niceListBadge.trailingAnchor.constraint(equalTo: heroCard.trailingAnchor, constant: -16),
            niceListBadge.bottomAnchor.constraint(equalTo: heroCard.bottomAnchor, constant: -16),
            niceListBadge.heightAnchor.constraint(equalToConstant: 32),
        ])
        contentView.addArrangedSubview(heroCard)

        // 4. Section 1: Connect with Santa Claus
        contentView.setCustomSpacing(20, after: heroCard)
        contentView.addArrangedSubview(makeSectionTitle("CONNECT WITH SANTA CLAUS"))

        // Row 1: Video Call & Voice Call
        let callRow = UIStackView()
        callRow.axis = .horizontal
        callRow.spacing = 12
        callRow.distribution = .fillEqually

        let videoCallBtn = makeActionButton(
            title: "📹 Video Call\nFaceTime HD",
            bg: redPrimary,
            textColor: .white,
            height: 64,
            fontSize: 13,
            action: #selector(startVideoCall)
        )
        let voiceCallBtn = makeActionButton(
            title: "📞 Voice Call\n4-Turn Interactive",
            bg: greenPrimary,
            textColor: .white,
            height: 64,
            fontSize: 13,
            action: #selector(startVoiceCall)
        )
        callRow.addArrangedSubview(videoCallBtn)
        callRow.addArrangedSubview(voiceCallBtn)
        contentView.addArrangedSubview(callRow)

        // Row 2: Voicemail & Chat with Santa
        let messageRow = UIStackView()
        messageRow.axis = .horizontal
        messageRow.spacing = 12
        messageRow.distribution = .fillEqually

        let voicemailBtn = makeActionButton(
            title: "🎙️ Voicemail",
            bg: secondaryBtnBg,
            textColor: creamText,
            height: 56,
            fontSize: 12,
            action: #selector(openVoicemail)
        )
        let chatBtn = makeActionButton(
            title: "💬 Chat with Santa",
            bg: secondaryBtnBg,
            textColor: creamText,
            height: 56,
            fontSize: 12,
            action: #selector(openChat)
        )
        messageRow.addArrangedSubview(voicemailBtn)
        messageRow.addArrangedSubview(chatBtn)
        contentView.addArrangedSubview(messageRow)

        // Full-width Video Messages Button (matches Android)
        let videoMessagesBtn = makeActionButton(
            title: "🎬 Video Messages from Santa (Birthday, Nice List...)",
            bg: secondaryBtnBg,
            textColor: goldAccent,
            height: 56,
            fontSize: 12,
            action: #selector(openVideoMessages)
        )
        contentView.addArrangedSubview(videoMessagesBtn)

        // 5. Section 2: Special Call Scenarios (with Call Now button on right, matching Android)
        contentView.setCustomSpacing(24, after: videoMessagesBtn)
        contentView.addArrangedSubview(makeSectionTitle("SPECIAL CALL SCENARIOS"))

        let birthdayCard = makeScenarioCard(
            icon: "🎂",
            title: "Happy Birthday from North Pole",
            desc: "Santa opens his calendar with birthday wishes",
            action: #selector(startBirthdayCall)
        )
        let disciplineCard = makeScenarioCard(
            icon: "🌟",
            title: "Good Behavior & Listening",
            desc: "Santa encourages good habits to earn gifts",
            action: #selector(startDisciplineCall)
        )
        contentView.addArrangedSubview(birthdayCard)
        contentView.addArrangedSubview(disciplineCard)

        // 6. Section 3: Schedule a Surprise Call
        contentView.setCustomSpacing(20, after: disciplineCard)
        contentView.addArrangedSubview(makeSectionTitle("SCHEDULE A SURPRISE CALL"))

        let schedRow = UIStackView()
        schedRow.axis = .horizontal
        schedRow.spacing = 8
        schedRow.distribution = .fillEqually

        schedRow.addArrangedSubview(makeScheduleButton(title: "In 10 sec", seconds: 10))
        schedRow.addArrangedSubview(makeScheduleButton(title: "In 30 sec", seconds: 30))
        schedRow.addArrangedSubview(makeScheduleButton(title: "In 1 min", seconds: 60))
        contentView.addArrangedSubview(schedRow)
    }

    private func setupScheduledBanner() {
        scheduledBannerView.backgroundColor = redPrimary
        scheduledBannerView.layer.cornerRadius = 10
        scheduledBannerView.isHidden = true
        scheduledBannerView.translatesAutoresizingMaskIntoConstraints = false

        scheduledLabel.textColor = .white
        scheduledLabel.font = UIFont.boldSystemFont(ofSize: 12)
        scheduledLabel.translatesAutoresizingMaskIntoConstraints = false
        scheduledBannerView.addSubview(scheduledLabel)

        cancelScheduledBtn.setTitle("Cancel", for: .normal)
        cancelScheduledBtn.setTitleColor(.white, for: .normal)
        cancelScheduledBtn.backgroundColor = .black
        cancelScheduledBtn.layer.cornerRadius = 6
        cancelScheduledBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 10)
        cancelScheduledBtn.translatesAutoresizingMaskIntoConstraints = false
        cancelScheduledBtn.addTarget(self, action: #selector(cancelScheduledCall), for: .touchUpInside)
        scheduledBannerView.addSubview(cancelScheduledBtn)

        NSLayoutConstraint.activate([
            scheduledBannerView.heightAnchor.constraint(equalToConstant: 44),

            scheduledLabel.leadingAnchor.constraint(equalTo: scheduledBannerView.leadingAnchor, constant: 12),
            scheduledLabel.centerYAnchor.constraint(equalTo: scheduledBannerView.centerYAnchor),
            scheduledLabel.trailingAnchor.constraint(equalTo: cancelScheduledBtn.leadingAnchor, constant: -8),

            cancelScheduledBtn.trailingAnchor.constraint(equalTo: scheduledBannerView.trailingAnchor, constant: -10),
            cancelScheduledBtn.centerYAnchor.constraint(equalTo: scheduledBannerView.centerYAnchor),
            cancelScheduledBtn.widthAnchor.constraint(equalToConstant: 56),
            cancelScheduledBtn.heightAnchor.constraint(equalToConstant: 28),
        ])
    }

    private func makeSectionTitle(_ text: String) -> UILabel {
        let lbl = UILabel()
        lbl.text = text
        lbl.font = UIFont.boldSystemFont(ofSize: 12)
        lbl.textColor = goldAccent
        return lbl
    }

    private func makeActionButton(title: String, bg: UIColor, textColor: UIColor, height: CGFloat, fontSize: CGFloat, action: Selector) -> UIButton {
        let btn = UIButton(type: .system)
        btn.setTitle(title, for: .normal)
        btn.setTitleColor(textColor, for: .normal)
        btn.titleLabel?.numberOfLines = 2
        btn.titleLabel?.textAlignment = .center
        btn.titleLabel?.font = UIFont.boldSystemFont(ofSize: fontSize)
        btn.backgroundColor = bg
        btn.layer.cornerRadius = 10
        btn.heightAnchor.constraint(equalToConstant: height).isActive = true
        btn.addTarget(self, action: action, for: .touchUpInside)
        return btn
    }

    private func makeScenarioCard(icon: String, title: String, desc: String, action: Selector) -> UIView {
        let card = UIView()
        card.backgroundColor = scenarioBg
        card.layer.cornerRadius = 10
        card.translatesAutoresizingMaskIntoConstraints = false

        let iconLbl = UILabel()
        iconLbl.text = icon
        iconLbl.font = UIFont.systemFont(ofSize: 24)
        iconLbl.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(iconLbl)

        let textStack = UIStackView()
        textStack.axis = .vertical
        textStack.spacing = 2
        textStack.translatesAutoresizingMaskIntoConstraints = false

        let titleLbl = UILabel()
        titleLbl.text = title
        titleLbl.font = UIFont.boldSystemFont(ofSize: 13)
        titleLbl.textColor = creamText
        titleLbl.numberOfLines = 1
        textStack.addArrangedSubview(titleLbl)

        let descLbl = UILabel()
        descLbl.text = desc
        descLbl.font = UIFont.systemFont(ofSize: 11)
        descLbl.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1.0)
        descLbl.numberOfLines = 2
        textStack.addArrangedSubview(descLbl)

        card.addSubview(textStack)

        let callBtn = UIButton(type: .system)
        callBtn.setTitle("Call Now", for: .normal)
        callBtn.setTitleColor(.white, for: .normal)
        callBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 11)
        callBtn.backgroundColor = amberBtnBg
        callBtn.layer.cornerRadius = 8
        callBtn.contentEdgeInsets = UIEdgeInsets(top: 6, left: 12, bottom: 6, right: 12)
        callBtn.translatesAutoresizingMaskIntoConstraints = false
        callBtn.addTarget(self, action: action, for: .touchUpInside)
        card.addSubview(callBtn)

        NSLayoutConstraint.activate([
            iconLbl.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 14),
            iconLbl.centerYAnchor.constraint(equalTo: card.centerYAnchor),
            iconLbl.widthAnchor.constraint(equalToConstant: 30),

            textStack.leadingAnchor.constraint(equalTo: iconLbl.trailingAnchor, constant: 10),
            textStack.topAnchor.constraint(equalTo: card.topAnchor, constant: 14),
            textStack.bottomAnchor.constraint(equalTo: card.bottomAnchor, constant: -14),
            textStack.trailingAnchor.constraint(equalTo: callBtn.leadingAnchor, constant: -10),

            callBtn.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -14),
            callBtn.centerYAnchor.constraint(equalTo: card.centerYAnchor),
            callBtn.heightAnchor.constraint(equalToConstant: 36),
            callBtn.widthAnchor.constraint(greaterThanOrEqualToConstant: 74),
        ])

        return card
    }

    private func makeScheduleButton(title: String, seconds: Int) -> UIButton {
        let btn = UIButton(type: .system)
        btn.setTitle(title, for: .normal)
        btn.setTitleColor(UIColor(red: 229/255, green: 231/255, blue: 235/255, alpha: 1.0), for: .normal)
        btn.backgroundColor = grayBtnBg
        btn.layer.cornerRadius = 8
        btn.titleLabel?.font = UIFont.systemFont(ofSize: 11, weight: .semibold)
        btn.heightAnchor.constraint(equalToConstant: 44).isActive = true
        btn.tag = seconds
        btn.addTarget(self, action: #selector(scheduleCallTapped(_:)), for: .touchUpInside)
        return btn
    }

    // MARK: - Navigation Actions

    @objc private func startVoiceCall() {
        SoundManager.shared.triggerHaptic(style: .medium)
        let vc = IncomingCallViewController()
        vc.callType = "audio"
        vc.scenarioId = "interactive_call"
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func startVideoCall() {
        SoundManager.shared.triggerHaptic(style: .medium)
        let vc = IncomingCallViewController()
        vc.callType = "video"
        vc.scenarioId = "interactive_call"
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func openVoicemail() {
        SoundManager.shared.triggerHaptic(style: .medium)
        let vc = VoicemailViewController()
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func openChat() {
        SoundManager.shared.triggerHaptic(style: .medium)
        let vc = SantaChatViewController()
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func openVideoMessages() {
        SoundManager.shared.triggerHaptic(style: .medium)
        let vc = VideoMessagesViewController()
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func startBirthdayCall() {
        SoundManager.shared.triggerHaptic(style: .medium)
        let vc = IncomingCallViewController()
        vc.callType = "audio"
        vc.scenarioId = "happy_birthday"
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func startDisciplineCall() {
        SoundManager.shared.triggerHaptic(style: .medium)
        let vc = IncomingCallViewController()
        vc.callType = "audio"
        vc.scenarioId = "gentle_discipline"
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func openParentSettings() {
        SoundManager.shared.triggerHaptic(style: .light)
        let vc = ParentSettingsViewController()
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    // MARK: - Scheduling Actions

    @objc private func scheduleCallTapped(_ sender: UIButton) {
        scheduleIncomingCall(seconds: sender.tag)
    }

    private func scheduleIncomingCall(seconds: Int) {
        cancelScheduledCall()
        scheduledSecondsRemaining = seconds
        scheduledBannerView.isHidden = false
        updateScheduledLabel()

        scheduledTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] timer in
            guard let self = self else { return }
            self.scheduledSecondsRemaining -= 1
            if self.scheduledSecondsRemaining <= 0 {
                timer.invalidate()
                self.scheduledTimer = nil
                self.scheduledBannerView.isHidden = true
                self.startVoiceCall()
            } else {
                self.updateScheduledLabel()
            }
        }
        SoundManager.shared.triggerSuccessHaptic()
    }

    private func updateScheduledLabel() {
        scheduledLabel.text = "🎅 Santa is preparing to call... Rings in \(scheduledSecondsRemaining)s!"
    }

    @objc private func cancelScheduledCall() {
        scheduledTimer?.invalidate()
        scheduledTimer = nil
        scheduledBannerView.isHidden = true
        SoundManager.shared.triggerHaptic(style: .light)
    }

    deinit {
        scheduledTimer?.invalidate()
    }
}
