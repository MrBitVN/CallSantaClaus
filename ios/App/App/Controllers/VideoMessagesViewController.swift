import UIKit
import AVKit

class VideoMessagesViewController: UIViewController {

    struct SantaVideoItem {
        let id: String
        let titleVi: String
        let titleEn: String
        let descVi: String
        let descEn: String
        let filename: String
        let thumbImage: String
    }

    private let profile = ChildProfile.load()

    private let headerView = UIView()
    private let backButton = UIButton(type: .system)
    private let titleLabel = UILabel()

    private let scrollView = UIScrollView()
    private let contentStack = UIStackView()

    private let videoItems: [SantaVideoItem] = [
        SantaVideoItem(
            id: "birthday",
            titleVi: "🎂 Chúc Mừng Sinh Nhật Bé Yêu",
            titleEn: "🎂 Santa's Happy Birthday Blessing",
            descVi: "Ông già Noel mở lịch chúc mừng sinh nhật kỳ diệu dành riêng cho bé",
            descEn: "Santa celebrates child's special birthday from his cozy study",
            filename: "video_birthday.mp4",
            thumbImage: "video_birthday"
        ),
        SantaVideoItem(
            id: "nicebook",
            titleVi: "📖 Cuốn Sổ Bé Ngoan Của Santa",
            titleEn: "📖 Santa's Golden Nice List Book",
            descVi: "Santa lật từng trang sách vàng tìm tên bé trong danh sách được tặng quà",
            descEn: "Santa looks up child's name in his grand golden book",
            filename: "video_nicebook.mp4",
            thumbImage: "video_nicebook"
        ),
        SantaVideoItem(
            id: "sleigh",
            titleVi: "🦌 Chuyến Bay Cỗ Xe Tuần Lộc",
            titleEn: "🦌 Magical Sleigh Flight Across Stars",
            descVi: "Theo chân Santa và tuần lộc Rudolph bay qua những đám mây tuyết trắng",
            descEn: "Fly alongside Santa and reindeer through the starry winter sky",
            filename: "video_sleigh.mp4",
            thumbImage: "santa_videocall"
        ),
        SantaVideoItem(
            id: "letter",
            titleVi: "✉️ Santa Đọc Thư Giáng Sinh",
            titleEn: "✉️ Santa Reading Child's Letter",
            descVi: "Santa ngồi bên lò sưởi ấm áp đọc từng dòng thư và điều ước của bé",
            descEn: "Santa by the fireplace reading letters sent from children worldwide",
            filename: "video_letter.mp4",
            thumbImage: "video_letter"
        )
    ]

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

        titleLabel.text = isVi ? "📹 Video Lời Nhắn Từ Santa" : "📹 Video Messages from Santa"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 18)
        titleLabel.textColor = UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(titleLabel)

        // ScrollView
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)

        contentStack.axis = .vertical
        contentStack.spacing = 16
        contentStack.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentStack)

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

            scrollView.topAnchor.constraint(equalTo: headerView.bottomAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),

            contentStack.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 16),
            contentStack.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor, constant: -30),
            contentStack.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 20),
            contentStack.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -20),
            contentStack.widthAnchor.constraint(equalTo: scrollView.widthAnchor, constant: -40),
        ])

        // Add Video Cards
        for item in videoItems {
            let card = makeVideoCard(for: item)
            contentStack.addArrangedSubview(card)
        }
    }

    private func makeVideoCard(for item: SantaVideoItem) -> UIView {
        let isVi = profile.language == "vi"

        let card = UIView()
        card.backgroundColor = UIColor(red: 0.12, green: 0.09, blue: 0.09, alpha: 1.0)
        card.layer.cornerRadius = 18
        card.layer.borderWidth = 1
        card.layer.borderColor = UIColor(white: 0.2, alpha: 1.0).cgColor
        card.clipsToBounds = true
        card.translatesAutoresizingMaskIntoConstraints = false

        let thumbView = UIImageView()
        thumbView.contentMode = .scaleAspectFill
        thumbView.clipsToBounds = true
        thumbView.image = UIImage(named: item.thumbImage) ?? UIImage(named: "Splash")
        thumbView.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(thumbView)

        // Dark gradient overlay on thumbnail
        let playOverlay = UIView()
        playOverlay.backgroundColor = UIColor(white: 0, alpha: 0.35)
        playOverlay.translatesAutoresizingMaskIntoConstraints = false
        thumbView.addSubview(playOverlay)

        let playIcon = UILabel()
        playIcon.text = "▶"
        playIcon.textColor = .white
        playIcon.font = UIFont.boldSystemFont(ofSize: 28)
        playIcon.translatesAutoresizingMaskIntoConstraints = false
        playOverlay.addSubview(playIcon)

        let titleLbl = UILabel()
        titleLbl.text = isVi ? item.titleVi : item.titleEn
        titleLbl.textColor = UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0)
        titleLbl.font = UIFont.boldSystemFont(ofSize: 15)
        titleLbl.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(titleLbl)

        let descLbl = UILabel()
        descLbl.text = isVi ? item.descVi : item.descEn
        descLbl.textColor = .lightGray
        descLbl.font = UIFont.systemFont(ofSize: 12)
        descLbl.numberOfLines = 2
        descLbl.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(descLbl)

        let watchBtn = UIButton(type: .system)
        watchBtn.setTitle(isVi ? "Xem Video Ngay 🎬" : "Watch Video 🎬", for: .normal)
        watchBtn.setTitleColor(.white, for: .normal)
        watchBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 13)
        watchBtn.backgroundColor = UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0)
        watchBtn.layer.cornerRadius = 12
        watchBtn.translatesAutoresizingMaskIntoConstraints = false
        watchBtn.accessibilityLabel = item.filename
        watchBtn.addTarget(self, action: #selector(playVideoTapped(_:)), for: .touchUpInside)
        card.addSubview(watchBtn)

        NSLayoutConstraint.activate([
            thumbView.topAnchor.constraint(equalTo: card.topAnchor),
            thumbView.leadingAnchor.constraint(equalTo: card.leadingAnchor),
            thumbView.trailingAnchor.constraint(equalTo: card.trailingAnchor),
            thumbView.heightAnchor.constraint(equalToConstant: 140),

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

            watchBtn.topAnchor.constraint(equalTo: descLbl.bottomAnchor, constant: 12),
            watchBtn.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 14),
            watchBtn.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -14),
            watchBtn.bottomAnchor.constraint(equalTo: card.bottomAnchor, constant: -14),
            watchBtn.heightAnchor.constraint(equalToConstant: 40),
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
