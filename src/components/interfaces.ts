export interface HistoryItem {
  id: string;
  multiplier: number;
  isWin: boolean;
}

export type GameStatus = 'idle' | 'running' | 'cashed_out' | 'crashed';