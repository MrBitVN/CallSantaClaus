import UIKit

class SantaChatViewController: UIViewController, UITextFieldDelegate {

    private struct ChatMessage {
        let isSanta: Bool
        let text: String
        let time: String
    }

    private let profile = ChildProfile.load()
    private var messages: [ChatMessage] = []

    private let headerView = UIView()
    private let backButton = UIButton(type: .system)
    private let titleLabel = UILabel()
    private let statusLabel = UILabel()
    private let avatarImageView = UIImageView()

    private let tableView = UITableView()
    private let quickRepliesScrollView = UIScrollView()
    private let quickRepliesStack = UIStackView()

    private let inputContainerView = UIView()
    private let messageTextField = UITextField()
    private let sendButton = UIButton(type: .system)

    private var inputBottomConstraint: NSLayoutConstraint?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.05, green: 0.04, blue: 0.04, alpha: 1.0)
        setupUI()
        setupKeyboardObservers()
        loadInitialMessages()
    }

    private func setupUI() {
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

        avatarImageView.image = UIImage(named: "santa_avatar") ?? UIImage(named: "Splash")
        avatarImageView.contentMode = .scaleAspectFill
        avatarImageView.layer.cornerRadius = 20
        avatarImageView.clipsToBounds = true
        avatarImageView.layer.borderWidth = 1.5
        avatarImageView.layer.borderColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0).cgColor
        avatarImageView.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(avatarImageView)

        let isVi = profile.language == "vi"
        titleLabel.text = isVi ? "Ông Già Noel" : "Santa Claus"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 17)
        titleLabel.textColor = UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(titleLabel)

        statusLabel.text = isVi ? "Đang trực tuyến tại Bắc Cực • Tuyết rơi" : "Online at North Pole • Snowing"
        statusLabel.font = UIFont.systemFont(ofSize: 11)
        statusLabel.textColor = UIColor(red: 0.43, green: 0.91, blue: 0.72, alpha: 1.0)
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(statusLabel)

        // TableView for messages
        tableView.backgroundColor = .clear
        tableView.separatorStyle = .none
        tableView.dataSource = self
        tableView.register(ChatBubbleCell.self, forCellReuseIdentifier: "ChatBubbleCell")
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        tableView.addGestureRecognizer(tapGesture)

        // Quick Reply Suggestions Bar
        quickRepliesScrollView.showsHorizontalScrollIndicator = false
        quickRepliesScrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(quickRepliesScrollView)

        quickRepliesStack.axis = .horizontal
        quickRepliesStack.spacing = 8
        quickRepliesStack.translatesAutoresizingMaskIntoConstraints = false
        quickRepliesScrollView.addSubview(quickRepliesStack)

        setupQuickReplies()

        // Input Container
        inputContainerView.backgroundColor = UIColor(red: 0.12, green: 0.09, blue: 0.09, alpha: 1.0)
        inputContainerView.layer.borderWidth = 1
        inputContainerView.layer.borderColor = UIColor(white: 0.2, alpha: 1.0).cgColor
        inputContainerView.layer.cornerRadius = 24
        inputContainerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(inputContainerView)

        messageTextField.placeholder = isVi ? "Nhắn gì cho Ông già Noel..." : "Type message for Santa..."
        messageTextField.textColor = .white
        messageTextField.font = UIFont.systemFont(ofSize: 15)
        messageTextField.attributedPlaceholder = NSAttributedString(
            string: isVi ? "Nhắn gì cho Ông già Noel..." : "Type message for Santa...",
            attributes: [.foregroundColor: UIColor.lightGray]
        )
        messageTextField.delegate = self
        messageTextField.returnKeyType = .send
        messageTextField.translatesAutoresizingMaskIntoConstraints = false
        inputContainerView.addSubview(messageTextField)

        sendButton.setTitle("➤", for: .normal)
        sendButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 18)
        sendButton.setTitleColor(.white, for: .normal)
        sendButton.backgroundColor = UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0)
        sendButton.layer.cornerRadius = 18
        sendButton.translatesAutoresizingMaskIntoConstraints = false
        sendButton.addTarget(self, action: #selector(sendMessageTapped), for: .touchUpInside)
        inputContainerView.addSubview(sendButton)

        inputBottomConstraint = inputContainerView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -8)

        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 60),

            backButton.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 12),
            backButton.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),
            backButton.widthAnchor.constraint(equalToConstant: 30),

            avatarImageView.leadingAnchor.constraint(equalTo: backButton.trailingAnchor, constant: 6),
            avatarImageView.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),
            avatarImageView.widthAnchor.constraint(equalToConstant: 40),
            avatarImageView.heightAnchor.constraint(equalToConstant: 40),

            titleLabel.leadingAnchor.constraint(equalTo: avatarImageView.trailingAnchor, constant: 10),
            titleLabel.topAnchor.constraint(equalTo: avatarImageView.topAnchor, constant: 2),

            statusLabel.leadingAnchor.constraint(equalTo: avatarImageView.trailingAnchor, constant: 10),
            statusLabel.bottomAnchor.constraint(equalTo: avatarImageView.bottomAnchor, constant: -2),

            tableView.topAnchor.constraint(equalTo: headerView.bottomAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: quickRepliesScrollView.topAnchor, constant: -8),

            quickRepliesScrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 12),
            quickRepliesScrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -12),
            quickRepliesScrollView.bottomAnchor.constraint(equalTo: inputContainerView.topAnchor, constant: -8),
            quickRepliesScrollView.heightAnchor.constraint(equalToConstant: 36),

            quickRepliesStack.topAnchor.constraint(equalTo: quickRepliesScrollView.topAnchor),
            quickRepliesStack.bottomAnchor.constraint(equalTo: quickRepliesScrollView.bottomAnchor),
            quickRepliesStack.leadingAnchor.constraint(equalTo: quickRepliesScrollView.leadingAnchor),
            quickRepliesStack.trailingAnchor.constraint(equalTo: quickRepliesScrollView.trailingAnchor),
            quickRepliesStack.heightAnchor.constraint(equalTo: quickRepliesScrollView.heightAnchor),

            inputContainerView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            inputContainerView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            inputContainerView.heightAnchor.constraint(equalToConstant: 48),
            inputBottomConstraint!,

            messageTextField.leadingAnchor.constraint(equalTo: inputContainerView.leadingAnchor, constant: 16),
            messageTextField.trailingAnchor.constraint(equalTo: sendButton.leadingAnchor, constant: -8),
            messageTextField.centerYAnchor.constraint(equalTo: inputContainerView.centerYAnchor),

            sendButton.trailingAnchor.constraint(equalTo: inputContainerView.trailingAnchor, constant: -6),
            sendButton.centerYAnchor.constraint(equalTo: inputContainerView.centerYAnchor),
            sendButton.widthAnchor.constraint(equalToConstant: 36),
            sendButton.heightAnchor.constraint(equalToConstant: 36),
        ])
    }

    private func setupQuickReplies() {
        let isVi = profile.language == "vi"
        let replies = isVi ? [
            "🎁 Cháu muốn xin quà!",
            "❄️ Bắc Cực có lạnh không?",
            "🦌 Tuần lộc đang làm gì?",
            "⭐ Cháu hứa nghe lời bố mẹ!",
            "🎅 Chúc Santa Giáng Sinh vui vẻ!"
        ] : [
            "🎁 I want a Christmas gift!",
            "❄️ Is the North Pole cold?",
            "🦌 How are the reindeer?",
            "⭐ I promise to be good!",
            "🎅 Merry Christmas Santa!"
        ]

        for text in replies {
            let btn = UIButton(type: .system)
            btn.setTitle(text, for: .normal)
            btn.setTitleColor(UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0), for: .normal)
            btn.backgroundColor = UIColor(red: 0.18, green: 0.13, blue: 0.13, alpha: 1.0)
            btn.layer.cornerRadius = 16
            btn.titleLabel?.font = UIFont.systemFont(ofSize: 12, weight: .medium)
            btn.contentEdgeInsets = UIEdgeInsets(top: 6, left: 14, bottom: 6, right: 14)
            btn.addTarget(self, action: #selector(quickReplyTapped(_:)), for: .touchUpInside)
            quickRepliesStack.addArrangedSubview(btn)
        }
    }

    private func loadInitialMessages() {
        let isVi = profile.language == "vi"
        let welcomeText = isVi
            ? "Ho ho ho! Chào \(profile.name) yêu quý! Ta là Ông già Noel đây! Giáng Sinh này bé có ước muốn hay tâm sự gì cứ nhắn cho Ta nhé! 🎅✨"
            : "Ho ho ho! Hello dear \(profile.name)! This is Santa Claus from the North Pole! Send me your Christmas wishes and questions! 🎅✨"

        messages.append(ChatMessage(isSanta: true, text: welcomeText, time: currentTimeString()))
        tableView.reloadData()
    }

    @objc private func quickReplyTapped(_ sender: UIButton) {
        if let title = sender.title(for: .normal) {
            sendMessage(text: title)
        }
    }

    @objc private func sendMessageTapped() {
        if let text = messageTextField.text, !text.trimmingCharacters(in: .whitespaces).isEmpty {
            sendMessage(text: text.trimmingCharacters(in: .whitespaces))
            messageTextField.text = ""
        }
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        sendMessageTapped()
        return true
    }

    private func sendMessage(text: String) {
        messages.append(ChatMessage(isSanta: false, text: text, time: currentTimeString()))
        tableView.reloadData()
        scrollToBottom()
        SoundManager.shared.triggerHaptic(style: .light)

        // Santa typing and reply after 1.2s
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) { [weak self] in
            guard let self = self else { return }
            let reply = self.generateSantaResponse(for: text)
            self.messages.append(ChatMessage(isSanta: true, text: reply, time: self.currentTimeString()))
            self.tableView.reloadData()
            self.scrollToBottom()
            SoundManager.shared.triggerSuccessHaptic()
        }
    }

    private func generateSantaResponse(for userText: String) -> String {
        let isVi = profile.language == "vi"
        let lower = userText.lowercased()

        if isVi {
            if lower.contains("quà") || lower.contains("xin") {
                return "Ho ho ho! Ta đã ghi món quà '\(profile.dreamGift)' vào cuốn sổ vàng của Ta rồi! \(profile.name) nhớ ngoan ngoãn và nghe lời bố mẹ nhé!"
            } else if lower.contains("lạnh") || lower.contains("bắc cực") {
                return "Ở Bắc Cực hiện đang là -18°C và tuyết rơi trắng xóa khắp các xưởng đồ chơi của các chú lùn elf đó bé yêu! ❄️☃️"
            } else if lower.contains("tuần lộc") || lower.contains("rudolph") {
                return "Chú tuần lộc mũi đỏ Rudolph đang ăn táo ngọt và tập bay cỗ xe để chuẩn bị bay đến tặng quà cho \(profile.name) đêm Noel này đó! 🦌✨"
            } else if lower.contains("nghe lời") || lower.contains("hứa") {
                return "Tuyệt vời lắm! Ta rất tự hào về \(profile.name)! Ta sẽ xếp bé vào vị trí danh dự trong Danh Sách Bé Ngoan Xuất Sắc nhất năm nay! ⭐🎄"
            } else {
                return "Ho ho ho! Ông già Noel nghe rõ rồi! Bé \(profile.name) nhớ ngủ sớm, ăn ngoan và luôn mỉm cười nhé, Ta luôn dõi theo bé! 🎅❤️"
            }
        } else {
            if lower.contains("gift") || lower.contains("want") || lower.contains("present") {
                return "Ho ho ho! I have noted down '\(profile.dreamGift)' in my golden ledger! Keep being good and helpful, dear \(profile.name)!"
            } else if lower.contains("cold") || lower.contains("north pole") {
                return "It is -18°C here at the North Pole and fluffy white snow is falling all over our elf workshops! ❄️☃️"
            } else if lower.contains("reindeer") || lower.contains("rudolph") {
                return "Rudolph the red-nosed reindeer is munching on sweet carrots and polishing the magic sleigh! 🦌✨"
            } else {
                return "Ho ho ho! That warms my heart! Have a wonderful magical Christmas season, \(profile.name)! 🎅✨"
            }
        }
    }

    private func scrollToBottom() {
        guard !messages.isEmpty else { return }
        let indexPath = IndexPath(row: messages.count - 1, section: 0)
        tableView.scrollToRow(at: indexPath, at: .bottom, animated: true)
    }

    private func currentTimeString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: Date())
    }

    @objc private func backTapped() {
        dismiss(animated: true)
    }

    @objc private func dismissKeyboard() {
        view.endEditing(true)
    }

    private func setupKeyboardObservers() {
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide), name: UIResponder.keyboardWillHideNotification, object: nil)
    }

    @objc private func keyboardWillShow(notification: NSNotification) {
        if let keyboardSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
            inputBottomConstraint?.constant = -keyboardSize.height + view.safeAreaInsets.bottom - 4
            UIView.animate(withDuration: 0.3) {
                self.view.layoutIfNeeded()
            }
            scrollToBottom()
        }
    }

    @objc private func keyboardWillHide(notification: NSNotification) {
        inputBottomConstraint?.constant = -8
        UIView.animate(withDuration: 0.3) {
            self.view.layoutIfNeeded()
        }
    }
}

// MARK: - UITableViewDataSource
extension SantaChatViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return messages.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ChatBubbleCell", for: indexPath) as! ChatBubbleCell
        let msg = messages[indexPath.row]
        cell.configure(message: msg.text, time: msg.time, isSanta: msg.isSanta)
        return cell
    }
}

// MARK: - ChatBubbleCell
class ChatBubbleCell: UITableViewCell {

    private let bubbleView = UIView()
    private let messageLabel = UILabel()
    private let timeLabel = UILabel()

    private var leadingConstraint: NSLayoutConstraint?
    private var trailingConstraint: NSLayoutConstraint?

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none

        bubbleView.layer.cornerRadius = 16
        bubbleView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(bubbleView)

        messageLabel.numberOfLines = 0
        messageLabel.font = UIFont.systemFont(ofSize: 14)
        messageLabel.translatesAutoresizingMaskIntoConstraints = false
        bubbleView.addSubview(messageLabel)

        timeLabel.font = UIFont.systemFont(ofSize: 10)
        timeLabel.textColor = UIColor(white: 0.8, alpha: 0.8)
        timeLabel.translatesAutoresizingMaskIntoConstraints = false
        bubbleView.addSubview(timeLabel)

        leadingConstraint = bubbleView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16)
        trailingConstraint = bubbleView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16)

        NSLayoutConstraint.activate([
            bubbleView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            bubbleView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            bubbleView.widthAnchor.constraint(lessThanOrEqualTo: contentView.widthAnchor, multiplier: 0.78),

            messageLabel.topAnchor.constraint(equalTo: bubbleView.topAnchor, constant: 10),
            messageLabel.leadingAnchor.constraint(equalTo: bubbleView.leadingAnchor, constant: 14),
            messageLabel.trailingAnchor.constraint(equalTo: bubbleView.trailingAnchor, constant: -14),

            timeLabel.topAnchor.constraint(equalTo: messageLabel.bottomAnchor, constant: 4),
            timeLabel.trailingAnchor.constraint(equalTo: bubbleView.trailingAnchor, constant: -12),
            timeLabel.bottomAnchor.constraint(equalTo: bubbleView.bottomAnchor, constant: -8)
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func configure(message: String, time: String, isSanta: Bool) {
        messageLabel.text = message
        timeLabel.text = time

        if isSanta {
            bubbleView.backgroundColor = UIColor(red: 0.18, green: 0.12, blue: 0.12, alpha: 1.0)
            bubbleView.layer.borderWidth = 1
            bubbleView.layer.borderColor = UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 0.4).cgColor
            messageLabel.textColor = UIColor(red: 0.99, green: 0.95, blue: 0.78, alpha: 1.0)
            leadingConstraint?.isActive = true
            trailingConstraint?.isActive = false
        } else {
            bubbleView.backgroundColor = UIColor(red: 0.05, green: 0.45, blue: 0.32, alpha: 1.0)
            bubbleView.layer.borderWidth = 0
            messageLabel.textColor = .white
            leadingConstraint?.isActive = false
            trailingConstraint?.isActive = true
        }
    }
}
