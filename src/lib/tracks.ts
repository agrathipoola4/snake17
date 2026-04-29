export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
}

export const tracks: Track[] = [
  {
    id: '1',
    title: 'Neon Odyssey',
    artist: 'AI Synthwave Bot',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: '2',
    title: 'Cyberpunk Drive',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b5665ce?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Algorithmic Harmony',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200&h=200',
  }
];
