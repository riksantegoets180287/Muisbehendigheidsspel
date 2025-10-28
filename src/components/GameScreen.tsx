import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { playSuccessSound, playErrorSound } from '../lib/sounds';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: 'blue' | 'orange';
}

interface GameScreenProps {
  level: number;
  onLevelComplete: (points: number) => void;
  onGameOver: () => void;
}

export default function GameScreen({ level, onLevelComplete, onGameOver }: GameScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(10000);
  const [ball, setBall] = useState<Ball | null>(null);
  const [lives, setLives] = useState(5);
  const [clickResult, setClickResult] = useState<{ type: 'success' | 'error'; points?: number } | null>(null);
  const [showLevelPopup, setShowLevelPopup] = useState(level === 5);
  const [levelComplete, setLevelComplete] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  const CONTAINER_WIDTH = 800;
  const CONTAINER_HEIGHT = 500;

  useEffect(() => {
    if (showLevelPopup) return;
    setLevelComplete(false);
    setTimeRemaining(10000);
    setEarnedPoints(0);
    initializeBall();
    startTimeRef.current = Date.now();
  }, [level, showLevelPopup]);

  const initializeBall = () => {
    const baseRadius = 50;
    const minRadius = 15;
    const radius = Math.max(minRadius, baseRadius - (level - 1) * 2);

    const baseSpeed = 2;
    const speed = baseSpeed + (level - 1) * 0.3;

    const angle = Math.random() * Math.PI * 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const color = level >= 5 ? (Math.random() < 0.5 ? 'blue' : 'orange') : 'blue';

    const padding = radius + 20;
    const randomX = padding + Math.random() * (CONTAINER_WIDTH - padding * 2);
    const randomY = padding + Math.random() * (CONTAINER_HEIGHT - padding * 2);

    setBall({
      x: randomX,
      y: randomY,
      vx,
      vy,
      radius,
      color,
    });
  };

  useEffect(() => {
    if (showLevelPopup || levelComplete) return;

    const animate = () => {
      setBall((prevBall) => {
        if (!prevBall) return prevBall;

        let newX = prevBall.x + prevBall.vx;
        let newY = prevBall.y + prevBall.vy;
        let newVx = prevBall.vx;
        let newVy = prevBall.vy;

        if (newX - prevBall.radius < 0 || newX + prevBall.radius > CONTAINER_WIDTH) {
          newVx = -newVx;
          newX = Math.max(prevBall.radius, Math.min(CONTAINER_WIDTH - prevBall.radius, newX));
        }

        if (newY - prevBall.radius < 0 || newY + prevBall.radius > CONTAINER_HEIGHT) {
          newVy = -newVy;
          newY = Math.max(prevBall.radius, Math.min(CONTAINER_HEIGHT - prevBall.radius, newY));
        }

        return {
          ...prevBall,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showLevelPopup, levelComplete]);

  useEffect(() => {
    if (showLevelPopup || levelComplete) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          handleTimeout();
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showLevelPopup, levelComplete]);

  const handleTimeout = () => {
    setLevelComplete(true);
    setEarnedPoints(0);
  };

  const handleBallClick = (e: React.MouseEvent) => {
    if (!ball || levelComplete) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const distance = Math.sqrt((clickX - ball.x) ** 2 + (clickY - ball.y) ** 2);

    if (distance <= ball.radius) {
      const isLeftClick = e.button === 0;
      const isRightClick = e.button === 2;

      if (level >= 5) {
        const correctClick =
          (ball.color === 'blue' && isLeftClick) || (ball.color === 'orange' && isRightClick);

        if (!correctClick) {
          playErrorSound();
          setClickResult({ type: 'error' });
          setLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setTimeout(() => onGameOver(), 500);
            }
            return newLives;
          });
          setTimeout(() => setClickResult(null), 500);
          return;
        }
      }

      const remainingMs = timeRemaining;
      const points = Math.ceil(10 * (remainingMs / 10000));

      playSuccessSound();
      setClickResult({ type: 'success', points });
      setEarnedPoints(points);
      setLevelComplete(true);

      setTimeout(() => {
        setClickResult(null);
      }, 1000);
    }
  };

  const handleNextLevel = () => {
    onLevelComplete(earnedPoints);
  };

  const handlePopupContinue = () => {
    setShowLevelPopup(false);
  };

  if (showLevelPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Level 5 bereikt!
          </h2>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded mb-6">
            <h3 className="font-semibold mb-3 text-orange-900 text-lg">
              Extra regel:
            </h3>
            <p className="text-orange-800 mb-2">
              <span className="inline-block w-6 h-6 bg-blue-500 rounded-full mr-2 align-middle"></span>
              <strong>Blauw</strong> = linksklik
            </p>
            <p className="text-orange-800">
              <span className="inline-block w-6 h-6 bg-orange-500 rounded-full mr-2 align-middle"></span>
              <strong>Oranje</strong> = rechtsklik
            </p>
          </div>

          <button
            onClick={handlePopupContinue}
            className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Begrepen, start level 5!
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex items-center justify-between w-full max-w-4xl">
        <div className="text-2xl font-bold text-gray-800">
          Level {level} / 20
        </div>

        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-8 h-8 ${
                i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="text-2xl font-bold text-gray-800">
          Tijd: {(timeRemaining / 1000).toFixed(1)}s
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-4 relative">
        <div
          ref={containerRef}
          className="relative bg-slate-100 rounded-lg overflow-hidden cursor-crosshair"
          style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
          onMouseDown={handleBallClick}
          onContextMenu={(e) => {
            e.preventDefault();
            handleBallClick(e as any);
          }}
        >
          <AnimatePresence>
            {ball && !levelComplete && (
              <motion.div
                className={`absolute rounded-full ${
                  ball.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                } shadow-lg`}
                style={{
                  left: ball.x - ball.radius,
                  top: ball.y - ball.radius,
                  width: ball.radius * 2,
                  height: ball.radius * 2,
                }}
                animate={
                  clickResult?.type === 'success'
                    ? { scale: [1, 1.3, 1] }
                    : clickResult?.type === 'error'
                    ? { x: [-5, 5, -5, 5, 0] }
                    : {}
                }
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {clickResult?.type === 'success' && clickResult.points && ball && (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, y: -50, scale: 1.5 }}
                exit={{ opacity: 0 }}
                className="absolute text-green-600 font-bold text-3xl pointer-events-none"
                style={{
                  left: ball.x,
                  top: ball.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                +{clickResult.points}
              </motion.div>
            )}
          </AnimatePresence>

          {levelComplete && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg p-8 text-center"
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Level {level} voltooid!
                </h3>
                <p className="text-4xl font-bold text-blue-600 mb-6">
                  {earnedPoints} {earnedPoints === 1 ? 'punt' : 'punten'}
                </p>
                <button
                  onClick={handleNextLevel}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  {level < 20 ? 'Volgende level' : 'Bekijk resultaat'}
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {level >= 5 && (
        <div className="mt-4 flex gap-6 text-lg font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Linksklik</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">Rechtsklik</span>
          </div>
        </div>
      )}
    </div>
  );
}
