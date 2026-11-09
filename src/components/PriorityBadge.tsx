import { Priority } from '../types/task'

interface PriorityBadgeProps {
  priority: Priority
}

const config: Record<Priority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low: { label: 'Low', className: 'bg-green-100 text-green-700 border-green-200' },
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, className } = config[priority]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}
      data-testid="priority-badge"
    >
      {label}
    </span>
  )
}
