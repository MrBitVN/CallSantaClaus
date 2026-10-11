import UIKit
import AudioToolbox
import AVFoundation

class VoicemailViewController: UIViewController {

    private let profile = ChildProfile.load()

    private let headerView = UIView()
    private let backButton = UIButton(type: .system)
    private let titleLabel = UILabel()

    private let dialDisplayView = UIView()
    private let numberLabel = UILabel()
    private let backspaceButton = UIButton(type: .system)

    private let keypadStackView = UIStackView()
    private let recordWishButton = UIButton(type: .system)
    private let statusLabel = UILabel()

    private var dialedString = "1-800-SANTA"
    private var isRecordingWish = false

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

        backButton.setTitle("‹", for: .normal)
        backButton.titleLabel?.font = UIFont.systemFont(ofSize: 36, weight: .regular)
        backButton.setTitleColor(.white, for: .normal)
        backButton.translatesAutoresizingMaskIntoConstraints = false
        backButton.addTarget(self, action: #selector(backTapped), for: .touchUpInside)
        headerView.addSubview(backButton)

        titleLabel.text = isVi ? "🎙️ Hộp Thư Thoại Bắc Cực" : "🎙️ North Pole Voicemail"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 18)
        titleLabel.textColor = UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(titleLabel)

        // Number Display Box
        dialDisplayView.backgroundColor = UIColor(white: 0.1, alpha: 1.0)
        dialDisplayView.layer.cornerRadius = 16
        dialDisplayView.layer.borderWidth = 1
        dialDisplayView.layer.borderColor = UIColor(white: 0.2, alpha: 1.0).cgColor
        dialDisplayView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(dialDisplayView)

        numberLabel.text = dialedString
        numberLabel.textColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0)
        numberLabel.font = UIFont.monospacedDigitSystemFont(ofSize: 24, weight: .bold)
        numberLabel.textAlignment = .center
        numberLabel.translatesAutoresizingMaskIntoConstraints = false
        dialDisplayView.addSubview(numberLabel)

        backspaceButton.setTitle("⌫", for: .normal)
        backspaceButton.titleLabel?.font = UIFont.systemFont(ofSize: 22)
        backspaceButton.setTitleColor(.lightGray, for: .normal)
        backspaceButton.translatesAutoresizingMaskIntoConstraints = false
        backspaceButton.addTarget(self, action: #selector(backspaceTapped), for: .touchUpInside)
        dialDisplayView.addSubview(backspaceButton)

        // Keypad Grid (3x4)
        keypadStackView.axis = .vertical
        keypadStackView.spacing = 14
        keypadStackView.distribution = .fillEqually
        keypadStackView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(keypadStackView)

        let keys = [
            [("1", ""), ("2", "ABC"), ("3", "DEF")],
            [("4", "GHI"), ("5", "JKL"), ("6", "MNO")],
            [("7", "PQRS"), ("8", "TUV"), ("9", "WXYZ")],
            [("*", ""), ("0", "+"), ("#", "")]
        ]

        for row in keys {
            let rowStack = UIStackView()
            rowStack.axis = .horizontal
            rowStack.spacing = 24
            rowStack.distribution = .fillEqually

            for (num, sub) in row {
                let btn = makeKeypadButton(num: num, sub: sub)
                rowStack.addArrangedSubview(btn)
            }
            keypadStackView.addArrangedSubview(rowStack)
        }

        // Record Wish Button
        recordWishButton.backgroundColor = UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0)
        recordWishButton.layer.cornerRadius = 24
        recordWishButton.setTitle(isVi ? "🎙️ Ghi Âm Điều Ước Gửi Santa" : "🎙️ Record Christmas Wish", for: .normal)
        recordWishButton.setTitleColor(.white, for: .normal)
        recordWishButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 15)
        recordWishButton.translatesAutoresizingMaskIntoConstraints = false
        recordWishButton.addTarget(self, action: #selector(toggleRecordWish), for: .touchUpInside)
        view.addSubview(recordWishButton)

        // Status Label
        statusLabel.text = isVi ? "Bé có thể nhấn số hoặc ghi âm điều ước để gửi thẳng tới Bắc Cực" : "Press numbers or record your wish to send directly to North Pole"
        statusLabel.textColor = .lightGray
        statusLabel.font = UIFont.systemFont(ofSize: 12)
        statusLabel.textAlignment = .center
        statusLabel.numberOfLines = 2
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(statusLabel)

        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 60),

            backButton.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 12),
            backButton.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),
            backButton.widthAnchor.constraint(equalToConstant: 30),

            titleLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor),
            titleLabel.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),

            dialDisplayView.topAnchor.constraint(equalTo: headerView.bottomAnchor, constant: 16),
            dialDisplayView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            dialDisplayView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            dialDisplayView.heightAnchor.constraint(equalToConstant: 54),

            numberLabel.centerXAnchor.constraint(equalTo: dialDisplayView.centerXAnchor),
            numberLabel.centerYAnchor.constraint(equalTo: dialDisplayView.centerYAnchor),

            backspaceButton.trailingAnchor.constraint(equalTo: dialDisplayView.trailingAnchor, constant: -12),
            backspaceButton.centerYAnchor.constraint(equalTo: dialDisplayView.centerYAnchor),
            backspaceButton.widthAnchor.constraint(equalToConstant: 40),

            keypadStackView.topAnchor.constraint(equalTo: dialDisplayView.bottomAnchor, constant: 20),
            keypadStackView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            keypadStackView.widthAnchor.constraint(equalToConstant: 280),
            keypadStackView.heightAnchor.constraint(equalToConstant: 280),

            recordWishButton.topAnchor.constraint(equalTo: keypadStackView.bottomAnchor, constant: 24),
            recordWishButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 30),
            recordWishButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -30),
            recordWishButton.heightAnchor.constraint(equalToConstant: 48),

            statusLabel.topAnchor.constraint(equalTo: recordWishButton.bottomAnchor, constant: 12),
            statusLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            statusLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
        ])
    }

    private func makeKeypadButton(num: String, sub: String) -> UIButton {
        let btn = UIButton(type: .system)
        btn.backgroundColor = UIColor(white: 0.16, alpha: 1.0)
        btn.layer.cornerRadius = 30
        btn.layer.borderWidth = 1
        btn.layer.borderColor = UIColor(white: 0.28, alpha: 1.0).cgColor

        let numLabel = UILabel()
        numLabel.text = num
        numLabel.font = UIFont.systemFont(ofSize: 22, weight: .semibold)
        numLabel.textColor = .white
        numLabel.textAlignment = .center
        numLabel.translatesAutoresizingMaskIntoConstraints = false
        btn.addSubview(numLabel)

        if !sub.isEmpty {
            let subLabel = UILabel()
            subLabel.text = sub
            subLabel.font = UIFont.systemFont(ofSize: 9, weight: .bold)
            subLabel.textColor = UIColor(white: 0.7, alpha: 1.0)
            subLabel.textAlignment = .center
            subLabel.translatesAutoresizingMaskIntoConstraints = false
            btn.addSubview(subLabel)

            NSLayoutConstraint.activate([
                numLabel.centerXAnchor.constraint(equalTo: btn.centerXAnchor),
                numLabel.centerYAnchor.constraint(equalTo: btn.centerYAnchor, constant: -6),
                subLabel.centerXAnchor.constraint(equalTo: btn.centerXAnchor),
                subLabel.topAnchor.constraint(equalTo: numLabel.bottomAnchor, constant: -2),
            ])
        } else {
            NSLayoutConstraint.activate([
                numLabel.centerXAnchor.constraint(equalTo: btn.centerXAnchor),
                numLabel.centerYAnchor.constraint(equalTo: btn.centerYAnchor),
            ])
        }

        btn.tag = num.hashValue
        btn.accessibilityLabel = num
        btn.addTarget(self, action: #selector(keypadTapped(_:)), for: .touchUpInside)
        return btn
    }

    @objc private func keypadTapped(_ sender: UIButton) {
        if let key = sender.accessibilityLabel {
            if dialedString.count < 14 {
                dialedString.append(key)
                numberLabel.text = dialedString
            }
            SoundManager.shared.triggerHaptic(style: .light)
            AudioServicesPlaySystemSound(1057) // Dial sound
        }
    }

    @objc private func backspaceTapped() {
        if !dialedString.isEmpty {
            dialedString.removeLast()
            numberLabel.text = dialedString
            SoundManager.shared.triggerHaptic(style: .light)
        }
    }

    @objc private func toggleRecordWish() {
        let isVi = profile.language == "vi"
        isRecordingWish.toggle()

        if isRecordingWish {
            recordWishButton.backgroundColor = UIColor(red: 0.05, green: 0.58, blue: 0.38, alpha: 1.0)
            recordWishButton.setTitle(isVi ? "⏹️ Đang ghi âm... Nhấn để gửi" : "⏹️ Recording... Tap to Send", for: .normal)
            statusLabel.text = isVi ? "🎤 Bé hãy nói to điều ước mong muốn nhận vào micro nhé..." : "🎤 Speak your wish clearly into the microphone..."
            statusLabel.textColor = UIColor(red: 0.43, green: 0.91, blue: 0.72, alpha: 1.0)
            SoundManager.shared.triggerHaptic(style: .medium)
        } else {
            recordWishButton.backgroundColor = UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0)
            recordWishButton.setTitle(isVi ? "🎙️ Ghi Âm Điều Ước Gửi Santa" : "🎙️ Record Christmas Wish", for: .normal)
            statusLabel.text = isVi ? "✨ Điều ước của bé đã được gửi tới Bắc Cực thành công!" : "✨ Your wish was delivered to Santa at the North Pole!"
            statusLabel.textColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0)
            SoundManager.shared.triggerSuccessHaptic()
        }
    }

    @objc private func backTapped() {
        dismiss(animated: true)
    }
}
