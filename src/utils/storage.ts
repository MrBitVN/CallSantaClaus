import type { ChildProfile, VoicemailItem, ChatMessage, ScheduledCallConfig, AppSettings, GeneratedVideoMessage } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'santacall_profile_v2',
  VOICEMAILS: 'santacall_voicemails_v2',
  CHAT_MESSAGES: 'santacall_chat_v2',
  SCHEDULED_CALL: 'santacall_scheduled_call_v2',
  PARENT_PIN: 'santacall_pin_v2',
  APP_SETTINGS: 'santacall_settings_v2',
  SAVED_VIDEOS: 'santacall_saved_videos_v2',
};

export const DEFAULT_PROFILE: ChildProfile = {
  name: 'Tommy',
  age: 6,
  gender: 'boy',
  hobby: 'building Lego sets and soccer',
  favoriteFood: 'chocolate chip cookies',
  goodHabit: 'cleaning up toys and being kind to others',
  badHabit: 'tucking in bed on time and eating veggies',
  dreamGift: 'a remote-controlled race car',
  behaviorStatus: 'nice'
};

export const storage = {
  getProfile(): ChildProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load profile', e);
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: ChildProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  getParentPin(): string {
    return localStorage.getItem(STORAGE_KEYS.PARENT_PIN) || '1225';
  },

  saveParentPin(pin: string) {
    localStorage.setItem(STORAGE_KEYS.PARENT_PIN, pin);
  },

  getVoicemails(): VoicemailItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOICEMAILS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load voicemails', e);
    }
    return [];
  },

  saveVoicemail(item: VoicemailItem) {
    try {
      const items = this.getVoicemails();
      items.unshift(item);
      localStorage.setItem(STORAGE_KEYS.VOICEMAILS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save voicemail', e);
    }
  },

  deleteVoicemail(id: string) {
    try {
      const items = this.getVoicemails().filter(v => v.id !== id);
      localStorage.setItem(STORAGE_KEYS.VOICEMAILS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to delete voicemail', e);
    }
  },

  getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load chat', e);
    }
    return [
      {
        id: 'welcome-init',
        sender: 'santa',
        text: 'Ho ho ho! Hello my dear friend! This is Santa Claus from the snowy North Pole. What would you like to ask me today?',
        timestamp: Date.now() - 30000
      }
    ];
  },

  saveChatMessages(messages: ChatMessage[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat', e);
    }
  },

  getScheduledCall(): ScheduledCallConfig | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_CALL);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to get scheduled call', e);
    }
    return null;
  },

  saveScheduledCall(config: ScheduledCallConfig | null) {
    if (!config) {
      localStorage.removeItem(STORAGE_KEYS.SCHEDULED_CALL);
    } else {
      localStorage.setItem(STORAGE_KEYS.SCHEDULED_CALL, JSON.stringify(config));
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to get settings', e);
    }
    return {
      requirePasscode: false,
      blackScreenAfterCall: false,
      hideLogo: false,
      hideGetACall: false,
      hideVideo: false,
      hideMyAccount: false,
      recordPhoneCalls: true,
      notificationsEnabled: true,
    };
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  getSavedVideos(): GeneratedVideoMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_VIDEOS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load saved videos', e);
    }
    // Default starter videos created by Santa for the child
    return [
      {
        id: 'default-vm-nice',
        title: 'You Are on the Nice List!',
        scenarioId: 'naughty_or_nice',
        script: "Ho ho ho! Hello there! Santa and his elves checked the great Golden Book, and you are shining bright on the Nice List! Keep up the wonderful work!",
        interpolatedScript: "Ho ho ho! Hello there Tommy! Santa and his elves checked the great Golden Book, and your name is shining bright on the Nice List! Keep up the wonderful work!",
        childName: 'Tommy',
        recipientAge: 6,
        sceneThemeId: 'fireside',
        videoSrc: '/videos/video_nicebook.mp4',
        posterSrc: '/images/video_nicebook.jpg',
        durationBadge: '0:12',
        createdAt: Date.now() - 3600000 * 2,
        customNote: 'Official Certified Nice List Dispatch from North Pole'
      },
      {
        id: 'default-vm-letter',
        title: "I've Received Your Letter!",
        scenarioId: 'received_letter',
        script: "Ho ho ho! Greetings! Look at the lovely letter my helper elf is holding—it is your very own letter! The workshop elves are already busy wrapping your dream present!",
        interpolatedScript: "Ho ho ho! Greetings Tommy! Look at the lovely letter my helper elf is holding—it is your very own letter! The workshop elves are already busy wrapping your dream present!",
        childName: 'Tommy',
        recipientAge: 6,
        sceneThemeId: 'workshop',
        videoSrc: '/videos/video_letter.mp4',
        posterSrc: '/images/video_letter.jpg',
        durationBadge: '0:06',
        createdAt: Date.now() - 3600000 * 24,
        customNote: 'Elf Mailroom Verification'
      },
      {
        id: 'default-vm-birthday',
        title: 'Happy Birthday from Santa!',
        scenarioId: 'happy_birthday',
        script: "Ho ho ho! Happy Birthday! Look on my North Pole calendar—your special day is circled with a big red heart! Santa wishes you a magical year filled with joy!",
        interpolatedScript: "Ho ho ho! Happy Birthday Tommy! Look on my North Pole calendar—your special day is circled with a big red heart! Santa wishes you a magical year filled with joy!",
        childName: 'Tommy',
        recipientAge: 6,
        sceneThemeId: 'birthday',
        videoSrc: '/videos/video_birthday.mp4',
        posterSrc: '/images/video_birthday.jpg',
        durationBadge: '0:07',
        createdAt: Date.now() - 3600000 * 48,
        customNote: 'Birthday Celebration Video'
      },
      {
        id: 'default-vm-sleigh',
        title: 'Christmas Eve Sleigh Ride',
        scenarioId: 'christmas_eve_flight',
        script: "Ho ho ho! The sleigh bells are ringing! Rudolph is steering our flying sleigh through the starry night clouds! Sleep tight and sweet dreams!",
        interpolatedScript: "Ho ho ho! The sleigh bells are ringing! Rudolph is steering our flying sleigh through the starry night clouds towards Tommy's home! Sleep tight and sweet dreams!",
        childName: 'Tommy',
        recipientAge: 6,
        sceneThemeId: 'sleigh',
        videoSrc: '/videos/video_sleigh.mp4',
        posterSrc: '/images/santa_videocall.jpg',
        durationBadge: '0:06',
        createdAt: Date.now() - 3600000 * 72,
        customNote: 'Sleigh Flight Video Dispatch'
      }
    ];
  },

  saveGeneratedVideo(video: GeneratedVideoMessage) {
    try {
      const items = this.getSavedVideos();
      items.unshift(video);
      localStorage.setItem(STORAGE_KEYS.SAVED_VIDEOS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save generated video', e);
    }
  },

  deleteSavedVideo(id: string) {
    try {
      const items = this.getSavedVideos().filter(v => v.id !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_VIDEOS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to delete video', e);
    }
  }
};
