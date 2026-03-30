interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase()
    
    if (statusLower.includes('completed') || statusLower.includes('done')) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: 'Completed'
      }
    } else if (statusLower.includes('ongoing') || statusLower.includes('in-progress') || statusLower.includes('progress')) {
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        label: 'Ongoing'
      }
    } else if (statusLower.includes('upcoming') || statusLower.includes('scheduled')) {
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        label: 'Upcoming'
      }
    } else {
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Pending'
      }
    }
  }

  const config = getStatusConfig(status)
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'

  return (
    <span className={`${config.bg} ${config.text} ${sizeClasses} rounded-full font-semibold`}>
      {config.label}
    </span>
  )
}