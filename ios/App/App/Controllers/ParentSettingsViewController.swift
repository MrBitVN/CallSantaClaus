import UIKit

class ParentSettingsViewController: UIViewController {

    private var profile = ChildProfile.load()

    private let headerView = UIView()
    private let backButton = UIButton(type: .system)
    private let titleLabel = UILabel()

    // PIN Gate Container
    private let pinGateView = UIView()
    private let pinTitleLabel = UILabel()
    private let pinSubLabel = UILabel()
    private let pinTextField = UITextField()
    private let unlockButton = UIButton(type: .system)

    // Form Container
    private let scrollView = UIScrollView()
    private let formStack = UIStackView()

    private let nameTextField = UITextField()
    private let ageTextField = UITextField()
    private let giftTextField = UITextField()
    private let niceListSegment = UISegmentedControl(items: ["⭐ Bé Ngoan (Nice)", "⚠️ Cần Cố Gắng"])
    private let langSegment = UISegmentedControl(items: ["🇻🇳 Tiếng Việt", "🇺🇸 English"])
    private let saveButton = UIButton(type: .system)

    private var isUnlocked = false

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.04, green: 0.03, blue: 0.03, alpha: 1.0)
        setupUI()
    }

    private func setupUI() {
        let isVi = profile.language == "vi"

        // Header
        headerView.backgroundColor = UIColor(red: 0.12, green: 0.08, blue: 0.08, alpha: 1.0)
        headerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(headerView)

        backButton.setTitle("✕", for: .normal)
        backButton.titleLabel?.font = UIFont.systemFont(ofSize: 22, weight: .bold)
        backButton.setTitleColor(.white, for: .normal)
        backButton.translatesAutoresizingMaskIntoConstraints = false
        backButton.addTarget(self, action: #selector(backTapped), for: .touchUpInside)
        headerView.addSubview(backButton)

        titleLabel.text = isVi ? "🔒 Cài Đặt Phụ Huynh" : "🔒 Parent Controls"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 18)
        titleLabel.textColor = UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(titleLabel)

        // PIN Gate View
        pinGateView.backgroundColor = UIColor(red: 0.11, green: 0.08, blue: 0.08, alpha: 1.0)
        pinGateView.layer.cornerRadius = 20
        pinGateView.layer.borderWidth = 1
        pinGateView.layer.borderColor = UIColor(white: 0.2, alpha: 1.0).cgColor
        pinGateView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(pinGateView)

        pinTitleLabel.text = isVi ? "Xác Nhận Khóa Phụ Huynh" : "Parent Security Gate"
        pinTitleLabel.font = UIFont.boldSystemFont(ofSize: 16)
        pinTitleLabel.textColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0)
        pinTitleLabel.textAlignment = .center
        pinTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        pinGateView.addSubview(pinTitleLabel)

        pinSubLabel.text = isVi ? "Nhập mã PIN để mở khóa (Mặc định: 1225)" : "Enter PIN code to unlock (Default: 1225)"
        pinSubLabel.font = UIFont.systemFont(ofSize: 12)
        pinSubLabel.textColor = .lightGray
        pinSubLabel.textAlignment = .center
        pinSubLabel.translatesAutoresizingMaskIntoConstraints = false
        pinGateView.addSubview(pinSubLabel)

        pinTextField.placeholder = "1225"
        pinTextField.isSecureTextEntry = true
        pinTextField.keyboardType = .numberPad
        pinTextField.textAlignment = .center
        pinTextField.textColor = .white
        pinTextField.font = UIFont.boldSystemFont(ofSize: 24)
        pinTextField.backgroundColor = UIColor(white: 0.18, alpha: 1.0)
        pinTextField.layer.cornerRadius = 12
        pinTextField.translatesAutoresizingMaskIntoConstraints = false
        pinGateView.addSubview(pinTextField)

        unlockButton.setTitle(isVi ? "Mở Khóa Cài Đặt" : "Unlock Settings", for: .normal)
        unlockButton.setTitleColor(.white, for: .normal)
        unlockButton.backgroundColor = UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0)
        unlockButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        unlockButton.layer.cornerRadius = 14
        unlockButton.translatesAutoresizingMaskIntoConstraints = false
        unlockButton.addTarget(self, action: #selector(unlockTapped), for: .touchUpInside)
        pinGateView.addSubview(unlockButton)

        // Settings Form ScrollView
        scrollView.isHidden = true
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)

        formStack.axis = .vertical
        formStack.spacing = 16
        formStack.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(formStack)

        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 60),

            backButton.trailingAnchor.constraint(equalTo: headerView.trailingAnchor, constant: -16),
            backButton.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),
            backButton.widthAnchor.constraint(equalToConstant: 32),

            titleLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor),
            titleLabel.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),

            // PIN Gate
            pinGateView.topAnchor.constraint(equalTo: headerView.bottomAnchor, constant: 40),
            pinGateView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            pinGateView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            pinGateView.heightAnchor.constraint(equalToConstant: 240),

            pinTitleLabel.topAnchor.constraint(equalTo: pinGateView.topAnchor, constant: 24),
            pinTitleLabel.leadingAnchor.constraint(equalTo: pinGateView.leadingAnchor, constant: 16),
            pinTitleLabel.trailingAnchor.constraint(equalTo: pinGateView.trailingAnchor, constant: -16),

            pinSubLabel.topAnchor.constraint(equalTo: pinTitleLabel.bottomAnchor, constant: 6),
            pinSubLabel.leadingAnchor.constraint(equalTo: pinGateView.leadingAnchor, constant: 16),
            pinSubLabel.trailingAnchor.constraint(equalTo: pinGateView.trailingAnchor, constant: -16),

            pinTextField.topAnchor.constraint(equalTo: pinSubLabel.bottomAnchor, constant: 16),
            pinTextField.centerXAnchor.constraint(equalTo: pinGateView.centerXAnchor),
            pinTextField.widthAnchor.constraint(equalToConstant: 160),
            pinTextField.heightAnchor.constraint(equalToConstant: 44),

            unlockButton.topAnchor.constraint(equalTo: pinTextField.bottomAnchor, constant: 20),
            unlockButton.leadingAnchor.constraint(equalTo: pinGateView.leadingAnchor, constant: 30),
            unlockButton.trailingAnchor.constraint(equalTo: pinGateView.trailingAnchor, constant: -30),
            unlockButton.heightAnchor.constraint(equalToConstant: 44),

            // ScrollView
            scrollView.topAnchor.constraint(equalTo: headerView.bottomAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),

            formStack.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 16),
            formStack.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor, constant: -30),
            formStack.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 20),
            formStack.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -20),
            formStack.widthAnchor.constraint(equalTo: scrollView.widthAnchor, constant: -40),
        ])

        setupFormFields()
    }

    private func setupFormFields() {
        let isVi = profile.language == "vi"

        // Child Name
        formStack.addArrangedSubview(makeLabel(text: isVi ? "Tên Của Bé:" : "Child's Name:"))
        configureTextField(nameTextField, text: profile.name, placeholder: "Bé Yêu")
        formStack.addArrangedSubview(nameTextField)

        // Child Age
        formStack.addArrangedSubview(makeLabel(text: isVi ? "Tuổi Của Bé:" : "Child's Age:"))
        configureTextField(ageTextField, text: "\(profile.age)", placeholder: "5")
        ageTextField.keyboardType = .numberPad
        formStack.addArrangedSubview(ageTextField)

        // Dream Gift
        formStack.addArrangedSubview(makeLabel(text: isVi ? "Món Quà Ước Mơ Của Bé:" : "Dream Gift:"))
        configureTextField(giftTextField, text: profile.dreamGift, placeholder: "Bộ lego cỗ xe tuần lộc")
        formStack.addArrangedSubview(giftTextField)

        // Nice List Toggle
        formStack.addArrangedSubview(makeLabel(text: isVi ? "Trạng Thái Bé Ngoan:" : "Nice List Status:"))
        niceListSegment.selectedSegmentIndex = profile.isNice ? 0 : 1
        niceListSegment.backgroundColor = UIColor(white: 0.15, alpha: 1.0)
        niceListSegment.selectedSegmentTintColor = UIColor(red: 0.05, green: 0.58, blue: 0.38, alpha: 1.0)
        niceListSegment.setTitleTextAttributes([.foregroundColor: UIColor.white, .font: UIFont.boldSystemFont(ofSize: 12)], for: .normal)
        formStack.addArrangedSubview(niceListSegment)

        // Language
        formStack.addArrangedSubview(makeLabel(text: isVi ? "Ngôn Ngữ Giọng Nói Của Santa:" : "Santa Voice Language:"))
        langSegment.selectedSegmentIndex = profile.language == "vi" ? 0 : 1
        langSegment.backgroundColor = UIColor(white: 0.15, alpha: 1.0)
        langSegment.selectedSegmentTintColor = UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0)
        langSegment.setTitleTextAttributes([.foregroundColor: UIColor.white, .font: UIFont.boldSystemFont(ofSize: 12)], for: .normal)
        formStack.addArrangedSubview(langSegment)

        // Save Button
        saveButton.setTitle(isVi ? "💾 Lưu Hồ Sơ Của Bé" : "💾 Save Profile", for: .normal)
        saveButton.setTitleColor(.white, for: .normal)
        saveButton.backgroundColor = UIColor(red: 0.05, green: 0.58, blue: 0.38, alpha: 1.0)
        saveButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 15)
        saveButton.layer.cornerRadius = 14
        saveButton.heightAnchor.constraint(equalToConstant: 48).isActive = true
        saveButton.addTarget(self, action: #selector(saveProfileTapped), for: .touchUpInside)
        formStack.addArrangedSubview(saveButton)
    }

    private func makeLabel(text: String) -> UILabel {
        let lbl = UILabel()
        lbl.text = text
        lbl.font = UIFont.boldSystemFont(ofSize: 13)
        lbl.textColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0)
        return lbl
    }

    private func configureTextField(_ tf: UITextField, text: String, placeholder: String) {
        tf.text = text
        tf.placeholder = placeholder
        tf.textColor = .white
        tf.font = UIFont.systemFont(ofSize: 14)
        tf.backgroundColor = UIColor(white: 0.14, alpha: 1.0)
        tf.layer.cornerRadius = 10
        tf.layer.borderWidth = 1
        tf.layer.borderColor = UIColor(white: 0.25, alpha: 1.0).cgColor
        tf.heightAnchor.constraint(equalToConstant: 44).isActive = true
        let padding = UIView(frame: CGRect(x: 0, y: 0, width: 12, height: 44))
        tf.leftView = padding
        tf.leftViewMode = .always
    }

    @objc private func unlockTapped() {
        let pin = pinTextField.text ?? ""
        if pin == "1225" || pin == "0000" || pin.isEmpty {
            isUnlocked = true
            pinGateView.isHidden = true
            scrollView.isHidden = false
            SoundManager.shared.triggerSuccessHaptic()
        } else {
            SoundManager.shared.triggerHaptic(style: .heavy)
            let alert = UIAlertController(title: "Sai mã PIN", message: "Vui lòng nhập mã mặc định là 1225", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Đồng ý", style: .default))
            present(alert, animated: true)
        }
    }

    @objc private func saveProfileTapped() {
        profile.name = nameTextField.text?.trimmingCharacters(in: .whitespaces).isEmpty == false ? nameTextField.text! : "Bé Yêu"
        profile.age = Int(ageTextField.text ?? "5") ?? 5
        profile.dreamGift = giftTextField.text?.trimmingCharacters(in: .whitespaces).isEmpty == false ? giftTextField.text! : "Bộ lego cỗ xe tuần lộc"
        profile.isNice = niceListSegment.selectedSegmentIndex == 0
        profile.language = langSegment.selectedSegmentIndex == 0 ? "vi" : "en"
        profile.save()

        SoundManager.shared.triggerSuccessHaptic()
        let isVi = profile.language == "vi"
        let alert = UIAlertController(
            title: isVi ? "Thành công" : "Success",
            message: isVi ? "Đã cập nhật hồ sơ cho bé \(profile.name)!" : "Profile updated for \(profile.name)!",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak self] _ in
            self?.dismiss(animated: true)
        }))
        present(alert, animated: true)
    }

    @objc private func backTapped() {
        dismiss(animated: true)
    }
}
