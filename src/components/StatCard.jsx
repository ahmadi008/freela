import { cn } from '../utils/helpers.js'

export default function StatCard({ icon: Icon, label, value, trend, color = 'brand', className }) {
  const colors = {
    brand:  'bg-brand-50  text-brand-600',
    green:  'bg-green-50  text-green-600',
    amber:  'bg-amber-50  text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    red:    'bg-red-50    text-red-600',
  }
  return (
    <div className={cn('card flex items-start gap-4', className)}>
      {Icon && (
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', colors[color])}>
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
      </div>
    </div>
  )
}
