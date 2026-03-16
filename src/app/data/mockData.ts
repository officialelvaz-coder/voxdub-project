// يمكنك تغيير هذه القيمة لأي لون تريده (مثلاً: blue, green, purple, red, pink, sky)
export const themeColor = 'blue';

export interface VoiceArtist {
  id: string;
  name: string;
  specialty: string;
  languages: string[];
  rating: number;
  completedProjects: number;
  hourlyRate: number;
  avatar: string;
  bio: string;
  sampleAudio?: string;
  imageUrl?: string;
}

export const voiceArtists: VoiceArtist[] = [
  {
    id: '1',
    name: 'جغلال مصطفى',
    specialty: 'تعليق وثائقي واحترافي',
    languages: ['العربية'],
    rating: 5.0,
    completedProjects: 120,
    hourlyRate: 8000,
    avatar: '/images/mustapha.jpg',
    imageUrl: '/images/mustapha.jpg',
    bio: 'صوت رخيم ومميز جداً للوثائقيات والبرامج التعليمية بأسلوب جذاب ومشوق',
    sampleAudio: '/audio/mustapha-djoghlal.mp3'
  },
  {
    id: '2',
    name: 'لميس حميمي',
    specialty: 'إدارة وتأسيس - تعليق إعلاني',
    languages: ['العربية', 'الفرنسية'],
    rating: 4.9,
    completedProjects: 95,
    hourlyRate: 7500,
    avatar: '/images/lamis.jpg',
    imageUrl: '/images/lamis.jpg',
    bio: 'مؤسسة منصة VoxDub ومعلقة صوتية متخصصة في الإعلانات التجارية الفاخرة',
    sampleAudio: '/audio/lamis.mp3'
  },
  {
    id: '3',
    name: 'منال ابراهيمي',
    specialty: 'تعليق نسائي قوي',
    languages: ['العربية', 'الإنجليزية'],
    rating: 4.8,
    completedProjects: 178,
    hourlyRate: 8500,
    avatar: '/images/manal.jpg',
    imageUrl: '/images/manal.jpg',
    bio: 'معلقة صوتية متعددة المواهب مع خبرة واسعة في الكتب الصوتية',
    sampleAudio: '/audio/manal.mp3'
  },
  {
    id: '4',
    name: 'أحمد حاج إسماعيل',
    specialty: 'إعلانات إذاعية وتلفزيونية',
    languages: ['العربية'],
    rating: 4.9,
    completedProjects: 124,
    hourlyRate: 6500,
    avatar: '/images/ahmed.jpg',
    imageUrl: '/images/ahmed.jpg',
    bio: 'متخصص في الإعلانات السريعة والقوية التي تجذب الانتباه فوراً',
    sampleAudio: '/audio/ahmed.mp3'
  },
  {
    id: '5',
    name: 'بلهادي محمد إسلام',
    specialty: 'تعليق شبابي وحيوي',
    languages: ['العربية', 'الفرنسية'],
    rating: 4.9,
    completedProjects: 156,
    hourlyRate: 8000,
    avatar: '/images/belhadj.jpg',
    imageUrl: '/images/belhadj.jpg',
    bio: 'خامة صوتية شابة تناسب المحتوى الرقمي ومقاطع اليوتيوب السريعة',
    sampleAudio: '/audio/belhadj.mp3'
  },
  {
    id: '6',
    name: 'آدم حمدوني',
    specialty: 'دوبلاج وتمثيل صوتي',
    languages: ['العربية', 'الإنجليزية'],
    rating: 4.8,
    completedProjects: 132,
    hourlyRate: 7500,
    avatar: '/images/adam.jpg',
    imageUrl: '/images/adam.jpg',
    bio: 'متخصص في تقمص الشخصيات الكرتونية والدرامية ببراعة عالية',
    sampleAudio: '/audio/adam.mp3'
  },
  {
    id: '7',
    name: 'فاطمة',
    specialty: 'رد آلي وسرد قصصي',
    languages: ['العربية'],
    rating: 4.7,
    completedProjects: 65,
    hourlyRate: 5000,
    avatar: '/images/fatima.jpg',
    imageUrl: '/images/fatima.jpg',
    bio: 'صوت هادئ ومريح مثالي للردود الآلية وقراءة القصص الطويلة',
    sampleAudio: '/audio/fatima.mp3'
  },
  {
    id: '8',
    name: 'سارة',
    specialty: 'موشن جرافيك وإعلانات',
    languages: ['العربية'],
    rating: 4.7,
    completedProjects: 89,
    hourlyRate: 7200,
    avatar: '/images/sarah.jpg',
    imageUrl: '/images/sarah.jpg',
    bio: 'متخصصة في مرافقة فيديوهات الموشن جرافيك بأسلوب شرح مبسط وجذاب',
    sampleAudio: '/audio/sarah.mp3'
  }
];

export const projects: any[] = []; 
export const stats = { totalProjects: 156, activeProjects: 12, completedProjects: 144, totalRevenue: 1847000, monthlyRevenue: 234000, totalArtists: 8, averageRating: 4.8, clientSatisfaction: 96 };
export const notifications: any[] = [];
export const partners: any[] = [];