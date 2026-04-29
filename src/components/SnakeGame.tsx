import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Play, RotateCcw, Ghost } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 180;

interface Point { x: number; y: number; }

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Point>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsStarted(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isStarted || gameOver) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        resetGame();
      }
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    const { x, y } = directionRef.current;
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': 
        if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 }; break;
      case 'ArrowDown': case 's': case 'S': 
        if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 }; break;
      case 'ArrowLeft': case 'a': case 'A': 
        if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 }; break;
      case 'ArrowRight': case 'd': case 'D': 
        if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 }; break;
    }
  }, [isStarted, gameOver, generateFood]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameTick = useCallback(() => {
    if (!isStarted || gameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      directionRef.current = nextDirectionRef.current;
      const { x: dx, y: dy } = directionRef.current;
      
      const newHead = { x: head.x + dx, y: head.y + dy };
      
      // Collision with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }
      
      // Collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];
      
      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setSpeed(s => Math.max(s - 5, 50)); // Increase speed slightly
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [isStarted, gameOver, food, score, highScore, generateFood]);

  useEffect(() => {
    if (isStarted && !gameOver) {
      gameLoopRef.current = window.setInterval(gameTick, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isStarted, gameOver, speed, gameTick]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Board */}
      <div className="flex gap-8 items-center text-cyan-400 bg-slate-900/80 px-8 py-3 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
        <div className="flex items-center gap-2">
          <Ghost size={20} className="text-fuchsia-400" />
          <span className="font-mono text-xl tracking-wider text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="w-px h-6 bg-cyan-500/30" />
        <div className="flex items-center gap-2 text-cyan-500/70">
          <Trophy size={18} />
          <span className="font-mono text-lg">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative p-1 rounded-sm bg-gradient-to-br from-cyan-500 via-slate-800 to-fuchsia-500 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
        <div 
          className="bg-slate-950 grid relative overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 450px)',
            height: 'min(80vw, 450px)'
          }}
        >
          {/* Subtle Grid backdrop */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
            style={{
              backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
              backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
            }} 
          />

          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isFood = food.x === x && food.y === y;
            const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
            const isHead = snakeIndex === 0;
            const isBody = snakeIndex > 0;

            return (
              <div key={i} className="w-full h-full relative z-10 flex items-center justify-center">
                {isFood && (
                  <div className="w-3/4 h-3/4 bg-fuchsia-500 rounded-full animate-pulse shadow-[0_0_10px_#e879f9]" />
                )}
                {isHead && (
                  <div className="w-full h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] rounded-sm" />
                )}
                {isBody && (
                  <div className="w-[90%] h-[90%] bg-cyan-600/80 rounded-sm" />
                )}
              </div>
            );
          })}

          {/* Overlays */}
          {(!isStarted || gameOver) && (
            <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              {gameOver ? (
                <>
                  <h2 className="text-4xl font-black mb-2 text-fuchsia-500 drop-shadow-[0_0_15px_#e879f9]">GAME OVER</h2>
                  <p className="text-cyan-400 mb-6 font-mono text-lg tracking-widest">SCORE: {score}</p>
                </>
              ) : (
                <h2 className="text-3xl font-black mb-6 text-cyan-400 drop-shadow-[0_0_15px_#22d3ee]">READY?</h2>
              )}
              
              <button 
                onClick={resetGame}
                className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 px-6 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)]"
              >
                {gameOver ? <RotateCcw size={20} /> : <Play size={20} className="fill-slate-950" />}
                {gameOver ? 'Try Again' : 'Start'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Keyboard Hint */}
      <div className="text-cyan-500/50 text-sm font-mono tracking-widest">
        USE ARROW KEYS OR WASD
      </div>
    </div>
  );
}
