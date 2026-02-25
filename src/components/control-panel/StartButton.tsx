interface StartButtonProps {
  onStart: () => void;
  disabled: boolean;
}

function StartButton({ onStart, disabled }: StartButtonProps) {
  return (
    <button
      onClick={onStart}
      disabled={disabled}
      className={`button ${
        disabled
          ? 'button-disabled'
          : 'button-enabled bg-green-500 hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
      }`}
    >
      START GAME
    </button>
  )
}

export default StartButton;