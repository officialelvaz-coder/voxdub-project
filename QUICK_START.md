# 🚀 VoxDub - Quick Start Guide

## Run the Project
```bash
npm install
npm run dev
```
Open: `http://localhost:5173`

---

## 🎯 Most Important Files

### 1. **Data (Easiest to Edit)**
📄 `/src/app/data/mockData.ts`
- Voice artists data
- Projects data
- Notifications
- Statistics

### 2. **Pages**
📁 `/src/app/pages/`
- `Landing.tsx` - Homepage
- `Login.tsx` - Login page
- `Dashboard.tsx` - Main dashboard
- `Artists.tsx` - Voice artists management
- 14 more pages...

### 3. **Routing**
📄 `/src/app/routes.ts`
- All page routes
- Navigation structure

### 4. **Styling**
📄 `/src/styles/theme.css`
- Colors (brown/orange theme)
- Fonts
- RTL support

---

## ✏️ Quick Edits

### Add Audio Sample to Artist
1. Put audio file in `public/audio/artist-name.mp3`
2. Edit `/src/app/data/mockData.ts`:
```typescript
{
  id: '1',
  name: 'Artist Name',
  // ... other fields
  sampleAudio: '/audio/artist-name.mp3' // ⭐ Add this
}
```

### Add New Artist
Edit `/src/app/data/mockData.ts`:
```typescript
export const voiceArtists: VoiceArtist[] = [
  // ... existing artists
  {
    id: '6',
    name: 'New Artist',
    specialty: 'Voice Acting',
    languages: ['Arabic'],
    rating: 4.8,
    completedProjects: 50,
    hourlyRate: 7000,
    avatar: '',
    bio: 'Professional voice artist',
    sampleAudio: '/audio/new-artist.mp3'
  }
];
```

### Change Colors
Edit `/src/styles/theme.css`:
```css
--color-primary: oklch(0.65 0.15 30); /* Change this */
```

---

## 📱 Navigation Structure

```
/ ..................... Landing page
/login ................ Login/Signup
/dashboard ............ Main dashboard
  ├─ /new-project ..... Create project
  ├─ /artists ......... Voice artists
  ├─ /analytics ....... Statistics
  ├─ /notifications ... Alerts
  └─ ... 10+ more pages
```

---

## 🎵 Audio Player

Audio player is integrated in `/dashboard/artists`
- Click "استماع للعينة الصوتية" to play
- Supports MP3, WAV, OGG formats
- Place files in `public/audio/`

---

## 🎨 Features Included

✅ 17 fully designed pages
✅ RTL Arabic support
✅ Brown/Orange color scheme
✅ Mock data for testing
✅ React Router navigation
✅ Responsive design
✅ Audio playback system
✅ Dashboard with statistics
✅ Project management workflow
✅ Voice artist database

---

## 📦 Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Recharts** - Charts
- **Sonner** - Notifications

---

## 🐛 Troubleshooting

**Audio not playing?**
- Check file exists in `public/audio/`
- Verify path: `/audio/filename.mp3`
- Test direct access: `http://localhost:5173/audio/filename.mp3`

**Changes not showing?**
- Save file (Ctrl+S)
- Wait for auto-reload
- Hard refresh (Ctrl+F5)

**Build errors?**
- Check console (F12)
- Verify syntax (brackets, quotes)
- Review TypeScript types

---

## 📚 Next Steps

1. **Add real data:** Replace mock data with yours
2. **Customize colors:** Edit `theme.css`
3. **Add audio files:** Upload to `public/audio/`
4. **Deploy:** Use Vercel/Netlify for free hosting
5. **Add backend:** Connect Supabase if needed

---

**Good luck with your graduation project! 🎓**
