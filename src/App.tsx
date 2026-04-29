/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-6 text-center relative z-10">
        <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          NEON SYNTH SNAKE
        </h1>
        <p className="text-cyan-400 text-sm tracking-[0.2em] uppercase mt-2 opacity-80 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
          AI Beats & Arcade Classics
        </p>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <SnakeGame />
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-fuchsia-900/10 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* Footer Music Player */}
      <footer className="relative z-20 w-full bg-slate-950/90 backdrop-blur-md border-t border-cyan-900/50 p-4 shadow-[0_-10px_30px_rgba(34,211,238,0.05)]">
        <MusicPlayer />
      </footer>
    </div>
  );
}
