import UIKit

class MainViewController: UIViewController {

    private var profile = ChildProfile.load()

    private let scrollView = UIScrollView()
    private let contentView = UIStackView()

    private let greetingLabel = UILabel()
    private let subGreetingLabel = UILabel()
    private let niceListBadge = UILabel()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.04, green: 0.03, blue: 0.03, alpha: 1.0)
        setupUI()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        profile = ChildProfile.load()
        updateProfileUI()
    }

    private func updateProfileUI() {
        greetingLabel.text = "Chào \(profile.name)! 🎅"
        niceListBadge.text = profile.isNice ? "⭐ Tên bé: DANH SÁCH BÉ NGOAN XUẤT SẮC" : "⚠️ CẦN CỐ GẮNG THÊM ĐỂ NHẬN QUÀ"
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

            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 16),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor, constant: -30),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 20),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -20),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor, constant: -40)
        ])

        // Top Title Row
        let topRow = UIStackView()
        topRow.axis = .horizontal
        topRow.distribution = .equalSpacing

        let titleLabel = UILabel()
        titleLabel.text = "🎅 SantaCall Magic"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 22)
        titleLabel.textColor = UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0)
        topRow.addArrangedSubview(titleLabel)

        let parentBtn = UIButton(type: .system)
        parentBtn.setTitle("🔒 Phụ Huynh", for: .normal)
        parentBtn.setTitleColor(UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0), for: .normal)
        parentBtn.backgroundColor = UIColor(white: 0.15, alpha: 1.0)
        parentBtn.layer.cornerRadius = 8
        parentBtn.contentEdgeInsets = UIEdgeInsets(top: 6, left: 12, bottom: 6, right: 12)
        parentBtn.addTarget(self, action: #selector(openParentSettings), for: .touchUpInside)
        topRow.addArrangedSubview(parentBtn)

        contentView.addArrangedSubview(topRow)

        // Hero Card
        let heroCard = UIView()
        heroCard.backgroundColor = UIColor(red: 0.11, green: 0.08, blue: 0.08, alpha: 1.0)
        heroCard.layer.cornerRadius = 20
        heroCard.translatesAutoresizingMaskIntoConstraints = false

        greetingLabel.font = UIFont.boldSystemFont(ofSize: 18)
        greetingLabel.textColor = .white
        greetingLabel.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(greetingLabel)

        subGreetingLabel.text = "Ông già Noel đang rất muốn gọi điện thoại cho bé!"
        subGreetingLabel.font = UIFont.systemFont(ofSize: 12)
        subGreetingLabel.textColor = .lightGray
        subGreetingLabel.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(subGreetingLabel)

        niceListBadge.font = UIFont.boldSystemFont(ofSize: 11)
        niceListBadge.textColor = UIColor(red: 0.43, green: 0.91, blue: 0.72, alpha: 1.0)
        niceListBadge.backgroundColor = UIColor(red: 0.02, green: 0.31, blue: 0.23, alpha: 1.0)
        niceListBadge.textAlignment = .center
        niceListBadge.layer.cornerRadius = 8
        niceListBadge.clipsToBounds = true
        niceListBadge.translatesAutoresizingMaskIntoConstraints = false
        heroCard.addSubview(niceListBadge)

        NSLayoutConstraint.activate([
            greetingLabel.topAnchor.constraint(equalTo: heroCard.topAnchor, constant: 16),
            greetingLabel.leadingAnchor.constraint(equalTo: heroCard.leadingAnchor, constant: 16),
            greetingLabel.trailingAnchor.constraint(equalTo: heroCard.trailingAnchor, constant: -16),

            subGreetingLabel.topAnchor.constraint(equalTo: greetingLabel.bottomAnchor, constant: 4),
            subGreetingLabel.leadingAnchor.constraint(equalTo: heroCard.leadingAnchor, constant: 16),
            subGreetingLabel.trailingAnchor.constraint(equalTo: heroCard.trailingAnchor, constant: -16),

            niceListBadge.topAnchor.constraint(equalTo: subGreetingLabel.bottomAnchor, constant: 12),
            niceListBadge.leadingAnchor.constraint(equalTo: heroCard.leadingAnchor, constant: 16),
            niceListBadge.trailingAnchor.constraint(equalTo: heroCard.trailingAnchor, constant: -16),
            niceListBadge.bottomAnchor.constraint(equalTo: heroCard.bottomAnchor, constant: -16),
            niceListBadge.heightAnchor.constraint(equalToConstant: 28),
        ])

        contentView.addArrangedSubview(heroCard)

        // Section Title
        let actionTitle = UILabel()
        actionTitle.text = "KẾT NỐI VỚI ÔNG GIÀ NOEL"
        actionTitle.font = UIFont.boldSystemFont(ofSize: 12)
        actionTitle.textColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0)
        contentView.addArrangedSubview(actionTitle)

        // 2 Primary Call Buttons
        let callRow = UIStackView()
        callRow.axis = .horizontal
        callRow.spacing = 12
        callRow.distribution = .fillEqually

        let voiceCallBtn = makeButton(title: "📞 Gọi Thoại\n(Gọi - Thưa 4 Lượt)", bg: UIColor(red: 0.02, green: 0.59, blue: 0.41, alpha: 1.0), action: #selector(startVoiceCall))
        let videoCallBtn = makeButton(title: "📹 Video Call\n(FaceTime HD)", bg: UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0), action: #selector(startVideoCall))

        callRow.addArrangedSubview(voiceCallBtn)
        callRow.addArrangedSubview(videoCallBtn)
        contentView.addArrangedSubview(callRow)

        // Scenarios
        let scenarioTitle = UILabel()
        scenarioTitle.text = "KỊCH BẢN CUỘC GỌI ĐẶC BIỆT"
        scenarioTitle.font = UIFont.boldSystemFont(ofSize: 12)
        scenarioTitle.textColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0)
        contentView.addArrangedSubview(scenarioTitle)

        let birthdayBtn = makeCardButton(icon: "🎂", title: "Chúc Mừng Sinh Nhật", desc: "Santa chúc mừng tuổi mới cho bé", action: #selector(startBirthdayCall))
        let disciplineBtn = makeCardButton(icon: "🌟", title: "Nhắc Nhở Bé Ngoan", desc: "Santa khuyên bảo bé nghe lời bố mẹ", action: #selector(startDisciplineCall))

        contentView.addArrangedSubview(birthdayBtn)
        contentView.addArrangedSubview(disciplineBtn)
    }

    private func makeButton(title: String, bg: UIColor, action: Selector) -> UIButton {
        let btn = UIButton(type: .system)
        btn.setTitle(title, for: .normal)
        btn.setTitleColor(.white, for: .normal)
        btn.titleLabel?.numberOfLines = 2
        btn.titleLabel?.textAlignment = .center
        btn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 13)
        btn.backgroundColor = bg
        btn.layer.cornerRadius = 16
        btn.heightAnchor.constraint(equalToConstant: 64).isActive = true
        btn.addTarget(self, action: action, for: .touchUpInside)
        return btn
    }

    private func makeCardButton(icon: String, title: String, desc: String, action: Selector) -> UIButton {
        let btn = UIButton(type: .system)
        btn.backgroundColor = UIColor(red: 0.12, green: 0.1, blue: 0.1, alpha: 1.0)
        btn.layer.cornerRadius = 14
        btn.heightAnchor.constraint(equalToConstant: 60).isActive = true
        btn.contentHorizontalAlignment = .left
        btn.contentEdgeInsets = UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
        btn.setTitle("\(icon)  \(title) — \(desc)", for: .normal)
        btn.setTitleColor(UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0), for: .normal)
        btn.titleLabel?.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        btn.addTarget(self, action: action, for: .touchUpInside)
        return btn
    }

    @objc private func startVoiceCall() {
        let vc = IncomingCallViewController()
        vc.callType = "audio"
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func startVideoCall() {
        let vc = IncomingCallViewController()
        vc.callType = "video"
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func startBirthdayCall() {
        let vc = IncomingCallViewController()
        vc.callType = "audio"
        vc.scenarioId = "happy_birthday"
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func startDisciplineCall() {
        let vc = IncomingCallViewController()
        vc.callType = "audio"
        vc.scenarioId = "gentle_discipline"
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }

    @objc private func openParentSettings() {
        let alert = UIAlertController(title: "Khóa Phụ Huynh", message: "Nhập mã PIN (Mặc định: 1225)", preferredStyle: .alert)
        alert.addTextField { tf in
            tf.placeholder = "1225"
            tf.keyboardType = .numberPad
            tf.isSecureTextEntry = true
        }
        alert.addAction(UIAlertAction(title: "Hủy", style: .cancel))
        alert.addAction(UIAlertAction(title: "Mở khóa", style: .default, handler: { [weak self] _ in
            let pin = alert.textFields?.first?.text ?? ""
            if pin == "1225" || pin == "0000" {
                self?.showProfileEditAlert()
            }
        }))
        present(alert, animated: true)
    }

    private func showProfileEditAlert() {
        let alert = UIAlertController(title: "Hồ Sơ Của Bé", message: "Đổi tên và món quà mong ước:", preferredStyle: .alert)
        alert.addTextField { [weak self] tf in
            tf.text = self?.profile.name
            tf.placeholder = "Tên của bé"
        }
        alert.addTextField { [weak self] tf in
            tf.text = self?.profile.dreamGift
            tf.placeholder = "Món quà ước mơ"
        }
        alert.addAction(UIAlertAction(title: "Lưu", style: .default, handler: { [weak self] _ in
            guard let self = self else { return }
            self.profile.name = alert.textFields?[0].text ?? "Bé Yêu"
            self.profile.dreamGift = alert.textFields?[1].text ?? "Lego"
            self.profile.save()
            self.updateProfileUI()
        }))
        alert.addAction(UIAlertAction(title: "Đóng", style: .cancel))
        present(alert, animated: true)
    }
}
