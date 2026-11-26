import UIKit
import AudioToolbox

class VoicemailViewController: UIViewController {

    private let headerView = UIView()
    private let backButton = UIButton(type: .system)
    private let titleLabel = UILabel()

    private let dialDisplayView = UIView()
    private let numberLabel = UILabel()
    private let backspaceButton = UIButton(type: .system)

    private let keypadStackView = UIStackView()
    private let recordWishButton = UIButton(type: .system)
    private let statusLabel = UILabel()

    private var dialedString = "1800-SANTA"
    private var isRecordingWish = false

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 10/255, green: 7/255, blue: 8/255, alpha: 1.0) // #0A0708
        setupUI()
    }

    private func setupUI() {
        headerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(headerView)

        backButton.setTitle("← Home", for: .normal)
        backButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 12)
        backButton.setTitleColor(UIColor(red: 229/255, green: 231/255, blue: 235/255, alpha: 1.0), for: .normal)
        backButton.backgroundColor = UIColor(red: 38/255, green: 34/255, blue: 34/255, alpha: 1.0) // #262222
        backButton.layer.cornerRadius = 8
        backButton.contentEdgeInsets = UIEdgeInsets(top: 8, left: 12, bottom: 8, right: 12)
        backButton.translatesAutoresizingMaskIntoConstraints = false
        backButton.addTarget(self, action: #selector(backTapped), for: .touchUpInside)
        headerView.addSubview(backButton)

        titleLabel.text = "North Pole Voicemail"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 17)
        titleLabel.textColor = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0) // #FEF3C7
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(titleLabel)

        // Number Display Box (#1E1919)
        dialDisplayView.backgroundColor = UIColor(red: 30/255, green: 25/255, blue: 25/255, alpha: 1.0)
        dialDisplayView.layer.cornerRadius = 10
        dialDisplayView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(dialDisplayView)

        numberLabel.text = dialedString
        numberLabel.textColor = UIColor(red: 253/255, green: 230/255, blue: 138/255, alpha: 1.0) // #FDE68A
        numberLabel.font = UIFont.monospacedDigitSystemFont(ofSize: 26, weight: .bold)
        numberLabel.textAlignment = .center
        numberLabel.translatesAutoresizingMaskIntoConstraints = false
        dialDisplayView.addSubview(numberLabel)

        backspaceButton.setTitle("⌫", for: .normal)
        backspaceButton.titleLabel?.font = UIFont.systemFont(ofSize: 20)
        backspaceButton.setTitleColor(.lightGray, for: .normal)
        backspaceButton.translatesAutoresizingMaskIntoConstraints = false
        backspaceButton.addTarget(self, action: #selector(backspaceTapped), for: .touchUpInside)
        dialDisplayView.addSubview(backspaceButton)

        // Keypad Grid (3x4)
        keypadStackView.axis = .vertical
        keypadStackView.spacing = 10
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
            rowStack.spacing = 12
            rowStack.distribution = .fillEqually

            for (num, sub) in row {
                let btn = makeKeypadButton(num: num, sub: sub)
                rowStack.addArrangedSubview(btn)
            }
            keypadStackView.addArrangedSubview(rowStack)
        }

        // Record Wish Button (#DC2626)
        recordWishButton.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1.0)
        recordWishButton.layer.cornerRadius = 10
        recordWishButton.setTitle("🎙️ Record Wish for Santa", for: .normal)
        recordWishButton.setTitleColor(.white, for: .normal)
        recordWishButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        recordWishButton.translatesAutoresizingMaskIntoConstraints = false
        recordWishButton.addTarget(self, action: #selector(toggleRecordWish), for: .touchUpInside)
        view.addSubview(recordWishButton)

        // Status Label
        statusLabel.text = "Press the keypad or tap record to send your Christmas wish directly to Santa's workshop!"
        statusLabel.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1.0) // #9CA3AF
        statusLabel.font = UIFont.systemFont(ofSize: 12)
        statusLabel.textAlignment = .center
        statusLabel.numberOfLines = 2
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(statusLabel)

        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 10),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            headerView.heightAnchor.constraint(equalToConstant: 44),

            backButton.leadingAnchor.constraint(equalTo: headerView.leadingAnchor),
            backButton.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),

            titleLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor),
            titleLabel.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),

            dialDisplayView.topAnchor.constraint(equalTo: headerView.bottomAnchor, constant: 16),
            dialDisplayView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            dialDisplayView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            dialDisplayView.heightAnchor.constraint(equalToConstant: 56),

            numberLabel.centerXAnchor.constraint(equalTo: dialDisplayView.centerXAnchor),
            numberLabel.centerYAnchor.constraint(equalTo: dialDisplayView.centerYAnchor),

            backspaceButton.trailingAnchor.constraint(equalTo: dialDisplayView.trailingAnchor, constant: -10),
            backspaceButton.centerYAnchor.constraint(equalTo: dialDisplayView.centerYAnchor),
            backspaceButton.widthAnchor.constraint(equalToConstant: 40),

            keypadStackView.topAnchor.constraint(equalTo: dialDisplayView.bottomAnchor, constant: 16),
            keypadStackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            keypadStackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            keypadStackView.heightAnchor.constraint(equalToConstant: 288),

            recordWishButton.topAnchor.constraint(equalTo: keypadStackView.bottomAnchor, constant: 20),
            recordWishButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            recordWishButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            recordWishButton.heightAnchor.constraint(equalToConstant: 54),

            statusLabel.topAnchor.constraint(equalTo: recordWishButton.bottomAnchor, constant: 10),
            statusLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            statusLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
        ])
    }

    private func makeKeypadButton(num: String, sub: String) -> UIButton {
        let btn = UIButton(type: .system)
        btn.backgroundColor = UIColor(red: 38/255, green: 34/255, blue: 34/255, alpha: 1.0) // #262222
        btn.layer.cornerRadius = 10

        let isGold = (num == "*" || num == "#")
        let numLabel = UILabel()
        numLabel.text = num
        numLabel.font = UIFont.boldSystemFont(ofSize: 20)
        numLabel.textColor = isGold ? UIColor(red: 251/255, green: 191/255, blue: 36/255, alpha: 1.0) : .white
        numLabel.textAlignment = .center
        numLabel.translatesAutoresizingMaskIntoConstraints = false
        btn.addSubview(numLabel)

        if !sub.isEmpty {
            let subLabel = UILabel()
            subLabel.text = sub
            subLabel.font = UIFont.boldSystemFont(ofSize: 10)
            subLabel.textColor = UIColor(white: 0.75, alpha: 1.0)
            subLabel.textAlignment = .center
            subLabel.translatesAutoresizingMaskIntoConstraints = false
            btn.addSubview(subLabel)

            NSLayoutConstraint.activate([
                numLabel.centerXAnchor.constraint(equalTo: btn.centerXAnchor),
                numLabel.centerYAnchor.constraint(equalTo: btn.centerYAnchor, constant: -7),
                subLabel.centerXAnchor.constraint(equalTo: btn.centerXAnchor),
                subLabel.topAnchor.constraint(equalTo: numLabel.bottomAnchor, constant: -1),
            ])
        } else {
            NSLayoutConstraint.activate([
                numLabel.centerXAnchor.constraint(equalTo: btn.centerXAnchor),
                numLabel.centerYAnchor.constraint(equalTo: btn.centerYAnchor),
            ])
        }

        btn.accessibilityLabel = num
        btn.addTarget(self, action: #selector(keypadTapped(_:)), for: .touchUpInside)
        return btn
    }

    @objc private func keypadTapped(_ sender: UIButton) {
        if let key = sender.accessibilityLabel {
            if dialedString == "1800-SANTA" {
                dialedString = ""
            }
            if dialedString.count < 14 {
                dialedString.append(key)
                numberLabel.text = dialedString
            }
            SoundManager.shared.triggerHaptic(style: .light)
            AudioServicesPlaySystemSound(1057)
        }
    }

    @objc private func backspaceTapped() {
        if !dialedString.isEmpty {
            dialedString.removeLast()
            numberLabel.text = dialedString.isEmpty ? "1800-SANTA" : dialedString
            SoundManager.shared.triggerHaptic(style: .light)
        }
    }

    @objc private func toggleRecordWish() {
        isRecordingWish.toggle()

        if isRecordingWish {
            recordWishButton.backgroundColor = UIColor(red: 5/255, green: 150/255, blue: 105/255, alpha: 1.0) // #059669
            recordWishButton.setTitle("⏹️ Recording... Tap to Send to Santa", for: .normal)
            statusLabel.text = "🎤 Speak your Christmas wish clearly into the microphone..."
            statusLabel.textColor = UIColor(red: 110/255, green: 231/255, blue: 183/255, alpha: 1.0)
            SoundManager.shared.triggerHaptic(style: .medium)
        } else {
            recordWishButton.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1.0) // #DC2626
            recordWishButton.setTitle("🎙️ Record Wish for Santa", for: .normal)
            statusLabel.text = "✨ Your wish recording has been delivered to the North Pole!"
            statusLabel.textColor = UIColor(red: 251/255, green: 191/255, blue: 36/255, alpha: 1.0)
            SoundManager.shared.triggerSuccessHaptic()
        }
    }

    @objc private func backTapped() {
        dismiss(animated: true)
    }
}
