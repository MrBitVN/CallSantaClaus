import UIKit
import AVFoundation

class VideoCallViewController: UIViewController {

    private let profile = ChildProfile.load()

    // AVPlayer for Santa Video
    private var player: AVPlayer?
    private var playerLayer: AVPlayerLayer?

    // Camera Session for Child PIP Preview
    private var captureSession: AVCaptureSession?
    private var cameraPreviewLayer: AVCaptureVideoPreviewLayer?

    // Timers
    private var callSeconds = 0
    private var timer: Timer?

    // UI
    private let topOverlayView = UIView()
    private let timerLabel = UILabel()
    private let liveBadge = UILabel()
    private let pipCard = UIView()
    private let pipPlaceholderLabel = UILabel()

    private let controlsStack = UIStackView()
    private let endCallButton = UIButton(type: .system)
    private let muteButton = UIButton(type: .system)
    private let flipCameraButton = UIButton(type: .system)

    private var isMuted = false
    private var isUsingFrontCamera = true

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        setupSantaVideoPlayer()
        setupUI()
        setupChildCameraPreview()
        startCallTimer()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        playerLayer?.frame = view.bounds
        cameraPreviewLayer?.frame = pipCard.bounds
    }

    private func setupSantaVideoPlayer() {
        var videoUrl: URL?
        if let url = Bundle.main.url(forResource: "santa_videocall_loop", withExtension: "mp4") {
            videoUrl = url
        } else if let url = Bundle.main.url(forResource: "santa_videocall_loop", withExtension: "mp4", subdirectory: "public/videos") {
            videoUrl = url
        }

        guard let validUrl = videoUrl else {
            print("Video santa_videocall_loop.mp4 not found")
            return
        }

        player = AVPlayer(url: validUrl)
        playerLayer = AVPlayerLayer(player: player)
        playerLayer?.videoGravity = .resizeAspectFill
        playerLayer?.frame = view.bounds

        if let pLayer = playerLayer {
            view.layer.addSublayer(pLayer)
        }

        // Loop playback
        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: player?.currentItem,
            queue: .main
        ) { [weak self] _ in
            self?.player?.seek(to: .zero)
            self?.player?.play()
        }

        player?.play()
    }

    private func setupUI() {
        // Top Overlay
        topOverlayView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(topOverlayView)

        timerLabel.text = "00:00"
        timerLabel.textColor = .white
        timerLabel.font = UIFont.monospacedDigitSystemFont(ofSize: 15, weight: .bold)
        timerLabel.backgroundColor = UIColor(white: 0, alpha: 0.5)
        timerLabel.layer.cornerRadius = 8
        timerLabel.clipsToBounds = true
        timerLabel.textAlignment = .center
        timerLabel.translatesAutoresizingMaskIntoConstraints = false
        topOverlayView.addSubview(timerLabel)

        let isVi = profile.language == "vi"
        liveBadge.text = isVi ? "🔴 TRỰC TIẾP TỪ BẮC CỰC" : "🔴 NORTH POLE LIVE"
        liveBadge.textColor = UIColor(red: 1.0, green: 0.35, blue: 0.35, alpha: 1.0)
        liveBadge.font = UIFont.boldSystemFont(ofSize: 11)
        liveBadge.backgroundColor = UIColor(white: 0, alpha: 0.5)
        liveBadge.layer.cornerRadius = 8
        liveBadge.clipsToBounds = true
        liveBadge.textAlignment = .center
        liveBadge.translatesAutoresizingMaskIntoConstraints = false
        topOverlayView.addSubview(liveBadge)

        // PIP Card (Child camera preview)
        pipCard.backgroundColor = UIColor(white: 0.15, alpha: 0.9)
        pipCard.layer.cornerRadius = 16
        pipCard.layer.borderWidth = 2
        pipCard.layer.borderColor = UIColor(white: 1.0, alpha: 0.4).cgColor
        pipCard.clipsToBounds = true
        pipCard.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(pipCard)

        pipPlaceholderLabel.text = "\(profile.name)\n(Camera)"
        pipPlaceholderLabel.numberOfLines = 2
        pipPlaceholderLabel.textAlignment = .center
        pipPlaceholderLabel.textColor = .lightGray
        pipPlaceholderLabel.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        pipPlaceholderLabel.translatesAutoresizingMaskIntoConstraints = false
        pipCard.addSubview(pipPlaceholderLabel)

        // Bottom Controls
        controlsStack.axis = .horizontal
        controlsStack.spacing = 30
        controlsStack.alignment = .center
        controlsStack.distribution = .equalCentering
        controlsStack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(controlsStack)

        // Mute Button
        muteButton.backgroundColor = UIColor(white: 0.2, alpha: 0.8)
        muteButton.setTitle("🎙️", for: .normal)
        muteButton.titleLabel?.font = UIFont.systemFont(ofSize: 22)
        muteButton.layer.cornerRadius = 30
        muteButton.translatesAutoresizingMaskIntoConstraints = false
        muteButton.addTarget(self, action: #selector(toggleMute), for: .touchUpInside)

        // End Call Button
        endCallButton.backgroundColor = UIColor(red: 0.88, green: 0.15, blue: 0.15, alpha: 1.0)
        endCallButton.setTitle("📞", for: .normal)
        endCallButton.titleLabel?.font = UIFont.systemFont(ofSize: 28)
        endCallButton.layer.cornerRadius = 38
        endCallButton.translatesAutoresizingMaskIntoConstraints = false
        endCallButton.addTarget(self, action: #selector(endCall), for: .touchUpInside)

        // Flip Camera Button
        flipCameraButton.backgroundColor = UIColor(white: 0.2, alpha: 0.8)
        flipCameraButton.setTitle("🔄", for: .normal)
        flipCameraButton.titleLabel?.font = UIFont.systemFont(ofSize: 22)
        flipCameraButton.layer.cornerRadius = 30
        flipCameraButton.translatesAutoresizingMaskIntoConstraints = false
        flipCameraButton.addTarget(self, action: #selector(flipCamera), for: .touchUpInside)

        controlsStack.addArrangedSubview(muteButton)
        controlsStack.addArrangedSubview(endCallButton)
        controlsStack.addArrangedSubview(flipCameraButton)

        NSLayoutConstraint.activate([
            topOverlayView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 12),
            topOverlayView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            topOverlayView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            topOverlayView.heightAnchor.constraint(equalToConstant: 40),

            timerLabel.leadingAnchor.constraint(equalTo: topOverlayView.leadingAnchor),
            timerLabel.centerYAnchor.constraint(equalTo: topOverlayView.centerYAnchor),
            timerLabel.widthAnchor.constraint(equalToConstant: 74),
            timerLabel.heightAnchor.constraint(equalToConstant: 32),

            liveBadge.trailingAnchor.constraint(equalTo: topOverlayView.trailingAnchor),
            liveBadge.centerYAnchor.constraint(equalTo: topOverlayView.centerYAnchor),
            liveBadge.widthAnchor.constraint(equalToConstant: 160),
            liveBadge.heightAnchor.constraint(equalToConstant: 32),

            pipCard.topAnchor.constraint(equalTo: topOverlayView.bottomAnchor, constant: 16),
            pipCard.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            pipCard.widthAnchor.constraint(equalToConstant: 105),
            pipCard.heightAnchor.constraint(equalToConstant: 150),

            pipPlaceholderLabel.centerXAnchor.constraint(equalTo: pipCard.centerXAnchor),
            pipPlaceholderLabel.centerYAnchor.constraint(equalTo: pipCard.centerYAnchor),

            controlsStack.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            controlsStack.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -36),

            muteButton.widthAnchor.constraint(equalToConstant: 60),
            muteButton.heightAnchor.constraint(equalToConstant: 60),

            endCallButton.widthAnchor.constraint(equalToConstant: 76),
            endCallButton.heightAnchor.constraint(equalToConstant: 76),

            flipCameraButton.widthAnchor.constraint(equalToConstant: 60),
            flipCameraButton.heightAnchor.constraint(equalToConstant: 60),
        ])
    }

    private func setupChildCameraPreview() {
        let authStatus = AVCaptureDevice.authorizationStatus(for: .video)
        if authStatus == .notDetermined {
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                if granted {
                    DispatchQueue.main.async {
                        self?.configureCameraSession()
                    }
                }
            }
        } else if authStatus == .authorized {
            configureCameraSession()
        }
    }

    private func configureCameraSession() {
        let session = AVCaptureSession()
        session.sessionPreset = .vga640x480

        let position: AVCaptureDevice.Position = isUsingFrontCamera ? .front : .back
        guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: position),
              let input = try? AVCaptureDeviceInput(device: device) else {
            return
        }

        if session.canAddInput(input) {
            session.addInput(input)
        }

        let previewLayer = AVCaptureVideoPreviewLayer(session: session)
        previewLayer.videoGravity = .resizeAspectFill
        previewLayer.frame = pipCard.bounds
        pipCard.layer.insertSublayer(previewLayer, at: 0)

        self.captureSession = session
        self.cameraPreviewLayer = previewLayer

        DispatchQueue.global(qos: .userInitiated).async {
            session.startRunning()
        }

        pipPlaceholderLabel.isHidden = true
    }

    private func startCallTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.callSeconds += 1
            let mins = self.callSeconds / 60
            let secs = self.callSeconds % 60
            self.timerLabel.text = String(format: "%02d:%02d", mins, secs)
        }
    }

    @objc private func toggleMute() {
        isMuted.toggle()
        muteButton.backgroundColor = isMuted ? UIColor(red: 0.8, green: 0.2, blue: 0.2, alpha: 0.8) : UIColor(white: 0.2, alpha: 0.8)
        SoundManager.shared.triggerHaptic(style: .medium)
    }

    @objc private func flipCamera() {
        isUsingFrontCamera.toggle()
        captureSession?.stopRunning()
        cameraPreviewLayer?.removeFromSuperlayer()
        captureSession = nil
        cameraPreviewLayer = nil
        configureCameraSession()
        SoundManager.shared.triggerHaptic(style: .medium)
    }

    @objc private func endCall() {
        SoundManager.shared.triggerHaptic(style: .heavy)
        cleanup()
        dismiss(animated: true)
    }

    private func cleanup() {
        timer?.invalidate()
        timer = nil
        player?.pause()
        player = nil
        captureSession?.stopRunning()
        captureSession = nil
    }

    deinit {
        cleanup()
    }
}
