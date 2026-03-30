import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon?: LucideIcon
  color: 'blue' | 'red' | 'orange' | 'green' | 'yellow'
  borderColor: string
}

export function StatsCard({ title, value, description, icon: Icon, color, borderColor }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    orange: 'bg-orange-50 text-orange-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700'
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 text-center border-t-4 ${borderColor}`}>
      {Icon && (
        <div className="flex justify-center mb-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      )}
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-sm sm:text-base text-gray-600 font-medium">{title}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )
}