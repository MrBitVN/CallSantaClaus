import UIKit

class IncomingCallViewController: UIViewController {

    var callType: String = "audio" // "audio" or "video"
    var scenarioId: String = "interactive_call"

    private let profile = ChildProfile.load()

    private let titleLabel = UILabel()
    private let callerLabel = UILabel()
    private let numberLabel = UILabel()
    private let subtitleBadge = UILabel()
    private let avatarImageView = UIImageView()
    private let declineButton = UIButton(type: .system)
    private let declineLabel = UILabel()
    private let acceptButton = UIButton(type: .system)
    private let acceptLabel = UILabel()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 21/255, green: 8/255, blue: 8/255, alpha: 1.0) // #150808
        setupUI()
        SoundManager.shared.startRingtone()
    }

    private func setupUI() {
        titleLabel.text = callType == "video" ? "FACETIME FROM NORTH POLE" : "INCOMING CALL FROM NORTH POLE"
        titleLabel.textColor = UIColor(red: 251/255, green: 191/255, blue: 36/255, alpha: 1.0) // #FBBF24
        titleLabel.font = UIFont.boldSystemFont(ofSize: 12)
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(titleLabel)

        callerLabel.text = "Santa Claus"
        callerLabel.textColor = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0) // #FEF3C7
        callerLabel.font = UIFont.boldSystemFont(ofSize: 32)
        callerLabel.textAlignment = .center
        callerLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(callerLabel)

        numberLabel.text = "+1 (225) SANTA-CLAUS"
        numberLabel.textColor = UIColor(red: 229/255, green: 231/255, blue: 235/255, alpha: 1.0) // #E5E7EB
        numberLabel.font = UIFont.systemFont(ofSize: 14)
        numberLabel.textAlignment = .center
        numberLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(numberLabel)

        subtitleBadge.text = "  🎅 Special call for \(profile.name) (\(profile.age) yo)!  "
        subtitleBadge.textColor = UIColor(red: 253/255, green: 230/255, blue: 138/255, alpha: 1.0) // #FDE68A
        subtitleBadge.backgroundColor = UIColor(red: 39/255, green: 25/255, blue: 25/255, alpha: 1.0) // #271919
        subtitleBadge.font = UIFont.boldSystemFont(ofSize: 12)
        subtitleBadge.textAlignment = .center
        subtitleBadge.layer.cornerRadius = 8
        subtitleBadge.clipsToBounds = true
        subtitleBadge.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(subtitleBadge)

        avatarImageView.image = UIImage(named: "santa_avatar") ?? UIImage(named: "Splash")
        avatarImageView.contentMode = .scaleAspectFill
        avatarImageView.layer.cornerRadius = 80
        avatarImageView.clipsToBounds = true
        avatarImageView.layer.borderWidth = 4
        avatarImageView.layer.borderColor = UIColor(red: 251/255, green: 191/255, blue: 36/255, alpha: 1.0).cgColor
        avatarImageView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(avatarImageView)

        // Decline Button (Red #DC2626) + Label
        declineButton.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1.0)
        declineButton.setTitle("✕", for: .normal)
        declineButton.setTitleColor(.white, for: .normal)
        declineButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 28)
        declineButton.layer.cornerRadius = 36
        declineButton.translatesAutoresizingMaskIntoConstraints = false
        declineButton.addTarget(self, action: #selector(declineTapped), for: .touchUpInside)
        view.addSubview(declineButton)

        declineLabel.text = "Decline"
        declineLabel.textColor = UIColor(red: 229/255, green: 231/255, blue: 235/255, alpha: 1.0)
        declineLabel.font = UIFont.boldSystemFont(ofSize: 13)
        declineLabel.textAlignment = .center
        declineLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(declineLabel)

        // Accept Button (Green #16A34A) + Label
        acceptButton.backgroundColor = UIColor(red: 22/255, green: 163/255, blue: 74/255, alpha: 1.0)
        acceptButton.setTitle("📞", for: .normal)
        acceptButton.titleLabel?.font = UIFont.systemFont(ofSize: 28)
        acceptButton.layer.cornerRadius = 36
        acceptButton.translatesAutoresizingMaskIntoConstraints = false
        acceptButton.addTarget(self, action: #selector(acceptTapped), for: .touchUpInside)
        view.addSubview(acceptButton)

        acceptLabel.text = "Accept"
        acceptLabel.textColor = UIColor(red: 134/255, green: 239/255, blue: 172/255, alpha: 1.0) // #86EFAC
        acceptLabel.font = UIFont.boldSystemFont(ofSize: 13)
        acceptLabel.textAlignment = .center
        acceptLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(acceptLabel)

        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 40),
            titleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            callerLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            callerLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            numberLabel.topAnchor.constraint(equalTo: callerLabel.bottomAnchor, constant: 4),
            numberLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            subtitleBadge.topAnchor.constraint(equalTo: numberLabel.bottomAnchor, constant: 12),
            subtitleBadge.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            subtitleBadge.heightAnchor.constraint(equalToConstant: 30),

            avatarImageView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            avatarImageView.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -10),
            avatarImageView.widthAnchor.constraint(equalToConstant: 160),
            avatarImageView.heightAnchor.constraint(equalToConstant: 160),

            declineButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 60),
            declineButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -60),
            declineButton.widthAnchor.constraint(equalToConstant: 72),
            declineButton.heightAnchor.constraint(equalToConstant: 72),

            declineLabel.topAnchor.constraint(equalTo: declineButton.bottomAnchor, constant: 8),
            declineLabel.centerXAnchor.constraint(equalTo: declineButton.centerXAnchor),

            acceptButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -60),
            acceptButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -60),
            acceptButton.widthAnchor.constraint(equalToConstant: 72),
            acceptButton.heightAnchor.constraint(equalToConstant: 72),

            acceptLabel.topAnchor.constraint(equalTo: acceptButton.bottomAnchor, constant: 8),
            acceptLabel.centerXAnchor.constraint(equalTo: acceptButton.centerXAnchor),
        ])
    }

    @objc private func declineTapped() {
        SoundManager.shared.stopRingtone()
        dismiss(animated: true)
    }

    @objc private func acceptTapped() {
        SoundManager.shared.stopRingtone()
        let presenter = self.presentingViewController
        let type = self.callType
        let scenario = self.scenarioId
        dismiss(animated: false) {
            if type == "video" {
                let videoVC = VideoCallViewController()
                videoVC.modalPresentationStyle = .fullScreen
                presenter?.present(videoVC, animated: true)
            } else {
                let callVC = AudioCallViewController()
                callVC.scenarioId = scenario
                callVC.modalPresentationStyle = .fullScreen
                presenter?.present(callVC, animated: true)
            }
        }
    }

    deinit {
        SoundManager.shared.stopRingtone()
    }
}
