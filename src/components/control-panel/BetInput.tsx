interface BetInputProps {
  bet: number;
  onBetChange: (newBet: number) => void;
  disabled: boolean;
}

function BetInput({ bet, onBetChange, disabled }: BetInputProps) {
  function handleDecrement() {
    onBetChange(Math.max(1, bet - 10));
  }

  function handleIncrement() {
    onBetChange(bet + 10);
  }

  return (
    <div className="mb-6">
      <h3>Bet Input</h3>
      <div className="bet-input-container">
        <input
          type="number"
          value={bet}
          onChange={(e) => onBetChange(Number(e.target.value))}
          disabled={disabled}
          className="bet-input-field"
          min="1"
          step="1"
        />
        <div className="flex gap-1 pr-1">
          <button
            onClick={handleDecrement}
            disabled={disabled}
            className="bet-change-btn"
          >
            -
          </button>
          <button
            onClick={handleIncrement}
            disabled={disabled}
            className="bet-change-btn"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default BetInput;