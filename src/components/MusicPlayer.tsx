import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { tracks } from '../lib/tracks';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleEnded = () => skipForward();

  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto w-full px-4">
      <audio 
        ref={audioRef} 
        src={track.url} 
        onEnded={handleEnded}
      />
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/3">
        <img 
          src={track.coverUrl} 
          alt="cover" 
          className="w-14 h-14 rounded shadow-[0_0_10px_rgba(232,121,249,0.3)] border border-fuchsia-500/30 object-cover" 
        />
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.8)] truncate">
            {track.title}
          </span>
          <span className="text-xs text-fuchsia-400/70 truncate">
            {track.artist}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 w-1/3">
        <button 
          onClick={skipBack} 
          className="text-cyan-400 hover:text-cyan-200 transition-colors duration-200"
          aria-label="Previous track"
        >
          <SkipBack size={24} />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:bg-cyan-500/20 hover:scale-105 transition-all duration-200"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={24} className="fill-current" />
          ) : (
            <Play size={24} className="fill-current ml-1" />
          )}
        </button>
        <button 
          onClick={skipForward} 
          className="text-cyan-400 hover:text-cyan-200 transition-colors duration-200"
          aria-label="Next track"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-end gap-3 w-1/3 text-cyan-400">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1 appearance-none bg-cyan-900 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_#22d3ee] cursor-pointer"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
