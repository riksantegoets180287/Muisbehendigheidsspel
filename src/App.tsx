import { useState, useEffect } from 'react';
import LoginDialog from './components/LoginDialog';
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import { supabase, GameResult } from './lib/supabase';

type GameState = 'login' | 'intro' | 'playing' | 'results' | 'game-over';

interface PlayerInfo {
  firstName: string;
  psNumber: string;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('login');
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [completedAt, setCompletedAt] = useState<string>('');

  const handleLogin = (firstName: string, psNumber: string) => {
    setPlayerInfo({ firstName, psNumber });
    setGameState('intro');
  };

  const handleStartGame = () => {
    setGameState('playing');
    setGameStartTime(Date.now());
    setCurrentLevel(1);
    setTotalScore(0);
  };

  const handleLevelComplete = (points: number) => {
    const newTotalScore = totalScore + points;
    setTotalScore(newTotalScore);

    if (currentLevel < 20) {
      setCurrentLevel(currentLevel + 1);
    } else {
      finishGame(newTotalScore);
    }
  };

  const handleGameOver = () => {
    finishGame(totalScore);
  };

  const finishGame = async (finalScore: number) => {
    const playTimeSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
    const now = new Date().toISOString();
    const percentage = (finalScore / 200) * 100;
    const passed = percentage >= 55;

    setCompletedAt(now);
    setGameState('results');

    if (playerInfo) {
      const result: GameResult = {
        first_name: playerInfo.firstName,
        ps_number: playerInfo.psNumber,
        total_score: finalScore,
        percentage: parseFloat(percentage.toFixed(2)),
        play_time_seconds: playTimeSeconds,
        passed,
        completed_at: now,
      };

      try {
        const { error } = await supabase.from('game_results').insert([result]);
        if (error) {
          console.error('Error saving result:', error);
        }
      } catch (error) {
        console.error('Error saving result:', error);
      }
    }
  };

  const handleRestart = () => {
    setGameState('intro');
    setCurrentLevel(1);
    setTotalScore(0);
  };

  const handleNewPerson = () => {
    setGameState('login');
    setPlayerInfo(null);
    setCurrentLevel(1);
    setTotalScore(0);
  };

  return (
    <>
      {gameState === 'login' && <LoginDialog onLogin={handleLogin} />}

      {gameState === 'intro' && <IntroScreen onStart={handleStartGame} />}

      {gameState === 'playing' && (
        <GameScreen
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          onGameOver={handleGameOver}
        />
      )}

      {gameState === 'results' && playerInfo && (
        <ResultsScreen
          firstName={playerInfo.firstName}
          psNumber={playerInfo.psNumber}
          totalScore={totalScore}
          playTimeSeconds={Math.floor((Date.now() - gameStartTime) / 1000)}
          completedAt={completedAt}
          onRestart={handleRestart}
          onNewPerson={handleNewPerson}
        />
      )}
    </>
  );
}

export default App;
