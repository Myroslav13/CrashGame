import { useEffect, useRef } from 'react';
import { PixiGame } from '../game/PixiGame';
import type { GameStatus } from './interfaces';

interface GamePanelProps {
  status: GameStatus;
  settledMultiplier: number;
  onMultiplierChange: (multiplier: number) => void;
}

function GamePanel({ status, settledMultiplier, onMultiplierChange }: GamePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<PixiGame | null>(null);
  const multiplierChangeRef = useRef(onMultiplierChange);
  const isReadyRef = useRef(false);
  const statusRef = useRef(status);
  const settledMultiplierRef = useRef(settledMultiplier);
  const lastAppliedStatusRef = useRef<GameStatus>(status);

  statusRef.current = status;
  settledMultiplierRef.current = settledMultiplier;

  function applyGameState(nextStatus: GameStatus, nextSettledMultiplier: number) {
    const game = gameInstance.current;
    if (!game || !isReadyRef.current) return;

    if (nextStatus === 'running') {
      game.startGame();
      return;
    }

    if (nextStatus === 'cashed_out') {
      game.cashOutGame(nextSettledMultiplier);
      return;
    }

    if (nextStatus === 'crashed') {
      game.crashGame(nextSettledMultiplier);
      return;
    }

    game.resetVisuals();
  }

  useEffect(() => {
    multiplierChangeRef.current = onMultiplierChange;
  }, [onMultiplierChange]);

  useEffect(() => {
    if (!containerRef.current) return;
    let isDisposed = false;

    const game = new PixiGame(containerRef.current, (multiplier) => {
      multiplierChangeRef.current(multiplier);
    });
    gameInstance.current = game;
    game.init().then(() => {
      if (isDisposed) {
        game.destroy();
        return;
      }
      isReadyRef.current = true;
      applyGameState(statusRef.current, settledMultiplierRef.current);
      lastAppliedStatusRef.current = statusRef.current;
    });

    return () => {
      isDisposed = true;
      isReadyRef.current = false;
      game.destroy();
      gameInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (status === 'running' && lastAppliedStatusRef.current === 'running') {
      return;
    }

    applyGameState(status, settledMultiplier);
    lastAppliedStatusRef.current = status;
  }, [status, settledMultiplier]);

  return (
    <div 
      ref={containerRef} 
      className="game-panel"
    />
  )
}

export default GamePanel