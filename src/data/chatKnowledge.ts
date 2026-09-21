import type { ChildProfile } from '../types';

export interface SuggestedQuestion {
  id: string;
  text: string;
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: '1',
    text: '🎅 Ông đang làm gì ở Bắc Cực thế ạ?'
  },
  {
    id: '2',
    text: '⭐ Tên cháu có trong Sách Bé Ngoan không ông?'
  },
  {
    id: '3',
    text: '🎁 Món quà mơ ước của cháu đã được gói chưa?'
  },
  {
    id: '4',
    text: '🦌 Chú tuần lộc mũi đỏ Rudolph khỏe không ông?'
  },
  {
    id: '5',
    text: '🍪 Đêm Noel ông thích ăn bánh quy vị gì nhất?'
  },
  {
    id: '6',
    text: '❤️ Cháu chúc Ông Già Noel luôn vui vẻ và ấm áp!'
  }
];

// Helper: Strip Vietnamese diacritics for robust fuzzy keyword matching
function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

// Helper: Detect if user typed in Vietnamese
function isVietnamese(rawText: string): boolean {
  const hasVnAccents = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(rawText);
  if (hasVnAccents) return true;

  const normalized = normalizeText(rawText);
  const vnKeywords = [
    'chao', 'ong', 'chau', 'con', 'bac', 'noel', 'giang sinh', 'qua', 'ngoan', 'banh', 
    'tuan loc', 'chu lun', 'cho con', 'cho chau', 'o dau', 'khong', 'the', 'lam gi',
    'yeu ong', 'cam on', 'uoc', 'xin qua', 'di ngu', 'ngu ngon'
  ];
  return vnKeywords.some(kw => normalized.includes(kw));
}

interface IntentMatcher {
  id: string;
  keywords: string[];
  replyVi: (p: ChildProfile) => string;
  replyEn: (p: ChildProfile) => string;
}

const INTENTS: IntentMatcher[] = [
  // 1. GREETING
  {
    id: 'greeting',
    keywords: [
      'chao', 'alo', 'hello', 'hi', 'hey', 'greetings', 'morning', 'chao ong', 'chao bac',
      'ong oi', 'bac oi', 'santa oi', 'alo ong', 'hello santa'
    ],
    replyVi: (p) =>
      `Ho ho ho! Ông Già Noel gửi lời chào nồng nhiệt nhất đến ${p.name} yêu quý! Bắc Cực hôm nay đang có tuyết rơi tuyệt đẹp. Nhận được tin nhắn của ${p.name} làm ông thấy ấm lòng vô cùng! Ngày hôm nay của con thế nào rồi?`,
    replyEn: (p) =>
      `Ho ho ho! Warmest holiday greetings, my dear friend ${p.name}! It is a brisk -18°C here at the North Pole, but your lovely message brings so much sunshine! How has your day been?`
  },

  // 2. WHO ARE YOU & ARE YOU REAL
  {
    id: 'identity',
    keywords: [
      'ong la ai', 'bac la ai', 'ban la ai', 'who are you', 'who r u', 'ten la gi', 'what is your name',
      'co that khong', 'that khong', 'are you real', 'is santa real', 'ong that khong'
    ],
    replyVi: () =>
      `Ho ho ho! Ông chính là Ông Già Noel (Santa Claus) râu tóc bạc phơ bằng xương bằng thịt đây! Ông sống tại ngôi làng Bắc Cực cùng đàn tuần lộc và hàng ngàn chú lùn tí hon. Phép màu Giáng Sinh là có thật mỗi khi các con biết yêu thương, sẻ chia và mỉm cười!`,
    replyEn: () =>
      `Ho ho ho! I am indeed Santa Claus himself, writing directly from my North Pole desk! As long as there is love, kindness, and wonder in the world, Christmas magic is 100% real and alive!`
  },

  // 3. AGE & BIRTHDAY
  {
    id: 'age',
    keywords: [
      'bao nhieu tuoi', 'may tuoi', 'how old', 'your age', 'sinh nhat', 'birthday', 'sinh ngay nao',
      'bao tuoi', 'ong gia roi'
    ],
    replyVi: (p) =>
      `Ho ho ho! Ông đã sống hơn 1.700 năm rồi đấy! Nhưng nhờ có tình cảm ngây thơ và nụ cười rực rỡ của những đứa trẻ ngoan như ${p.name}, ông luôn cảm thấy tràn đầy sức sống như mới đôi mươi vậy!`,
    replyEn: (p) =>
      `Ho ho ho! I stopped counting centuries ago, but I am well over 1,700 years old! Yet, chatting with cheerful children like ${p.name} keeps me as lively as a dancing snowflake!`
  },

  // 4. WHERE DO YOU LIVE & NORTH POLE WEATHER
  {
    id: 'location_weather',
    keywords: [
      'o dau', 'nha o dau', 'song o dau', 'where do you live', 'where are you', 'north pole', 'bac cuc',
      'co lanh khong', 'thoi tiet', 'tuyet', 'snow', 'cold', 'is it cold', 'bang gia'
    ],
    replyVi: () =>
      `Ho ho ho! Ông đang ngồi bên lò sưởi ấm cúng tại Làng Giáng Sinh ở Bắc Cực (North Pole)! Ngoài cửa sổ, tuyết trắng phủ dày khắp các rặng thông và nhiệt độ là -18°C. Nhưng trong nhà thì ấm áp và thơm nức mùi gỗ thông cùng bánh gừng nướng!`,
    replyEn: () =>
      `Ho ho ho! I live right at the magnetic North Pole, in a cozy wooden cottage surrounded by snow-covered fir trees! Outside it is a frosty -18°C, but inside my workshop it is warm, bright, and smells like fresh gingerbread!`
  },

  // 5. WHAT ARE YOU DOING RIGHT NOW
  {
    id: 'doing_now',
    keywords: [
      'dang lam gi', 'lam gi the', 'what are you doing', 'what r u doing', 'ban khong', 'busy',
      'co ranh khong', 'bac dang lam gi'
    ],
    replyVi: (p) =>
      `Ho ho ho! Ông vừa cùng các chú lùn kiểm tra tiến độ đóng gói quà và nếm thử mẻ bánh quy mới ra lò. Lát nữa ông sẽ ra chuồng tuyết để thưởng cho chú tuần lộc Rudolph một xô cà rốt giòn ngọt! Trò chuyện với ${p.name} là khoảng thời gian thư giãn nhất trong ngày của ông đấy!`,
    replyEn: (p) =>
      `Ho ho ho! I was just inspecting the toy packaging lines with our head elf and enjoying warm cocoa! Next, I am heading out to give Rudolph a bucket of fresh crunchy carrots! Chatting with you, ${p.name}, is the highlight of my day!`
  },

  // 6. GIFTS & WISHLIST
  {
    id: 'gift_wish',
    keywords: [
      'qua', 'xin qua', 'tang qua', 'uoc', 'wish', 'gift', 'present', 'presents', 'toy', 'toys',
      'do choi', 'lego', 'bup be', 'xe', 'o to', 'robot', 'sach', 'chuyen', 'i want', 'can i have'
    ],
    replyVi: (p) =>
      `Ho ho ho! Điều ước Giáng Sinh của ${p.name} đã được ông ghi nhận nốt son đỏ vào Sách Vàng rồi! Có phải con đang rất mong chờ món quà "${p.dreamGift || 'món quà mơ ước tuyệt đẹp'}" đúng không nào? Các chú lùn ở Bắc Cực đang thắt chiếc nơ lụa vàng lấp lánh lên món quà cho con đấy! Hãy tiếp tục làm một đứa trẻ ngoan nhé!`,
    replyEn: (p) =>
      `Ho ho ho! Your Christmas wishlist has been lovingly recorded in my golden book! The elves are tying a gleaming velvet ribbon around ${p.dreamGift ? `your special gift "${p.dreamGift}"` : 'your dream present'} right now! Keep spreading cheer and doing your best, ${p.name}!`
  },

  // 7. NICE LIST & GOOD BEHAVIOR
  {
    id: 'nice_list',
    keywords: [
      'ngoan khong', 'con ngoan', 'chau ngoan', 'nice list', 'naughty', 'am i nice', 'am i good',
      'so vang', 'danh sach', 'duoc qua khong', 'co duoc nhan qua'
    ],
    replyVi: (p) =>
      `Để ông mở cuốn Sách Vàng Bắc Cực kiểm tra nhé... A ha! Tên của bé ${p.name} (${p.age} tuổi) đang tỏa ánh sáng vàng rực rỡ ở trang "DANH SÁCH BÉ NGOAN XUẤT SẮC"! Ông rất tự hào vì con luôn ${p.goodHabit || 'chăm chỉ, ngoan ngoãn và lễ phép'}. Con nhớ cố gắng thêm về việc ${p.badHabit || 'nghe lời bố mẹ và đi ngủ đúng giờ'} nữa là hoàn hảo 10/10 luôn!`,
    replyEn: (p) =>
      `Let me flip open the heavy golden North Pole ledger... Aha! ${p.name} (${p.age} years old) is shining bright on the OFFICIAL NICE LIST! Santa is so proud of you for ${p.goodHabit || 'being kind and helpful'}! Remember to keep trying your best with ${p.badHabit || 'listening to parents'}, and you will earn a shining 10/10!`
  },

  // 8. REINDEER & RUDOLPH
  {
    id: 'reindeer',
    keywords: [
      'tuan loc', 'rudolph', 'mui do', 'reindeer', 'sleigh', 'xe truot tuyet', 'xe bay',
      'chu tuan loc', 'an ca rot'
    ],
    replyVi: () =>
      `Ho ho ho! Chú tuần lộc đầu đàn Rudolph với chiếc mũi đỏ phát sáng chào con này! Cả 9 chú tuần lộc gồm Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen và Rudolph đều rất khỏe mạnh, ngày nào cũng tập bay lượn qua các đám mây tuyết để sẵn sàng cho chuyến bay đêm Noel!`,
    replyEn: () =>
      `Ho ho ho! Rudolph just gave a joyful jingle with his brass harness bells! All 9 of my flying reindeer—Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen, and red-nosed Rudolph—are eating crunchy sweet carrots and practicing high-speed flight across the northern lights!`
  },

  // 9. ELVES & WORKSHOP
  {
    id: 'elves',
    keywords: [
      'chu lun', 'yeu tinh', 'elf', 'elves', 'xuong qua', 'workshop', 'nha may', 'ai lam do choi'
    ],
    replyVi: () =>
      `Ho ho ho! Hàng ngàn chú lùn với đôi tai nhọn và bộ đồng phục đỏ xanh tí hon đang hăng say làm việc tại Xưởng Quà Bắc Cực! Họ vừa chế tạo robot, búp bê, bộ lắp ráp vừa hát vang những bài ca Giáng Sinh rộn rã!`,
    replyEn: () =>
      `Ho ho ho! My workshop elves are bustling with joy! With their pointed ears and tiny green hats, they are painting wooden toys, wrapping boxes, and singing merry Christmas carols around the clock!`
  },

  // 10. COOKIES & MILK & FOOD
  {
    id: 'food_cookies',
    keywords: [
      'an gi', 'thich an', 'banh quy', 'sua', 'cookie', 'cookies', 'milk', 'doi bung', 'ca rot',
      'favorite food', 'mon an'
    ],
    replyVi: (p) =>
      `Ho ho ho! Món khoái khẩu số 1 của ông già này chính là bánh quy sô-cô-la thơm phức và một ly sữa tươi ấm! Ông cũng nghe nói ${p.name} rất thích ăn món ${p.favoriteFood || 'bánh ngọt'} đúng không nào? Nếu đêm Noel con để một đĩa bánh nhỏ cạnh cây thông, ông sẽ cảm ơn con rất nhiều!`,
    replyEn: (p) =>
      `Ho ho ho! Nothing in the world beats fresh warm chocolate chip cookies and a tall glass of creamy milk! I also hear that you love enjoying ${p.favoriteFood || 'tasty treats'}, ${p.name}! Leaving a little treat beside your tree on Christmas Eve will make my old heart dance!`
  },

  // 11. TIMELINE & CHRISTMAS EVE
  {
    id: 'schedule_eve',
    keywords: [
      'khi nao', 'bao gio', 'dem noel', 'dem giang sinh', 'when are you coming', 'how many days',
      'christmas eve', 'den nha', 'phat qua'
    ],
    replyVi: () =>
      `Vào đêm Giáng Sinh (24 tháng 12), khi tiếng chuông giáo đường ngân vang và tất cả các em bé ngoan đã say giấc nồng, cỗ xe bay của ông sẽ lướt qua bầu trời đầy sao và đáp nhẹ xuống mái nhà con để đặt quà dưới gốc thông đấy! Hãy nhớ ngủ thật ngoan nhé!`,
    replyEn: () =>
      `On Christmas Eve, as soon as the stars shimmer and sweet children are tucked into bed dreaming peacefully, Rudolph will guide my flying sleigh straight to your rooftop! Remember to be fast asleep so the holiday magic can unfold!`
  },

  // 12. BEDTIME & SLEEP
  {
    id: 'bedtime',
    keywords: [
      'di ngu', 'ngu ngon', 'chuc ngu ngon', 'goodnight', 'sleep', 'bedtime', 'buon ngu', 'danh rang',
      'ngu day'
    ],
    replyVi: (p) =>
      `Ho ho ho! Ngoan lắm ${p.name}! Con nhớ đánh răng thật sạch, chúc bố mẹ ngủ ngon rồi chui vào chăn ấm nhé. Ông gửi bụi phép thuật tuyết rơi ru con ngủ. Chúc con có những giấc mơ thần tiên ngọt ngào nhất đêm nay! Goodnight!`,
    replyEn: (p) =>
      `Ho ho ho! Off to dreamland, sweet ${p.name}! Brush your teeth bright and clean, give your parents a warm hug, and tuck under cozy blankets! I am sprinkling sparkling North Pole dream dust for you. Sleep tight and sweet dreams!`
  },

  // 13. LOVE & APPRECIATION
  {
    id: 'love_thanks',
    keywords: [
      'yeu ong', 'thuong ong', 'cam on', 'thank you', 'thanks', 'love you', 'merry christmas',
      'chuc ong', 'biet on', 'i love you'
    ],
    replyVi: (p) =>
      `Tấm lòng nhân hậu và lời chúc của ${p.name} làm trái tim ông già này ấm áp hơn cả ánh lửa lò sưởi! Ông Già Noel cũng yêu thương con và mọi bạn nhỏ rất nhiều! Chúc con và gia đình một mùa Giáng Sinh an lành, hạnh phúc và ngập tràn may mắn!`,
    replyEn: (p) =>
      `Ho ho ho! Your kind and loving words warm my heart more than a hundred crackling fires! Santa loves you so very much, ${p.name}! May peace, laughter, and endless wonder fill your home this holiday season!`
  },

  // 14. PARENT RESPECT & PROMISES
  {
    id: 'promises_parents',
    keywords: [
      'bo me', 'xin loi', 'hua', 'vang loi', 'nghe loi', 'co gang', 'parents', 'promise', 'sorry',
      'try my best'
    ],
    replyVi: (p) =>
      `Ho ho ho! Biết lắng nghe, biết nhận lỗi và hứa cố gắng chính là phẩm chất đáng quý nhất của một đứa trẻ tuyệt vời! Bố mẹ yêu thương con hơn bất kỳ ai trên đời đấy. Ông tin chắc ${p.name} sẽ là niềm tự hào lớn nhất của bố mẹ!`,
    replyEn: (p) =>
      `Ho ho ho! Having the courage to listen, learn, and promise to do better is the true mark of an amazing child! Your parents love you dearly. Santa knows ${p.name} will make them so proud and happy!`
  },

  // 15. WHY TYPING SLOWLY
  {
    id: 'typing_slow',
    keywords: [
      'go cham', 'sao lau the', 'sao cham the', 'slow', 'typing', 'taking so long', 'why slow'
    ],
    replyVi: () =>
      `Ho ho ho! Thứ lỗi cho ông nhé! Đôi găng tay len Bắc Cực của ông dày cộp và dính đầy hoa tuyết nên ông gõ phím hơi vụng về một chút! Nhưng từng dòng tin nhắn con gửi tới, ông đều đọc rất say mê và trân trọng!`,
    replyEn: () =>
      `Ho ho ho! Pardon my slow fingers! My thick woolen mittens are frosty from the snow, and Santa is an old-fashioned typer! But I cherish every single word you send me!`
  }
];

export function getSantaReply(userText: string, profile?: ChildProfile): string {
  const p: ChildProfile = profile || {
    name: 'Tommy',
    age: 6,
    gender: 'boy',
    hobby: 'chơi đồ chơi',
    favoriteFood: 'bánh quy sô-cô-la',
    goodHabit: 'chăm ngoan, lễ phép',
    badHabit: 'đi ngủ đúng giờ',
    dreamGift: 'món quà bất ngờ',
    behaviorStatus: 'nice'
  };

  const normalized = normalizeText(userText);
  const userLangIsVi = isVietnamese(userText);

  // Match against intelligent intent dictionary
  for (const intent of INTENTS) {
    const matched = intent.keywords.some(kw => {
      const normKw = normalizeText(kw);
      return normalized.includes(normKw);
    });

    if (matched) {
      return userLangIsVi ? intent.replyVi(p) : intent.replyEn(p);
    }
  }

  // Intelligent context-aware fallback based on language
  if (userLangIsVi) {
    const viFallbacks = [
      `Ho ho ho! Bác đọc được tin nhắn của ${p.name} rồi! Ngoài trời tuyết Bắc Cực đang bay phấp phới, nghe tin nhắn của con làm ông thấy vui vẻ hẳn lên! Con có muốn hỏi ông điều gì về xưởng quà hay chú tuần lộc Rudolph không?`,
      `Ho ho ho! Lời nhắn của ${p.name} thật ngọt ngào! Ông đang ngồi ghi chép lại những điều ước Giáng Sinh đây. Hãy luôn ngoan ngoãn và nghe lời bố mẹ để nhận được những điều kỳ diệu nhất nhé!`,
      `Ho ho ho! Tiếng chuông xe trượt tuyết đang ngân vang vui vẻ ngoài hiên nhà ông! Ông Già Noel chúc ${p.name} luôn vui tươi, chăm ngoan và tràn ngập niềm vui mỗi ngày!`
    ];
    return viFallbacks[Math.floor(Math.random() * viFallbacks.length)];
  } else {
    const enFallbacks = [
      `Ho ho ho! I received your lovely message, ${p.name}! Listening to the jingle bells outside my snowy window always reminds me of wonderful children like you! Would you like to ask me about my reindeer or the North Pole toy workshop?`,
      `Ho ho ho! What a sweet message! I was just making my list and checking it twice with my head elf! Keep spreading kindness and smiles, Christmas magic is right around the corner!`,
      `Ho ho ho! Rudolph just stamped his hooves happily in the snow! Thank you for brightening up the North Pole with your words, ${p.name}!`
    ];
    return enFallbacks[Math.floor(Math.random() * enFallbacks.length)];
  }
}
