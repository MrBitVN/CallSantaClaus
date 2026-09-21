import { useState, useRef } from 'react';
import { BokehBackground } from './components/BokehBackground';
import { SnowEffect } from './components/SnowEffect';
import { HomeScreen } from './components/HomeScreen';
import { MyAccountScreen } from './components/MyAccountScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { VoicemailScreen } from './components/VoicemailScreen';
import { SantaChatScreen } from './components/SantaChatScreen';
import { GetACallScreen } from './components/GetACallScreen';
import { VideoMessagesScreen } from './components/VideoMessagesScreen';
import { IncomingCallModal } from './components/IncomingCallModal';
import { AudioCallScreen } from './components/AudioCallScreen';
import { VideoCallScreen } from './components/VideoCallScreen';
import { NiceCertificateModal } from './components/NiceCertificateModal';
import { SantaTracker } from './components/SantaTracker';
import { PasscodeModal } from './components/PasscodeModal';
import { PhoneCall } from 'lucide-react';
import type { ChildProfile, CallType, AppSettings } from './types';
import { DEFAULT_SCENARIOS } from './data/scenarios';
import { storage } from './utils/storage';

type ViewMode = 'home' | 'account' | 'settings' | 'voicemail' | 'chat' | 'get-call' | 'video-messages';

export function App() {
  const [profile, setProfile] = useState<ChildProfile>(() => storage.getProfile());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  // Modals state
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [isBlackScreen, setIsBlackScreen] = useState(false);

  // Incoming Call & Ongoing Call State
  const [incomingCall, setIncomingCall] = useState<{
    isOpen: boolean;
    callType: CallType;
    scenarioId: string;
  } | null>(null);

  const [ongoingCall, setOngoingCall] = useState<{
    callType: CallType;
    scenarioId: string;
  } | null>(null);

  // Scheduled Call countdown
  const [scheduledCountdown, setScheduledCountdown] = useState<number | null>(null);
  const scheduledTimerRef = useRef<number | null>(null);

  // Update Settings
  const handleUpdateSettings = (updated: AppSettings) => {
    setSettings(updated);
    storage.saveSettings(updated);
  };

  // Update Profile
  const handleUpdateProfile = (updated: ChildProfile) => {
    setProfile(updated);
    storage.saveProfile(updated);
  };

  // Open Settings with Passcode protection if enabled
  const handleOpenSettings = () => {
    if (settings.requirePasscode) {
      setPasscodeModalOpen(true);
    } else {
      setCurrentView('settings');
    }
  };

  // Trigger call immediately or with timer delay
  const handleTriggerCall = (type: CallType, scenarioId: string, delaySeconds: number) => {
    if (scheduledTimerRef.current) {
      clearInterval(scheduledTimerRef.current);
      scheduledTimerRef.current = null;
    }

    if (delaySeconds <= 0) {
      setIncomingCall({
        isOpen: true,
        callType: type,
        scenarioId: scenarioId || DEFAULT_SCENARIOS[0].id
      });
    } else {
      setScheduledCountdown(delaySeconds);
      scheduledTimerRef.current = window.setInterval(() => {
        setScheduledCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (scheduledTimerRef.current) clearInterval(scheduledTimerRef.current);
            scheduledTimerRef.current = null;
            setIncomingCall({
              isOpen: true,
              callType: type,
              scenarioId: scenarioId || DEFAULT_SCENARIOS[0].id
            });
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Accept Incoming Call
  const handleAcceptIncomingCall = () => {
    if (!incomingCall) return;
    const { callType, scenarioId } = incomingCall;
    setIncomingCall(null);
    setOngoingCall({ callType, scenarioId });
  };

  // Decline Incoming Call
  const handleDeclineIncomingCall = () => {
    setIncomingCall(null);
  };

  // End Ongoing Call
  const handleEndOngoingCall = () => {
    setOngoingCall(null);
    if (settings.blackScreenAfterCall) {
      setIsBlackScreen(true);
    }
  };

  const currentScenario = DEFAULT_SCENARIOS.find(
    s => s.id === (ongoingCall?.scenarioId || DEFAULT_SCENARIOS[0].id)
  ) || DEFAULT_SCENARIOS[0];

  // Black Screen Simulator (after call ends, if enabled by parent)
  if (isBlackScreen) {
    return (
      <div
        onClick={() => setIsBlackScreen(false)}
        className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center select-none cursor-pointer text-stone-900 hover:text-stone-700 transition-colors"
      >
        <p className="text-[11px] opacity-20">Tap to wake</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-100 flex flex-col font-sans selection:bg-red-600 selection:text-white relative overflow-x-hidden">
      
      {/* Authentic Festive Bokeh Background */}
      <BokehBackground />

      {/* Falling Snow Ambiance Effect */}
      <SnowEffect />

      {/* Scheduled Call Banner Indicator */}
      {scheduledCountdown !== null && (
        <div className="bg-gradient-to-r from-amber-600 to-red-600 text-stone-950 font-bold px-4 py-2 text-center text-xs flex items-center justify-center gap-2 shadow-lg animate-pulse z-30 sticky top-0">
          <PhoneCall className="w-4 h-4 text-stone-950 animate-bounce" />
          <span>
            Scheduled call from Santa ringing in {scheduledCountdown}s...
          </span>
          <button
            onClick={() => {
              if (scheduledTimerRef.current) clearInterval(scheduledTimerRef.current);
              setScheduledCountdown(null);
            }}
            className="ml-2 text-[10px] px-2 py-0.5 rounded bg-black/20 hover:bg-black/40 text-white font-semibold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col z-10">
        
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <HomeScreen
            profile={profile}
            settings={settings}
            onOpenSettings={handleOpenSettings}
            onOpenAccount={() => setCurrentView('account')}
            onOpenVoicemail={() => setCurrentView('voicemail')}
            onOpenChat={() => setCurrentView('chat')}
            onOpenGetACall={() => setCurrentView('get-call')}
            onOpenVideoMessages={() => setCurrentView('video-messages')}
          />
        )}

        {/* VIEW: GET A CALL */}
        {currentView === 'get-call' && (
          <GetACallScreen
            profile={profile}
            onBack={() => setCurrentView('home')}
            onUpdateProfile={handleUpdateProfile}
            onScheduleCall={(type, scenarioId, delay) => {
              handleTriggerCall(type, scenarioId, delay);
              setCurrentView('home');
            }}
          />
        )}

        {/* VIEW: VIDEO MESSAGES (TẠO VIDEO TỪ KỊCH BẢN) */}
        {currentView === 'video-messages' && (
          <VideoMessagesScreen
            profile={profile}
            onBack={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 2: MY ACCOUNT */}
        {currentView === 'account' && (
          <MyAccountScreen
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 3: SETTINGS */}
        {currentView === 'settings' && (
          <SettingsScreen
            settings={settings}
            profile={profile}
            onUpdateSettings={handleUpdateSettings}
            onBack={() => setCurrentView('home')}
            onOpenCertificate={() => setCertificateModalOpen(true)}
            onOpenTracker={() => setTrackerModalOpen(true)}
            onTriggerCall={handleTriggerCall}
          />
        )}

        {/* VIEW 4: VOICEMAIL */}
        {currentView === 'voicemail' && (
          <VoicemailScreen
            profile={profile}
            onBack={() => setCurrentView('home')}
            onOpenParent={() => setCurrentView('settings')}
          />
        )}

        {/* VIEW 5: CHAT */}
        {currentView === 'chat' && (
          <div className="p-2 sm:p-4">
            <SantaChatScreen
              profile={profile}
              onBack={() => setCurrentView('home')}
            />
          </div>
        )}

      </main>

      {/* PASSCODE / PARENTAL PIN MODAL */}
      <PasscodeModal
        isOpen={passcodeModalOpen}
        onSuccess={() => {
          setCurrentView('settings');
        }}
        onClose={() => setPasscodeModalOpen(false)}
      />

      {/* INCOMING CALL MODAL */}
      <IncomingCallModal
        isOpen={!!incomingCall?.isOpen}
        callType={incomingCall?.callType || 'video'}
        profile={profile}
        onAccept={handleAcceptIncomingCall}
        onDecline={handleDeclineIncomingCall}
      />

      {/* AUDIO CALL SCREEN */}
      {ongoingCall && ongoingCall.callType === 'audio' && (
        <AudioCallScreen
          scenario={currentScenario}
          profile={profile}
          onEndCall={handleEndOngoingCall}
        />
      )}

      {/* VIDEO CALL SCREEN */}
      {ongoingCall && ongoingCall.callType === 'video' && (
        <VideoCallScreen
          scenario={currentScenario}
          profile={profile}
          onEndCall={handleEndOngoingCall}
        />
      )}

      {/* NICE LIST CERTIFICATE MODAL */}
      <NiceCertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        profile={profile}
      />

      {/* SANTA TRACKER RADAR MODAL */}
      <SantaTracker
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
      />

    </div>
  );
}

export default App;
