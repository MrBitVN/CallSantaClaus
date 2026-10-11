import UIKit

class MainViewController: UIViewController {

    private var profile = ChildProfile.load()

    private let scrollView = UIScrollView()
    private let contentView = UIStackView()

    // Header views
    private let greetingLabel = UILabel()
    private let subGreetingLabel = UILabel()
    private let niceListBadge = UILabel()

    // Scheduled Call Countdown Banner
    private let scheduledBannerView = UIView()
    private let scheduledLabel = UILabel()
    private let cancelScheduledBtn = UIButton(type: .system)
    private var scheduledTimer: Timer?
    private var scheduledSecondsRemaining = 0

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.05, green: 0.04, blue: 0.04, alpha: 1.0)
        setupUI()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        profile = ChildProfile.load()
        updateProfileUI()
    }

    private func updateProfileUI() {
        let isVi = profile.language == "vi"
        greetingLabel.text = isVi ? "Chào \(profile.name)! 🎅" : "Hello \(profile.name)! 🎅"
        subGreetingLabel.text = isVi ? "Ông già Noel đang rất mong được nói chuyện cùng bé!" : "Santa is eager to speak with you from the North Pole!"

        if profile.isNice {
            niceListBadge.text = isVi ? "⭐ TÊN BÉ: DANH SÁCH BÉ NGOAN XUẤT SẮC" : "⭐ CHILD STATUS: OFFICIAL NICE LIST"
            niceListBadge.textColor = UIColor(red: 0.43, green: 0.91, blue: 0.72, alpha: 1.0)
            niceListBadge.backgroundColor = UIColor(red: 0.02, green: 0.31, blue: 0.23, alpha: 1.0)
        } else {
            niceListBadge.text = isVi ? "⚠️ TÊN BÉ: CẦN CỐ GẮNG THÊM ĐỂ NHẬN QUÀ" : "⚠️ CHILD STATUS: NEEDS IMPROVEMENT"
            niceListBadge.textColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0)
            niceListBadge.backgroundColor = UIColor(red: 0.45, green: 0.25, blue: 0.05, alpha: 1.0)
        }
    }

    private func setupUI() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)

        contentView.axis = .vertical
        contentView.spacing = 16
        contentView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)

        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),

            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 12),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor, constant: -40),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 18),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -18),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor, constant: -36)
        ])

        // Top App Bar
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
        appTitle.textColor = UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0)
        appTitleCol.addArrangedSubview(appTitle)

        let weatherLabel = UILabel()
        weatherLabel.text = "Bắc Cực: -18°C • Tuyết rơi nhẹ ❄️"
        weatherLabel.font = UIFont.systemFont(ofSize: 11)
        weatherLabel.textColor = UIColor(red: 0.43, green: 0.91, blue: 0.72, alpha: 1.0)
        appTitleCol.addArrangedSubview(weatherLabel)
        topBar.addArrangedSubview(appTitleCol)

        let parentBtn = UIButton(type: .system)
        parentBtn.setTitle("🔒 Phụ Huynh", for: .normal)
        parentBtn.setTitleColor(UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0), for: .normal)
        parentBtn.backgroundColor = UIColor(white: 0.15, alpha: 1.0)
        parentBtn.layer.cornerRadius = 10
        parentBtn.layer.borderWidth = 1
        parentBtn.layer.borderColor = UIColor(white: 0.25, alpha: 1.0).cgColor
        parentBtn.contentEdgeInsets = UIEdgeInsets(top: 8, left: 14, bottom: 8, right: 14)
        parentBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 12)
        parentBtn.addTarget(self, action: #selector(openParentSettings), for: .touchUpInside)
        topBar.addArrangedSubview(parentBtn)

        contentView.addArrangedSubview(topBar)

        // Scheduled Countdown Banner (Hidden by default)
        setupScheduledBanner()
        contentView.addArrangedSubview(scheduledBannerView)

        // Hero Profile Card
        let heroCard = UIView()
        heroCard.backgroundColor = UIColor(red: 0.12, green: 0.08, blue: 0.08, alpha: 1.0)
        heroCard.layer.cornerRadius = 20
        heroCard.layer.borderWidth = 1
        heroCard.layer.borderColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 0.25).cgColor

        let avatarView = UIImageView(image: UIImage(named: "santa_avatar") ?? UIImage(named: "Splash"))
        avatarView.contentMode = .scaleAspectFill
        avatarView.layer.cornerRadius = 32
        avatarView.clipsToBounds = true
        avatarView.layer.borderWidth = 2
        avatarView.layer.borderColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0).cgColor
        avatarView.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(avatarView)

        greetingLabel.font = UIFont.boldSystemFont(ofSize: 18)
        greetingLabel.textColor = .white
        greetingLabel.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(greetingLabel)

        subGreetingLabel.font = UIFont.systemFont(ofSize: 12)
        subGreetingLabel.textColor = .lightGray
        subGreetingLabel.numberOfLines = 2
        subGreetingLabel.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(subGreetingLabel)

        niceListBadge.font = UIFont.boldSystemFont(ofSize: 11)
        niceListBadge.textAlignment = .center
        niceListBadge.layer.cornerRadius = 8
        niceListBadge.clipsToBounds = true
        niceListBadge.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(niceListBadge)

        NSLayoutConstraint.activate([
            avatarView.leadingAnchor.constraint(equalTo: heroCard.leadingAnchor, constant: 14),
            avatarView.topAnchor.constraint(equalTo: heroCard.topAnchor, constant: 16),
            avatarView.widthAnchor.constraint(equalToConstant: 64),
            avatarView.heightAnchor.constraint(equalToConstant: 64),

            greetingLabel.topAnchor.constraint(equalTo: heroCard.topAnchor, constant: 16),
            greetingLabel.leadingAnchor.constraint(equalTo: avatarView.trailingAnchor, constant: 12),
            greetingLabel.trailingAnchor.constraint(equalTo: heroCard.trailingAnchor, constant: -14),

            subGreetingLabel.topAnchor.constraint(equalTo: greetingLabel.bottomAnchor, constant: 4),
            subGreetingLabel.leadingAnchor.constraint(equalTo: avatarView.trailingAnchor, constant: 12),
            subGreetingLabel.trailingAnchor.constraint(equalTo: heroCard.trailingAnchor, constant: -14),

            niceListBadge.topAnchor.constraint(equalTo: avatarView.bottomAnchor, constant: 12),
            niceListBadge.leadingAnchor.constraint(equalTo: heroCard.leadingAnchor, constant: 14),
            niceListBadge.trailingAnchor.constraint(equalTo: heroCard.trailingAnchor, constant: -14),
            niceListBadge.bottomAnchor.constraint(equalTo: heroCard.bottomAnchor, constant: -14),
            niceListBadge.heightAnchor.constraint(equalToConstant: 28),
        ])
        contentView.addArrangedSubview(heroCard)

        // Section 1: 4 Primary Actions
        let secTitle1 = makeSectionTitle("KẾT NỐI VỚI ÔNG GIÀ NOEL")
        contentView.addArrangedSubview(secTitle1)

        // Row 1: Video Call & Voice Call
        let callRow = UIStackView()
        callRow.axis = .horizontal
        callRow.spacing = 12
        callRow.distribution = .fillEqually

        let videoCallBtn = makeActionButton(
            title: "📹 Video Call\n(FaceTime HD)",
            bg: UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0),
            action: #selector(startVideoCall)
        )
        let voiceCallBtn = makeActionButton(
            title: "📞 Gọi Thoại\n(Gọi - Thưa 4 Lượt)",
            bg: UIColor(red: 0.05, green: 0.58, blue: 0.38, alpha: 1.0),
            action: #selector(startVoiceCall)
        )
        callRow.addArrangedSubview(videoCallBtn)
        callRow.addArrangedSubview(voiceCallBtn)
        contentView.addArrangedSubview(callRow)

        // Row 2: Voicemail & Santa Chat
        let messageRow = UIStackView()
        messageRow.axis = .horizontal
        messageRow.spacing = 12
        messageRow.distribution = .fillEqually

        let voicemailBtn = makeActionButton(
            title: "🎙️ Hộp Thư Thoại\n(Ghi Điều Ước)",
            bg: UIColor(red: 0.14, green: 0.10, blue: 0.10, alpha: 1.0),
            borderColor: UIColor(white: 0.25, alpha: 1.0),
            action: #selector(openVoicemail)
        )
        let chatBtn = makeActionButton(
            title: "💬 Nhắn Tin\n(Trò Chuyện Santa)",
            bg: UIColor(red: 0.14, green: 0.10, blue: 0.10, alpha: 1.0),
            borderColor: UIColor(white: 0.25, alpha: 1.0),
            action: #selector(openChat)
        )
        messageRow.addArrangedSubview(voicemailBtn)
        messageRow.addArrangedSubview(chatBtn)
        contentView.addArrangedSubview(messageRow)

        // Section 2: Video Messages
        let secTitle2 = makeSectionTitle("LỜI NHẮN VIDEO ĐẶC BIỆT")
        contentView.addArrangedSubview(secTitle2)

        let videoMessagesCard = makeFullCardButton(
            icon: "🎬",
            title: "Xem Thư Viện Video Lời Nhắn Từ Santa",
            desc: "Video sinh nhật, sổ bé ngoan & cỗ xe bay tuần lộc HD",
            action: #selector(openVideoMessages)
        )
        contentView.addArrangedSubview(videoMessagesCard)

        // Section 3: Scenario Calls
        let secTitle3 = makeSectionTitle("KỊCH BẢN CUỘC GỌI ĐẶC BIỆT")
        contentView.addArrangedSubview(secTitle3)

        let birthdayBtn = makeFullCardButton(
            icon: "🎂",
            title: "Chúc Mừng Sinh Nhật Từ Bắc Cực",
            desc: "Santa chúc mừng tuổi mới đặc biệt cho bé",
            action: #selector(startBirthdayCall)
        )
        let disciplineBtn = makeFullCardButton(
            icon: "🌟",
            title: "Nhắc Nhở Bé Ngoan & Vâng Lời",
            desc: "Santa khuyên bảo bé ngoan ngoãn nghe lời bố mẹ",
            action: #selector(startDisciplineCall)
        )
        contentView.addArrangedSubview(birthdayBtn)
        contentView.addArrangedSubview(disciplineBtn)

        // Section 4: Schedule Call
        let secTitle4 = makeSectionTitle("HẸN GIỜ ĐỔ CHUÔNG TỰ ĐỘNG")
        contentView.addArrangedSubview(secTitle4)

        let schedRow = UIStackView()
        schedRow.axis = .horizontal
        schedRow.spacing = 8
        schedRow.distribution = .fillEqually

        let btn10s = makeScheduleButton(title: "Sau 10 giây", seconds: 10)
        let btn30s = makeScheduleButton(title: "Sau 30 giây", seconds: 30)
        let btn60s = makeScheduleButton(title: "Sau 1 phút", seconds: 60)
        schedRow.addArrangedSubview(btn10s)
        schedRow.addArrangedSubview(btn30s)
        schedRow.addArrangedSubview(btn60s)
        contentView.addArrangedSubview(schedRow)
    }

    private func setupScheduledBanner() {
        scheduledBannerView.backgroundColor = UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0)
        scheduledBannerView.layer.cornerRadius = 14
        scheduledBannerView.isHidden = true
        scheduledBannerView.translatesAutoresizingMaskIntoConstraints = false

        scheduledLabel.textColor = .white
        scheduledLabel.font = UIFont.boldSystemFont(ofSize: 12)
        scheduledLabel.translatesAutoresizingMaskIntoConstraints = false
        scheduledBannerView.addSubview(scheduledLabel)

        cancelScheduledBtn.setTitle("Hủy", for: .normal)
        cancelScheduledBtn.setTitleColor(.white, for: .normal)
        cancelScheduledBtn.backgroundColor = .black
        cancelScheduledBtn.layer.cornerRadius = 8
        cancelScheduledBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 11)
        cancelScheduledBtn.translatesAutoresizingMaskIntoConstraints = false
        cancelScheduledBtn.addTarget(self, action: #selector(cancelScheduledCall), for: .touchUpInside)
        scheduledBannerView.addSubview(cancelScheduledBtn)

        NSLayoutConstraint.activate([
            scheduledBannerView.heightAnchor.constraint(equalToConstant: 44),

            scheduledLabel.leadingAnchor.constraint(equalTo: scheduledBannerView.leadingAnchor, constant: 14),
            scheduledLabel.centerYAnchor.constraint(equalTo: scheduledBannerView.centerYAnchor),
            scheduledLabel.trailingAnchor.constraint(equalTo: cancelScheduledBtn.leadingAnchor, constant: -10),

            cancelScheduledBtn.trailingAnchor.constraint(equalTo: scheduledBannerView.trailingAnchor, constant: -12),
            cancelScheduledBtn.centerYAnchor.constraint(equalTo: scheduledBannerView.centerYAnchor),
            cancelScheduledBtn.widthAnchor.constraint(equalToConstant: 54),
            cancelScheduledBtn.heightAnchor.constraint(equalToConstant: 28),
        ])
    }

    private func makeSectionTitle(_ text: String) -> UILabel {
        let lbl = UILabel()
        lbl.text = text
        lbl.font = UIFont.boldSystemFont(ofSize: 12)
        lbl.textColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0)
        return lbl
    }

    private func makeActionButton(title: String, bg: UIColor, borderColor: UIColor? = nil, action: Selector) -> UIButton {
        let btn = UIButton(type: .system)
        btn.setTitle(title, for: .normal)
        btn.setTitleColor(UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0), for: .normal)
        btn.titleLabel?.numberOfLines = 2
        btn.titleLabel?.textAlignment = .center
        btn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 13)
        btn.backgroundColor = bg
        btn.layer.cornerRadius = 16
        if let border = borderColor {
            btn.layer.borderWidth = 1
            btn.layer.borderColor = border.cgColor
        }
        btn.heightAnchor.constraint(equalToConstant: 66).isActive = true
        btn.addTarget(self, action: action, for: .touchUpInside)
        return btn
    }

    private func makeFullCardButton(icon: String, title: String, desc: String, action: Selector) -> UIButton {
        let btn = UIButton(type: .system)
        btn.backgroundColor = UIColor(red: 0.12, green: 0.09, blue: 0.09, alpha: 1.0)
        btn.layer.cornerRadius = 14
        btn.layer.borderWidth = 1
        btn.layer.borderColor = UIColor(white: 0.2, alpha: 1.0).cgColor
        btn.heightAnchor.constraint(equalToConstant: 62).isActive = true
        btn.contentHorizontalAlignment = .left
        btn.contentEdgeInsets = UIEdgeInsets(top: 8, left: 14, bottom: 8, right: 14)

        let titleStr = "\(icon)  \(title)\n     \(desc)"
        let attr = NSMutableAttributedString(string: titleStr)
        attr.addAttribute(.foregroundColor, value: UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0), range: NSRange(location: 0, length: (icon + "  " + title).count))
        attr.addAttribute(.font, value: UIFont.boldSystemFont(ofSize: 13), range: NSRange(location: 0, length: (icon + "  " + title).count))
        btn.setAttributedTitle(attr, for: .normal)
        btn.titleLabel?.numberOfLines = 2

        btn.addTarget(self, action: action, for: .touchUpInside)
        return btn
    }

    private func makeScheduleButton(title: String, seconds: Int) -> UIButton {
        let btn = UIButton(type: .system)
        btn.setTitle(title, for: .normal)
        btn.setTitleColor(UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0), for: .normal)
        btn.backgroundColor = UIColor(white: 0.14, alpha: 1.0)
        btn.layer.cornerRadius = 12
        btn.layer.borderWidth = 1
        btn.layer.borderColor = UIColor(white: 0.22, alpha: 1.0).cgColor
        btn.titleLabel?.font = UIFont.systemFont(ofSize: 12, weight: .semibold)
        btn.heightAnchor.constraint(equalToConstant: 42).isActive = true
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
        let seconds = sender.tag
        scheduleIncomingCall(seconds: seconds)
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
        let isVi = profile.language == "vi"
        scheduledLabel.text = isVi
            ? "🎅 Santa chuẩn bị gọi... Chuông reo sau \(scheduledSecondsRemaining)s!"
            : "🎅 Santa preparing to call... Rings in \(scheduledSecondsRemaining)s!"
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
