import { useState, useEffect } from 'react';
import { Play, Pause, Star, Award, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
// استيراد قاعدة البيانات من الملف الذي أنشأناه
import { db } from '../firebase'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface VoiceArtist {
  id: string; // تم تغييره إلى string ليتوافق مع معرفات Firebase
  name: string;
  gender: 'ذكر' | 'أنثى';
  style: string;
  rating: number;
  reviews: number;
  specialties: string[];
  experience: string;
  language: string;
  image?: string; // أضفنا حقل الصورة
  audio?: string; // أضفنا حقل الصوت
}

export function VoiceArtists() {
  const [artists, setArtists] = useState<VoiceArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // 1. دالة جلب البيانات من Firebase
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const q = query(collection(db, "artists"), orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        const fetchedArtists = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as VoiceArtist[];
        
        setArtists(fetchedArtists);
      } catch (error) {
        console.error("Error fetching artists: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // 2. دالة تشغيل الصوت الحقيقية
  const togglePlay = (artist: VoiceArtist) => {
    if (playingId === artist.id) {
      currentAudio?.pause();
      setPlayingId(null);
    } else {
      if (currentAudio) currentAudio.pause();
      
      const audioUrl = artist.audio || "/audio/default.mp3";
      const audio = new Audio(audioUrl);
      audio.play();
      setCurrentAudio(audio);
      setPlayingId(artist.id);
      
      audio.onended = () => setPlayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-vox-primary w-12 h-12 mb-4" />
        <p className="text-gray-500 font-bold">جاري تحميل أصوات المبدعين...</p>
      </div>
    );
  }

  return (
    <section id="voices" className="py-20 bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4 text-gray-900">معلقونا الصوتيون</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-bold">
            اختر الصوت المثالي لمشروعك من بين نخبة من المعلقين المحترفين
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Card key={artist.id} className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-vox-primary/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-black mb-1 text-gray-900">{artist.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 font-bold">{artist.style}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold">{artist.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">({artist.reviews} تقييم)</span>
                  </div>
                </div>
                <div className="bg-amber-100 p-2 rounded-full shrink-0">
                  <Award className="size-5 text-amber-700" />
                </div>
              </div>

              {/* صورة المعلق إذا وجدت */}
              {artist.image && (
                <div className="w-full h-48 mb-4 rounded-2xl overflow-hidden border-2 border-gray-100">
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-3 mb-4 text-right">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 font-bold">النوع:</span>
                  <Badge variant="secondary" className="font-bold">{artist.gender}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 font-bold">الخبرة:</span>
                  <span className="font-bold text-gray-900">{artist.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 font-bold">اللغة:</span>
                  <span className="font-bold text-gray-900">{artist.language}</span>
                </div>
              </div>

              <div className="mb-4 text-right">
                <p className="text-sm text-gray-600 mb-2 font-bold">التخصصات:</p>
                <div className="flex flex-wrap gap-2">
                  {artist.specialties?.map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs font-bold">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant={playingId === artist.id ? "default" : "outline"}
                className={`w-full h-12 font-black rounded-xl transition-all ${playingId === artist.id ? 'bg-stone-900' : ''}`}
                onClick={() => togglePlay(artist)}
              >
                {playingId === artist.id ? (
                  <>
                    <Pause className="size-5 ml-2" />
                    إيقاف مؤقت
                  </>
                ) : (
                  <>
                    <Play className="size-5 ml-2 fill-current" />
                    استمع للعينة
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
