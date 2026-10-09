import UIKit

class IncomingCallViewController: UIViewController {

    var callType: String = "audio" // "audio" or "video"
    var scenarioId: String = "interactive_call"

    private let profile = ChildProfile.load()

    private let titleLabel = UILabel()
    private let callerLabel = UILabel()
    private let subtitleLabel = UILabel()
    private let avatarImageView = UIImageView()
    private let declineButton = UIButton(type: .system)
    private let acceptButton = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.04, green: 0.03, blue: 0.03, alpha: 1.0)
        setupUI()
        SoundManager.shared.startRingtone()
    }

    private func setupUI() {
        let isVi = profile.language == "vi"

        titleLabel.text = callType == "video" ? (isVi ? "FACETIME TỪ BẮC CỰC" : "FACETIME FROM NORTH POLE") : (isVi ? "CUỘC GỌI ĐẾN TỪ BẮC CỰC" : "INCOMING CALL FROM NORTH POLE")
        titleLabel.textColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0)
        titleLabel.font = UIFont.boldSystemFont(ofSize: 12)
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(titleLabel)

        callerLabel.text = isVi ? "Ông Già Noel" : "Santa Claus"
        callerLabel.textColor = .white
        callerLabel.font = UIFont.boldSystemFont(ofSize: 32)
        callerLabel.textAlignment = .center
        callerLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(callerLabel)

        subtitleLabel.text = isVi ? "🎅 Cuộc gọi dành riêng cho \(profile.name) (\(profile.age) tuổi)" : "🎅 Special call for \(profile.name) (\(profile.age) yo)"
        subtitleLabel.textColor = UIColor(red: 0.99, green: 0.9, blue: 0.54, alpha: 1.0)
        subtitleLabel.font = UIFont.systemFont(ofSize: 13)
        subtitleLabel.textAlignment = .center
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(subtitleLabel)

        avatarImageView.image = UIImage(named: "santa_avatar") ?? UIImage(named: "Splash")
        avatarImageView.contentMode = .scaleAspectFill
        avatarImageView.layer.cornerRadius = 80
        avatarImageView.clipsToBounds = true
        avatarImageView.layer.borderWidth = 4
        avatarImageView.layer.borderColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0).cgColor
        avatarImageView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(avatarImageView)

        // Decline Button (Red)
        declineButton.backgroundColor = UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0)
        declineButton.setTitle("❌", for: .normal)
        declineButton.titleLabel?.font = UIFont.systemFont(ofSize: 26)
        declineButton.layer.cornerRadius = 36
        declineButton.translatesAutoresizingMaskIntoConstraints = false
        declineButton.addTarget(self, action: #selector(declineTapped), for: .touchUpInside)
        view.addSubview(declineButton)

        // Accept Button (Green)
        acceptButton.backgroundColor = UIColor(red: 0.09, green: 0.64, blue: 0.29, alpha: 1.0)
        acceptButton.setTitle("📞", for: .normal)
        acceptButton.titleLabel?.font = UIFont.systemFont(ofSize: 26)
        acceptButton.layer.cornerRadius = 36
        acceptButton.translatesAutoresizingMaskIntoConstraints = false
        acceptButton.addTarget(self, action: #selector(acceptTapped), for: .touchUpInside)
        view.addSubview(acceptButton)

        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 40),
            titleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            callerLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            callerLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            subtitleLabel.topAnchor.constraint(equalTo: callerLabel.bottomAnchor, constant: 6),
            subtitleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            avatarImageView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            avatarImageView.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -20),
            avatarImageView.widthAnchor.constraint(equalToConstant: 160),
            avatarImageView.heightAnchor.constraint(equalToConstant: 160),

            declineButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 60),
            declineButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -50),
            declineButton.widthAnchor.constraint(equalToConstant: 72),
            declineButton.heightAnchor.constraint(equalToConstant: 72),

            acceptButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -60),
            acceptButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -50),
            acceptButton.widthAnchor.constraint(equalToConstant: 72),
            acceptButton.heightAnchor.constraint(equalToConstant: 72),
        ])
    }

    @objc private func declineTapped() {
        SoundManager.shared.stopRingtone()
        dismiss(animated: true)
    }

    @objc private func acceptTapped() {
        SoundManager.shared.stopRingtone()
        let callVC = AudioCallViewController()
        callVC.modalPresentationStyle = .fullScreen
        present(callVC, animated: true)
    }

    deinit {
        SoundManager.shared.stopRingtone()
    }
}
