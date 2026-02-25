import type { HistoryItem } from "../interfaces";

interface HistoryProps {
  items: HistoryItem[];
}

function History({ items }: HistoryProps) {
  return (
    <div className="mt-12">
      <h3>History</h3>
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <div
            key={item.id}
            className={`px-3 py-1 rounded-md text-sm font-bold border ${
              item.isWin
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}
          >
            x{item.multiplier.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default History