interface ProgressBarProps {
  progress: number
  color?: string
  showLabel?: boolean
  currentAmount?: number
  totalAmount?: number
}

export function ProgressBar({ progress, color = '#12498b', showLabel = true, currentAmount, totalAmount }: ProgressBarProps) {
  return (
    <div className="mb-4">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Payment Progress</span>
          <span className="text-sm font-bold" style={{ color }}>{progress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${progress}%`, backgroundColor: color }}
        ></div>
      </div>
      {currentAmount !== undefined && totalAmount !== undefined && (
        <p className="text-xs text-gray-600 mt-2">
          ₹{currentAmount.toLocaleString()} / ₹{totalAmount.toLocaleString()}
        </p>
      )}
    </div>
  )
}