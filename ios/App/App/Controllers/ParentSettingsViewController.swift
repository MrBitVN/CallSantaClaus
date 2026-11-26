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
    private let niceYesButton = UIButton(type: .system)
    private let niceNoButton = UIButton(type: .system)
    private let saveButton = UIButton(type: .system)

    private var selectedIsNice = true

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 10/255, green: 7/255, blue: 8/255, alpha: 1.0) // #0A0708
        selectedIsNice = profile.isNice
        setupUI()
        let tap = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        view.addGestureRecognizer(tap)
    }

    private func setupUI() {
        // Header matching Android
        headerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(headerView)

        backButton.setTitle("← Back", for: .normal)
        backButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 12)
        backButton.setTitleColor(UIColor(red: 229/255, green: 231/255, blue: 235/255, alpha: 1.0), for: .normal)
        backButton.backgroundColor = UIColor(red: 38/255, green: 34/255, blue: 34/255, alpha: 1.0) // #262222
        backButton.layer.cornerRadius = 8
        backButton.contentEdgeInsets = UIEdgeInsets(top: 8, left: 12, bottom: 8, right: 12)
        backButton.translatesAutoresizingMaskIntoConstraints = false
        backButton.addTarget(self, action: #selector(backTapped), for: .touchUpInside)
        headerView.addSubview(backButton)

        titleLabel.text = "Parent Settings"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 18)
        titleLabel.textColor = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0) // #FEF3C7
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(titleLabel)

        // PIN Gate Card (#1E1919) matching Android
        pinGateView.backgroundColor = UIColor(red: 30/255, green: 25/255, blue: 25/255, alpha: 1.0)
        pinGateView.layer.cornerRadius = 12
        pinGateView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(pinGateView)

        pinTitleLabel.text = "🔒 Parent Verification"
        pinTitleLabel.font = UIFont.boldSystemFont(ofSize: 14)
        pinTitleLabel.textColor = UIColor(red: 251/255, green: 191/255, blue: 36/255, alpha: 1.0) // #FBBF24
        pinTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        pinGateView.addSubview(pinTitleLabel)

        pinSubLabel.text = "Enter 4-digit PIN (Default: 1225 - Christmas Eve):"
        pinSubLabel.font = UIFont.systemFont(ofSize: 12)
        pinSubLabel.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1.0)
        pinSubLabel.numberOfLines = 2
        pinSubLabel.translatesAutoresizingMaskIntoConstraints = false
        pinGateView.addSubview(pinSubLabel)

        pinTextField.attributedPlaceholder = NSAttributedString(
            string: "Enter 1225",
            attributes: [.foregroundColor: UIColor(red: 107/255, green: 114/255, blue: 128/255, alpha: 1.0)]
        )
        pinTextField.isSecureTextEntry = true
        pinTextField.keyboardType = .numberPad
        pinTextField.textColor = .white
        pinTextField.font = UIFont.boldSystemFont(ofSize: 18)
        pinTextField.backgroundColor = UIColor(red: 46/255, green: 40/255, blue: 40/255, alpha: 1.0) // #2E2828
        pinTextField.layer.cornerRadius = 8
        pinTextField.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 12, height: 48))
        pinTextField.leftViewMode = .always
        pinTextField.translatesAutoresizingMaskIntoConstraints = false
        pinGateView.addSubview(pinTextField)

        unlockButton.setTitle("Unlock Dashboard", for: .normal)
        unlockButton.setTitleColor(.white, for: .normal)
        unlockButton.backgroundColor = UIColor(red: 5/255, green: 150/255, blue: 105/255, alpha: 1.0) // #059669
        unlockButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        unlockButton.layer.cornerRadius = 8
        unlockButton.translatesAutoresizingMaskIntoConstraints = false
        unlockButton.addTarget(self, action: #selector(unlockTapped), for: .touchUpInside)
        pinGateView.addSubview(unlockButton)

        // Settings Form ScrollView
        scrollView.isHidden = true
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)

        formStack.axis = .vertical
        formStack.spacing = 12
        formStack.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(formStack)

        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 10),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            headerView.heightAnchor.constraint(equalToConstant: 44),

            backButton.leadingAnchor.constraint(equalTo: headerView.leadingAnchor),
            backButton.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),

            titleLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor),
            titleLabel.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),

            pinGateView.topAnchor.constraint(equalTo: headerView.bottomAnchor, constant: 20),
            pinGateView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            pinGateView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),

            pinTitleLabel.topAnchor.constraint(equalTo: pinGateView.topAnchor, constant: 20),
            pinTitleLabel.leadingAnchor.constraint(equalTo: pinGateView.leadingAnchor, constant: 20),
            pinTitleLabel.trailingAnchor.constraint(equalTo: pinGateView.trailingAnchor, constant: -20),

            pinSubLabel.topAnchor.constraint(equalTo: pinTitleLabel.bottomAnchor, constant: 4),
            pinSubLabel.leadingAnchor.constraint(equalTo: pinGateView.leadingAnchor, constant: 20),
            pinSubLabel.trailingAnchor.constraint(equalTo: pinGateView.trailingAnchor, constant: -20),

            pinTextField.topAnchor.constraint(equalTo: pinSubLabel.bottomAnchor, constant: 12),
            pinTextField.leadingAnchor.constraint(equalTo: pinGateView.leadingAnchor, constant: 20),
            pinTextField.trailingAnchor.constraint(equalTo: pinGateView.trailingAnchor, constant: -20),
            pinTextField.heightAnchor.constraint(equalToConstant: 48),

            unlockButton.topAnchor.constraint(equalTo: pinTextField.bottomAnchor, constant: 12),
            unlockButton.leadingAnchor.constraint(equalTo: pinGateView.leadingAnchor, constant: 20),
            unlockButton.trailingAnchor.constraint(equalTo: pinGateView.trailingAnchor, constant: -20),
            unlockButton.heightAnchor.constraint(equalToConstant: 48),
            unlockButton.bottomAnchor.constraint(equalTo: pinGateView.bottomAnchor, constant: -20),

            scrollView.topAnchor.constraint(equalTo: headerView.bottomAnchor, constant: 12),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),

            formStack.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 8),
            formStack.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor, constant: -36),
            formStack.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 20),
            formStack.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -20),
            formStack.widthAnchor.constraint(equalTo: scrollView.widthAnchor, constant: -40),
        ])

        setupFormFields()
    }

    private func setupFormFields() {
        formStack.addArrangedSubview(makeLabel(text: "Child's Name:"))
        configureTextField(nameTextField, text: profile.name, placeholder: "e.g. Leo, Emma, Noah")
        formStack.addArrangedSubview(nameTextField)

        formStack.addArrangedSubview(makeLabel(text: "Child's Age:"))
        configureTextField(ageTextField, text: "\(profile.age)", placeholder: "e.g. 5")
        ageTextField.keyboardType = .numberPad
        formStack.addArrangedSubview(ageTextField)

        formStack.addArrangedSubview(makeLabel(text: "Child's Dream Gift:"))
        configureTextField(giftTextField, text: profile.dreamGift, placeholder: "e.g. Lego Reindeer Sleigh")
        formStack.addArrangedSubview(giftTextField)

        formStack.addArrangedSubview(makeLabel(text: "Nice List Status:"))
        let niceRow = UIStackView(arrangedSubviews: [niceYesButton, niceNoButton])
        niceRow.axis = .horizontal
        niceRow.spacing = 8
        niceRow.distribution = .fillEqually

        niceYesButton.setTitle("⭐ Nice List", for: .normal)
        niceYesButton.setTitleColor(.white, for: .normal)
        niceYesButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 13)
        niceYesButton.layer.cornerRadius = 8
        niceYesButton.heightAnchor.constraint(equalToConstant: 44).isActive = true
        niceYesButton.addTarget(self, action: #selector(niceYesTapped), for: .touchUpInside)

        niceNoButton.setTitle("⚠️ Needs Work", for: .normal)
        niceNoButton.setTitleColor(.white, for: .normal)
        niceNoButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 13)
        niceNoButton.layer.cornerRadius = 8
        niceNoButton.heightAnchor.constraint(equalToConstant: 44).isActive = true
        niceNoButton.addTarget(self, action: #selector(niceNoTapped), for: .touchUpInside)

        formStack.addArrangedSubview(niceRow)
        updateNiceButtons()

        formStack.setCustomSpacing(24, after: niceRow)

        saveButton.setTitle("💾 Save Profile & Settings", for: .normal)
        saveButton.setTitleColor(.white, for: .normal)
        saveButton.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1.0) // #DC2626
        saveButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        saveButton.layer.cornerRadius = 10
        saveButton.heightAnchor.constraint(equalToConstant: 52).isActive = true
        saveButton.addTarget(self, action: #selector(saveProfileTapped), for: .touchUpInside)
        formStack.addArrangedSubview(saveButton)
    }

    private func makeLabel(text: String) -> UILabel {
        let lbl = UILabel()
        lbl.text = text
        lbl.font = UIFont.boldSystemFont(ofSize: 13)
        lbl.textColor = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0) // #FEF3C7
        return lbl
    }

    private func configureTextField(_ tf: UITextField, text: String, placeholder: String) {
        tf.text = text
        tf.attributedPlaceholder = NSAttributedString(
            string: placeholder,
            attributes: [.foregroundColor: UIColor(red: 107/255, green: 114/255, blue: 128/255, alpha: 1.0)]
        )
        tf.textColor = .white
        tf.font = UIFont.systemFont(ofSize: 14)
        tf.backgroundColor = UIColor(red: 30/255, green: 25/255, blue: 25/255, alpha: 1.0) // #1E1919
        tf.layer.cornerRadius = 8
        tf.heightAnchor.constraint(equalToConstant: 48).isActive = true
        tf.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 12, height: 48))
        tf.leftViewMode = .always
    }

    private func updateNiceButtons() {
        let inactiveBg = UIColor(red: 38/255, green: 34/255, blue: 34/255, alpha: 1.0)
        if selectedIsNice {
            niceYesButton.backgroundColor = UIColor(red: 5/255, green: 150/255, blue: 105/255, alpha: 1.0) // #059669
            niceNoButton.backgroundColor = inactiveBg
        } else {
            niceYesButton.backgroundColor = inactiveBg
            niceNoButton.backgroundColor = UIColor(red: 217/255, green: 119/255, blue: 6/255, alpha: 1.0) // #D97706
        }
    }

    @objc private func niceYesTapped() {
        selectedIsNice = true
        updateNiceButtons()
    }

    @objc private func niceNoTapped() {
        selectedIsNice = false
        updateNiceButtons()
    }

    @objc private func unlockTapped() {
        view.endEditing(true)
        let pin = pinTextField.text?.trimmingCharacters(in: .whitespaces) ?? ""
        if pin == "1225" || pin == "0000" {
            pinGateView.isHidden = true
            scrollView.isHidden = false
            SoundManager.shared.triggerSuccessHaptic()
        } else {
            SoundManager.shared.triggerHaptic(style: .heavy)
            let alert = UIAlertController(title: "Incorrect PIN", message: "Please enter the default PIN: 1225", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
        }
    }

    @objc private func saveProfileTapped() {
        view.endEditing(true)
        let trimmedName = nameTextField.text?.trimmingCharacters(in: .whitespaces) ?? ""
        let trimmedGift = giftTextField.text?.trimmingCharacters(in: .whitespaces) ?? ""

        profile.name = trimmedName.isEmpty ? "Little Star" : trimmedName
        profile.age = Int(ageTextField.text?.trimmingCharacters(in: .whitespaces) ?? "") ?? 5
        profile.dreamGift = trimmedGift.isEmpty ? "Lego Reindeer Sleigh" : trimmedGift
        profile.isNice = selectedIsNice
        profile.language = "en"
        profile.save()

        SoundManager.shared.triggerSuccessHaptic()
        let alert = UIAlertController(
            title: "Success",
            message: "Child profile saved successfully for \(profile.name)!",
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

    @objc private func dismissKeyboard() {
        view.endEditing(true)
    }
}
