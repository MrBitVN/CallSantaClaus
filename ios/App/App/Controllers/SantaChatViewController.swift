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

    private let tableView = UITableView()
    private let quickRepliesScrollView = UIScrollView()
    private let quickRepliesStack = UIStackView()

    private let inputContainerView = UIView()
    private let messageTextField = UITextField()
    private let sendButton = UIButton(type: .system)

    private var inputBottomConstraint: NSLayoutConstraint?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 10/255, green: 7/255, blue: 8/255, alpha: 1.0) // #0A0708
        setupUI()
        setupKeyboardObservers()
        loadInitialMessages()
    }

    private func setupUI() {
        // Header (#1C1414) matching Android
        headerView.backgroundColor = UIColor(red: 28/255, green: 20/255, blue: 20/255, alpha: 1.0)
        headerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(headerView)

        backButton.setTitle("←", for: .normal)
        backButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 16)
        backButton.setTitleColor(UIColor(red: 229/255, green: 231/255, blue: 235/255, alpha: 1.0), for: .normal)
        backButton.backgroundColor = UIColor(red: 38/255, green: 34/255, blue: 34/255, alpha: 1.0) // #262222
        backButton.layer.cornerRadius = 8
        backButton.translatesAutoresizingMaskIntoConstraints = false
        backButton.addTarget(self, action: #selector(backTapped), for: .touchUpInside)
        headerView.addSubview(backButton)

        titleLabel.text = "Santa Claus 🎅"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
        titleLabel.textColor = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0) // #FEF3C7
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(titleLabel)

        statusLabel.text = "🟢 Online at North Pole"
        statusLabel.font = UIFont.systemFont(ofSize: 11)
        statusLabel.textColor = UIColor(red: 134/255, green: 239/255, blue: 172/255, alpha: 1.0) // #86EFAC
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

        // Quick Reply Chips matching Android
        quickRepliesScrollView.showsHorizontalScrollIndicator = false
        quickRepliesScrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(quickRepliesScrollView)

        quickRepliesStack.axis = .horizontal
        quickRepliesStack.spacing = 6
        quickRepliesStack.translatesAutoresizingMaskIntoConstraints = false
        quickRepliesScrollView.addSubview(quickRepliesStack)

        setupQuickReplies()

        // Input Container (#161212)
        inputContainerView.backgroundColor = UIColor(red: 22/255, green: 18/255, blue: 18/255, alpha: 1.0)
        inputContainerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(inputContainerView)

        messageTextField.attributedPlaceholder = NSAttributedString(
            string: "Type a message to Santa...",
            attributes: [.foregroundColor: UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1.0)]
        )
        messageTextField.textColor = .white
        messageTextField.backgroundColor = UIColor(red: 38/255, green: 34/255, blue: 34/255, alpha: 1.0) // #262222
        messageTextField.layer.cornerRadius = 8
        messageTextField.font = UIFont.systemFont(ofSize: 13)
        messageTextField.returnKeyType = .send
        messageTextField.delegate = self
        messageTextField.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 12, height: 44))
        messageTextField.leftViewMode = .always
        messageTextField.translatesAutoresizingMaskIntoConstraints = false
        inputContainerView.addSubview(messageTextField)

        sendButton.setTitle("Send", for: .normal)
        sendButton.setTitleColor(.white, for: .normal)
        sendButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        sendButton.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1.0) // #DC2626
        sendButton.layer.cornerRadius = 8
        sendButton.translatesAutoresizingMaskIntoConstraints = false
        sendButton.addTarget(self, action: #selector(sendMessageTapped), for: .touchUpInside)
        inputContainerView.addSubview(sendButton)

        inputBottomConstraint = inputContainerView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor)

        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 60),

            backButton.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 16),
            backButton.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),
            backButton.widthAnchor.constraint(equalToConstant: 44),
            backButton.heightAnchor.constraint(equalToConstant: 36),

            titleLabel.leadingAnchor.constraint(equalTo: backButton.trailingAnchor, constant: 12),
            titleLabel.topAnchor.constraint(equalTo: headerView.topAnchor, constant: 12),

            statusLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            statusLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 2),

            tableView.topAnchor.constraint(equalTo: headerView.bottomAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: quickRepliesScrollView.topAnchor, constant: -6),

            quickRepliesScrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 12),
            quickRepliesScrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -12),
            quickRepliesScrollView.bottomAnchor.constraint(equalTo: inputContainerView.topAnchor, constant: -6),
            quickRepliesScrollView.heightAnchor.constraint(equalToConstant: 38),

            quickRepliesStack.topAnchor.constraint(equalTo: quickRepliesScrollView.topAnchor),
            quickRepliesStack.bottomAnchor.constraint(equalTo: quickRepliesScrollView.bottomAnchor),
            quickRepliesStack.leadingAnchor.constraint(equalTo: quickRepliesScrollView.leadingAnchor),
            quickRepliesStack.trailingAnchor.constraint(equalTo: quickRepliesScrollView.trailingAnchor),

            inputContainerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            inputContainerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            inputContainerView.heightAnchor.constraint(equalToConstant: 64),
            inputBottomConstraint!,

            messageTextField.leadingAnchor.constraint(equalTo: inputContainerView.leadingAnchor, constant: 10),
            messageTextField.centerYAnchor.constraint(equalTo: inputContainerView.centerYAnchor),
            messageTextField.trailingAnchor.constraint(equalTo: sendButton.leadingAnchor, constant: -8),
            messageTextField.heightAnchor.constraint(equalToConstant: 44),

            sendButton.trailingAnchor.constraint(equalTo: inputContainerView.trailingAnchor, constant: -10),
            sendButton.centerYAnchor.constraint(equalTo: inputContainerView.centerYAnchor),
            sendButton.widthAnchor.constraint(equalToConstant: 70),
            sendButton.heightAnchor.constraint(equalToConstant: 44),
        ])
    }

    private func setupQuickReplies() {
        let replies = [
            "🎁 What gift is Santa making?",
            "🦌 How is Rudolph doing?",
            "⭐ Am I on the Nice List?"
        ]

        for text in replies {
            let btn = UIButton(type: .system)
            btn.setTitle(text, for: .normal)
            btn.setTitleColor(UIColor(red: 253/255, green: 230/255, blue: 138/255, alpha: 1.0), for: .normal) // #FDE68A
            btn.backgroundColor = UIColor(red: 38/255, green: 34/255, blue: 34/255, alpha: 1.0) // #262222
            btn.layer.cornerRadius = 8
            btn.titleLabel?.font = UIFont.systemFont(ofSize: 11, weight: .medium)
            btn.contentEdgeInsets = UIEdgeInsets(top: 6, left: 12, bottom: 6, right: 12)
            btn.addTarget(self, action: #selector(quickReplyTapped(_:)), for: .touchUpInside)
            quickRepliesStack.addArrangedSubview(btn)
        }
    }

    private func loadInitialMessages() {
        let welcomeText = "Ho ho ho! Hello dear \(profile.name)! This is Santa Claus from the North Pole! Send me your Christmas wishes and questions anytime! 🎅✨"
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
        let lower = userText.lowercased()

        if lower.contains("gift") || lower.contains("present") || lower.contains("want") || lower.contains("wish") || lower.contains("toy") {
            return "Ho ho ho! The elves in my North Pole workshop are wrapping '\(profile.dreamGift)' with a golden ribbon just for \(profile.name)! Remember to eat well and go to bed early! 🎁✨"
        } else if lower.contains("reindeer") || lower.contains("rudolph") || lower.contains("sleigh") {
            return "Ho ho ho! Rudolph just finished munching on crunchy sweet carrots, and his red nose is shining bright for our magical Christmas Eve flight! 🦌✨"
        } else if lower.contains("nice") || lower.contains("good") || lower.contains("list") || lower.contains("promise") {
            if profile.isNice {
                return "Ho ho ho! I just checked my Golden Nice List, and \(profile.name)'s name is shining at the very top! Santa is so proud of you! ⭐🎄"
            } else {
                return "Ho ho ho! Keep listening to mommy and daddy and doing your best, \(profile.name)! Santa believes in you and knows you'll earn your spot on the Nice List! ⭐"
            }
        } else if lower.contains("cold") || lower.contains("snow") || lower.contains("north pole") || lower.contains("weather") {
            return "It is -18°C here at the North Pole with fluffy white snow falling all over the elf workshop! Good thing Mrs. Claus made hot cocoa! ❄️☕"
        } else if lower.contains("hello") || lower.contains("hi") || lower.contains("hey") {
            return "Ho ho ho! Hello there, \(profile.name)! It makes Santa so happy to hear from you! How has your day been? 🎅❤️"
        } else if lower.contains("merry christmas") || lower.contains("love") || lower.contains("thank") {
            return "Ho ho ho! Merry Christmas to you and your wonderful family, \(profile.name)! Sending warm North Pole hugs! 🎄❤️"
        } else {
            return "Ho ho ho! Your message warms my jolly heart, \(profile.name)! Keep smiling, be kind, and have a magical Christmas season! 🎅✨"
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

    // MARK: - Keyboard Handling
    private func setupKeyboardObservers() {
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow(_:)), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide(_:)), name: UIResponder.keyboardWillHideNotification, object: nil)
    }

    @objc private func keyboardWillShow(_ notification: Notification) {
        if let frame = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect {
            inputBottomConstraint?.constant = -(frame.height - view.safeAreaInsets.bottom)
            UIView.animate(withDuration: 0.25) { self.view.layoutIfNeeded() }
            scrollToBottom()
        }
    }

    @objc private func keyboardWillHide(_ notification: Notification) {
        inputBottomConstraint?.constant = 0
        UIView.animate(withDuration: 0.25) { self.view.layoutIfNeeded() }
    }
}

extension SantaChatViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return messages.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ChatBubbleCell", for: indexPath) as! ChatBubbleCell
        let msg = messages[indexPath.row]
        cell.configure(isSanta: msg.isSanta, text: msg.text, time: msg.time)
        return cell
    }
}

// MARK: - Custom Chat Bubble Cell (Matches Android colors)
class ChatBubbleCell: UITableViewCell {
    private let bubbleView = UIView()
    private let messageLabel = UILabel()
    private let timeLabel = UILabel()

    private var leadingConstraint: NSLayoutConstraint!
    private var trailingConstraint: NSLayoutConstraint!

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none

        bubbleView.layer.cornerRadius = 12
        bubbleView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(bubbleView)

        messageLabel.numberOfLines = 0
        messageLabel.font = UIFont.systemFont(ofSize: 13)
        messageLabel.translatesAutoresizingMaskIntoConstraints = false
        bubbleView.addSubview(messageLabel)

        timeLabel.font = UIFont.systemFont(ofSize: 10)
        timeLabel.textColor = UIColor(white: 1.0, alpha: 0.55)
        timeLabel.translatesAutoresizingMaskIntoConstraints = false
        bubbleView.addSubview(timeLabel)

        leadingConstraint = bubbleView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16)
        trailingConstraint = bubbleView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16)

        NSLayoutConstraint.activate([
            bubbleView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            bubbleView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            bubbleView.widthAnchor.constraint(lessThanOrEqualTo: contentView.widthAnchor, multiplier: 0.78),

            messageLabel.topAnchor.constraint(equalTo: bubbleView.topAnchor, constant: 10),
            messageLabel.leadingAnchor.constraint(equalTo: bubbleView.leadingAnchor, constant: 12),
            messageLabel.trailingAnchor.constraint(equalTo: bubbleView.trailingAnchor, constant: -12),

            timeLabel.topAnchor.constraint(equalTo: messageLabel.bottomAnchor, constant: 4),
            timeLabel.trailingAnchor.constraint(equalTo: bubbleView.trailingAnchor, constant: -12),
            timeLabel.bottomAnchor.constraint(equalTo: bubbleView.bottomAnchor, constant: -8),
        ])
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    func configure(isSanta: Bool, text: String, time: String) {
        messageLabel.text = text
        timeLabel.text = time

        if isSanta {
            bubbleView.backgroundColor = UIColor(red: 39/255, green: 25/255, blue: 25/255, alpha: 1.0) // #271919
            messageLabel.textColor = UIColor(red: 254/255, green: 243/255, blue: 199/255, alpha: 1.0) // #FEF3C7
            leadingConstraint.isActive = true
            trailingConstraint.isActive = false
        } else {
            bubbleView.backgroundColor = UIColor(red: 6/255, green: 95/255, blue: 70/255, alpha: 1.0) // #065F46
            messageLabel.textColor = .white
            leadingConstraint.isActive = false
            trailingConstraint.isActive = true
        }
    }
}
