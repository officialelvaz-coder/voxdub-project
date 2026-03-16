import { useState } from 'react';
import { Play, Pause, Star, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface VoiceArtist {
  id: number;
  name: string;
  gender: 'ذكر' | 'أنثى';
  style: string;
  rating: number;
  reviews: number;
  specialties: string[];
  experience: string;
  language: string;
}

const voiceArtists: VoiceArtist[] = [
  {
    id: 1,
    name: 'بلهادي محمد إسلام',
    gender: 'ذكر',
    style: 'صوت عميق وقوي',
    rating: 4.9,
    reviews: 127,
    specialties: ['إعلانات تجارية', 'وثائقي', 'تعليقات رياضية'],
    experience: '8 سنوات',
    language: 'عربي فصحى'
  },
  {
    id: 2,
    name: 'آدم حمدوني',
    gender: 'ذكر',
    style: 'صوت دافئ وجذاب',
    rating: 5.0,
    reviews: 156,
    specialties: ['أفلام ووثائقيات', 'إعلانات', 'سرد قصصي'],
    experience: '10 سنوات',
    language: 'عربي فصحى وعامية'
  },
  {
    id: 3,
    name: 'مصطفى جغلال',
    gender: 'ذكر',
    style: 'صوت احترافي ومتزن',
    rating: 4.9,
    reviews: 143,
    specialties: ['تقارير إخبارية', 'محتوى مؤسسي', 'تدريب'],
    experience: '12 سنة',
    language: 'عربي فصحى وإنجليزي'
  },
  {
    id: 4,
    name: 'منال إبراهيمي',
    gender: 'أنثى',
    style: 'صوت ناعم وواضح',
    rating: 4.8,
    reviews: 98,
    specialties: ['برامج تلفزيونية', 'كتب صوتية', 'تطبيقات تعليمية'],
    experience: '6 سنوات',
    language: 'عربي فصحى'
  },
  {
    id: 5,
    name: 'أحمد حاج إسماعيل',
    gender: 'ذكر',
    style: 'صوت قوي وواضح',
    rating: 4.7,
    reviews: 82,
    specialties: ['إعلانات شبابية', 'برامج إذاعية', 'محتوى رقمي'],
    experience: '5 سنوات',
    language: 'عربي فصحى'
  }
];

export function VoiceArtists() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      // في التطبيق الحقيقي، سيتم تشغيل ملف صوتي
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  return (
    <section id="voices" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4 text-gray-900">معلقونا الصوتيون</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اختر الصوت المثالي لمشروعك من بين نخبة من المعلقين المحترفين
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voiceArtists.map((artist) => (
            <Card key={artist.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl mb-1 text-gray-900">{artist.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{artist.style}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{artist.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({artist.reviews} تقييم)</span>
                  </div>
                </div>
                <div className="bg-amber-100 p-2 rounded-full">
                  <Award className="size-5 text-amber-700" />
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">النوع:</span>
                  <Badge variant="secondary">{artist.gender}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">الخبرة:</span>
                  <span className="font-medium">{artist.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">اللغة:</span>
                  <span className="font-medium">{artist.language}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">التخصصات:</p>
                <div className="flex flex-wrap gap-2">
                  {artist.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant={playingId === artist.id ? "secondary" : "outline"}
                className="w-full"
                onClick={() => togglePlay(artist.id)}
              >
                {playingId === artist.id ? (
                  <>
                    <Pause className="size-4 ml-2" />
                    جاري التشغيل...
                  </>
                ) : (
                  <>
                    <Play className="size-4 ml-2" />
                    استمع لعينة صوتية
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}