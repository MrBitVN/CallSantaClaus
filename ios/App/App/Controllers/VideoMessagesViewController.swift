import UIKit
import AVKit

class VideoMessagesViewController: UIViewController {

    struct SantaVideoItem {
        let id: String
        let title: String
        let desc: String
        let buttonTitle: String
        let filename: String
        let thumbImage: String
    }

    private let headerView = UIView()
    private let backButton = UIButton(type: .system)
    private let titleLabel = UILabel()

    private let scrollView = UIScrollView()
    private let contentStack = UIStackView()

    private let videoItems: [SantaVideoItem] = [
        SantaVideoItem(
            id: "birthday",
            title: "🎂 Santa's Happy Birthday Blessing",
            desc: "Santa opens his North Pole calendar and sends a magical birthday wish",
            buttonTitle: "Watch Birthday Video 🎬",
            filename: "video_birthday.mp4",
            thumbImage: "video_birthday"
        ),
        SantaVideoItem(
            id: "nicebook",
            title: "📖 Santa's Golden Nice List Book",
            desc: "Santa flips through his golden book searching for your name on the Nice List",
            buttonTitle: "Watch Nice List Video 🎬",
            filename: "video_nicebook.mp4",
            thumbImage: "video_nicebook"
        ),
        SantaVideoItem(
            id: "sleigh",
            title: "🦌 Magical Sleigh Flight Across Stars",
            desc: "Fly alongside Santa and Rudolph through snowy clouds delivering gifts",
            buttonTitle: "Watch Sleigh Flight Video 🎬",
            filename: "video_sleigh.mp4",
            thumbImage: "santa_videocall"
        ),
        SantaVideoItem(
            id: "letter",
            title: "✉️ Santa Reading Christmas Letters",
            desc: "Santa sits by the cozy fireplace reading letters and wishes from children",
            buttonTitle: "Watch Reading Letter Video 🎬",
            filename: "video_letter.mp4",
            thumbImage: "video_letter"
        )
    ]

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 10/255, green: 7/255, blue: 8/255, alpha: 1.0) // #0A0708
        setupUI()
    }

    private func setupUI() {
        headerView.backgroundColor = UIColor(red: 28/255, green: 20/255, blue: 20/255, alpha: 1.0) // #1C1414
        headerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(headerView)

        backButton.setTitle("‹", for: .normal)
        backButton.titleLabel?.font = UIFont.systemFont(ofSize: 32, weight: .regular)
        backButton.setTitleColor(.white, for: .normal)
        backButton.translatesAutoresizingMaskIntoConstraints = false
        backButton.addTarget(self, action: #selector(backTapped), for: .touchUpInside)
        headerView.addSubview(backButton)

        titleLabel.text = "📹 Video Messages from Santa"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 17)
        titleLabel.textColor = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0) // #FEF3C7
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(titleLabel)

        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)

        contentStack.axis = .vertical
        contentStack.spacing = 14
        contentStack.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentStack)

        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 56),

            backButton.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 12),
            backButton.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),
            backButton.widthAnchor.constraint(equalToConstant: 36),

            titleLabel.leadingAnchor.constraint(equalTo: backButton.trailingAnchor, constant: 6),
            titleLabel.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),

            scrollView.topAnchor.constraint(equalTo: headerView.bottomAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),

            contentStack.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 16),
            contentStack.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor, constant: -30),
            contentStack.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 16),
            contentStack.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -16),
            contentStack.widthAnchor.constraint(equalTo: scrollView.widthAnchor, constant: -32)
        ])

        for item in videoItems {
            contentStack.addArrangedSubview(createVideoCard(item: item))
        }
    }

    private func createVideoCard(item: SantaVideoItem) -> UIView {
        let card = UIView()
        card.backgroundColor = UIColor(red: 28/255, green: 20/255, blue: 20/255, alpha: 1.0) // #1C1414
        card.layer.cornerRadius = 12
        card.clipsToBounds = true
        card.translatesAutoresizingMaskIntoConstraints = false

        let thumbView = UIImageView()
        thumbView.contentMode = .scaleAspectFill
        thumbView.clipsToBounds = true
        thumbView.image = UIImage(named: item.thumbImage) ?? UIImage(named: "Splash")
        thumbView.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(thumbView)

        let playOverlay = UIView()
        playOverlay.backgroundColor = UIColor(white: 0, alpha: 0.3)
        playOverlay.translatesAutoresizingMaskIntoConstraints = false
        thumbView.addSubview(playOverlay)

        let playIcon = UILabel()
        playIcon.text = "▶"
        playIcon.textColor = .white
        playIcon.font = UIFont.boldSystemFont(ofSize: 26)
        playIcon.translatesAutoresizingMaskIntoConstraints = false
        playOverlay.addSubview(playIcon)

        let titleLbl = UILabel()
        titleLbl.text = item.title
        titleLbl.textColor = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0)
        titleLbl.font = UIFont.boldSystemFont(ofSize: 15)
        titleLbl.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(titleLbl)

        let descLbl = UILabel()
        descLbl.text = item.desc
        descLbl.textColor = UIColor(red: 209/255, green: 213/255, blue: 219/255, alpha: 1.0)
        descLbl.font = UIFont.systemFont(ofSize: 12)
        descLbl.numberOfLines = 2
        descLbl.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(descLbl)

        let watchBtn = UIButton(type: .system)
        watchBtn.setTitle(item.buttonTitle, for: .normal)
        watchBtn.setTitleColor(.white, for: .normal)
        watchBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 12)
        watchBtn.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1.0) // #DC2626
        watchBtn.layer.cornerRadius = 8
        watchBtn.translatesAutoresizingMaskIntoConstraints = false
        watchBtn.accessibilityLabel = item.filename
        watchBtn.addTarget(self, action: #selector(playVideoTapped(_:)), for: .touchUpInside)
        card.addSubview(watchBtn)

        NSLayoutConstraint.activate([
            thumbView.topAnchor.constraint(equalTo: card.topAnchor),
            thumbView.leadingAnchor.constraint(equalTo: card.leadingAnchor),
            thumbView.trailingAnchor.constraint(equalTo: card.trailingAnchor),
            thumbView.heightAnchor.constraint(equalToConstant: 130),

            playOverlay.topAnchor.constraint(equalTo: thumbView.topAnchor),
            playOverlay.bottomAnchor.constraint(equalTo: thumbView.bottomAnchor),
            playOverlay.leadingAnchor.constraint(equalTo: thumbView.leadingAnchor),
            playOverlay.trailingAnchor.constraint(equalTo: thumbView.trailingAnchor),

            playIcon.centerXAnchor.constraint(equalTo: playOverlay.centerXAnchor),
            playIcon.centerYAnchor.constraint(equalTo: playOverlay.centerYAnchor),

            titleLbl.topAnchor.constraint(equalTo: thumbView.bottomAnchor, constant: 12),
            titleLbl.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 14),
            titleLbl.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -14),

            descLbl.topAnchor.constraint(equalTo: titleLbl.bottomAnchor, constant: 4),
            descLbl.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 14),
            descLbl.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -14),

            watchBtn.topAnchor.constraint(equalTo: descLbl.bottomAnchor, constant: 10),
            watchBtn.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 14),
            watchBtn.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -14),
            watchBtn.bottomAnchor.constraint(equalTo: card.bottomAnchor, constant: -14),
            watchBtn.heightAnchor.constraint(equalToConstant: 42),
        ])

        return card
    }

    @objc private func playVideoTapped(_ sender: UIButton) {
        guard let filename = sender.accessibilityLabel else { return }

        var videoUrl: URL?
        let baseName = (filename as NSString).deletingPathExtension
        let ext = (filename as NSString).pathExtension

        if let url = Bundle.main.url(forResource: baseName, withExtension: ext) {
            videoUrl = url
        } else if let url = Bundle.main.url(forResource: baseName, withExtension: ext, subdirectory: "public/videos") {
            videoUrl = url
        }

        guard let validUrl = videoUrl else {
            print("Video not found: \(filename)")
            return
        }

        SoundManager.shared.triggerHaptic(style: .medium)
        let player = AVPlayer(url: validUrl)
        let playerVC = AVPlayerViewController()
        playerVC.player = player
        present(playerVC, animated: true) {
            player.play()
        }
    }

    @objc private func backTapped() {
        dismiss(animated: true)
    }
}
