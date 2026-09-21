import type { CallScenario, ChildProfile } from '../types';

export const DEFAULT_SCENARIOS: CallScenario[] = [
  {
    id: 'naughty_or_nice',
    category: 'praise',
    title: 'You Were Naughty or Nice',
    description: 'Santa and his elf check the Golden Book to confirm your spot on the Nice List',
    icon: 'Star',
    script: 'Ho ho ho! Hello there, my sweet young friend {name}! This is Santa Claus speaking all the way from the snowy North Pole with my helper elf! Today we opened our great Golden Book of wonderful {age}-year-olds, and your name is shining bright because you have been so good at {goodHabit}. I am so proud of you! Keep being wonderful and remember to {badHabit}, and my reindeer and I will make sure {dreamGift} is waiting under your Christmas tree! Ho ho ho!'
  },
  {
    id: 'received_letter',
    category: 'gift_prep',
    title: "I've Received Your Letter",
    description: 'Santa and the elf confirm they received and read your holiday wishlist letter',
    icon: 'Gift',
    script: 'Ho ho ho! Warmest greetings, {name}! Do you see the lovely letters my elf is holding right here? Yes, that is your very own letter sent to the North Pole! I read every single sweet word and I know how much you love {hobby} and enjoying {favoriteFood}. The elves in our workshop are busy wrapping your dream present {dreamGift}! Keep shining bright and always remember to {goodHabit}!'
  },
  {
    id: 'happy_birthday',
    category: 'praise',
    title: 'Happy Birthday from Santa',
    description: 'Santa points to his calendar and delivers magical birthday blessings',
    icon: 'Sparkles',
    script: 'Ho ho ho! Happy birthday, dearest {name}! Look here on my North Pole calendar—your special birthday turning {age} years old is circled with a big red heart! Santa wishes you a blessed year filled with good health, happiness, delicious {favoriteFood}, and lots of joy playing {hobby}! Sending you the warmest North Pole magic and love!'
  },
  {
    id: 'gentle_discipline',
    category: 'discipline',
    title: 'Put on Naughty List, Because...',
    description: 'Santa gently reminds you to improve behavior and listen to your parents',
    icon: 'Sparkles',
    script: 'Ho ho ho! Dearest {name}! My little reindeer whispered to me that you are such a bright, wonderful {age}-year-old who loves {hobby}, but you still need to try a little harder with {badHabit}. Will you make a secret promise with Santa to listen to your parents and improve from today? Santa has full faith in you, and I am saving the absolute best gift {dreamGift} just for you!'
  },
  {
    id: 'praise_good_behavior',
    category: 'praise',
    title: 'Praise for Good Habits',
    description: 'Santa commends your polite manners and confirms your place on the Certified Nice List',
    icon: 'Star',
    script: 'Ho ho ho! Greetings {name}! This is Santa Claus calling you directly from the North Pole! My magical golden Nice Book shines brightly because you have been doing so well with {goodHabit}. And I also know how much you enjoy {favoriteFood}! I am so very proud of you! Keep up the fantastic work, for my reindeer and I have prepared a magical surprise just for you!'
  },
  {
    id: 'bedtime_reminder',
    category: 'bedtime',
    title: 'Bedtime & Sweet Dreams',
    description: 'Santa reminds you to brush your teeth and tuck into bed early for the reindeer visit',
    icon: 'Moon',
    script: 'Ho ho ho! Hello {name}, the snowy night has fallen here at the North Pole! Has my wonderful {age}-year-old friend brushed their teeth and tucked in warmly? My flying reindeer will only land on rooftops when all sweet children are fast asleep dreaming magical dreams! Goodnight {name}, sleep tight and dream sweet dreams!'
  },
  {
    id: 'christmas_eve_flight',
    category: 'christmas_eve',
    title: 'Christmas Eve Sleigh Flight',
    description: 'Santa and Rudolph are flying across the clouds towards your home',
    icon: 'Bell',
    script: 'Ho ho ho! Jingle jingle! The sleigh bells are ringing across the starry night sky! Rudolph with his glowing red nose is steering our flying sleigh through the clouds towards {name}s home! Sleep tight, my dear friend, and tomorrow morning {dreamGift} will be waiting for you under the tree!'
  }
];

export function interpolateScript(template: string, profile: ChildProfile): string {
  return template
    .replace(/{name}/g, profile.name || 'little one')
    .replace(/{age}/g, (profile.age || 5).toString())
    .replace(/{hobby}/g, profile.hobby || 'playing with friends')
    .replace(/{favoriteFood}/g, profile.favoriteFood || 'cookies and sweet treats')
    .replace(/{goodHabit}/g, profile.goodHabit || 'being kind, polite, and respectful')
    .replace(/{badHabit}/g, profile.badHabit || 'cleaning up your room and listening to parents')
    .replace(/{dreamGift}/g, profile.dreamGift || 'your wonderful dream present');
}
