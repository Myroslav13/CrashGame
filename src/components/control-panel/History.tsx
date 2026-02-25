import type { HistoryItem } from "../interfaces";

interface HistoryProps {
  items: HistoryItem[];
}

function History({ items }: HistoryProps) {
  return (
    <div className="mt-4 sm:mt-8 lg:mt-4 2xl:mt-12">
      <h3>History</h3>
      <div className="history-container">
        {items.length === 0 ? (
          <p>No games played yet</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`history-item ${
                item.isWin
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}
            >
              x{item.multiplier.toFixed(2)}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default History