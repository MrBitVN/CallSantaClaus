export type CallType = 'audio' | 'video';

export type BehaviorStatus = 'nice' | 'warning';

export type ParentLockMode = 'pin' | 'math';

export interface ChildProfile {
  name: string;
  age: number;
  gender: 'boy' | 'girl' | 'neutral';
  hobby: string;
  favoriteFood: string;
  goodHabit: string;
  badHabit: string;
  dreamGift: string;
  behaviorStatus: BehaviorStatus;
}

export interface CallScenario {
  id: string;
  category: 'praise' | 'discipline' | 'gift_prep' | 'bedtime' | 'christmas_eve';
  title: string;
  description: string;
  script: string;
  icon: string;
}

export interface VoicemailItem {
  id: string;
  childName: string;
  timestamp: number;
  duration: number;
  audioBlobUrl?: string;
  messagePreview: string;
  isListened: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'santa' | 'user';
  text: string;
  timestamp: number;
  audioVoice?: boolean;
}

export interface ScheduledCallConfig {
  enabled: boolean;
  triggerType: 'delay' | 'time';
  delaySeconds: number;
  targetTimeString?: string;
  callType: CallType;
  scenarioId: string;
}

export interface AppSettings {
  requirePasscode: boolean;
  blackScreenAfterCall: boolean;
  hideLogo: boolean;
  hideGetACall: boolean;
  hideVideo: boolean;
  hideMyAccount: boolean;
  recordPhoneCalls: boolean;
  notificationsEnabled: boolean;
}

export interface VideoSceneOption {
  id: string;
  name: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
  durationBadge: string;
}

export interface GeneratedVideoMessage {
  id: string;
  title: string;
  scenarioId: string;
  script: string;
  interpolatedScript: string;
  childName: string;
  recipientAge: number;
  sceneThemeId: string;
  videoSrc: string;
  posterSrc: string;
  durationBadge: string;
  createdAt: number;
  customNote?: string;
}
