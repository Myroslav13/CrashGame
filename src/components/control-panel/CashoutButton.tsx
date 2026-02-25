interface CashoutButtonProps {
  onCashout: () => void;
  disabled: boolean;
  currentWin: number;
}

function CashoutButton({ onCashout, disabled, currentWin }: CashoutButtonProps) {
  return (
    <button
      onClick={onCashout}
      disabled={disabled}
      className={`button ${
        disabled
          ? 'button-disabled'
          : 'bg-yellow-500 hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]'
      }`}
    >
      CASHOUT (Win: {currentWin.toFixed(2)})
    </button>
  )
}

export default CashoutButton;