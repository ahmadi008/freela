import { cn } from '../utils/helpers.js'

export default function LoadingSpinner({ size = 'md', label, className }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  }
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn(
        sizes[size],
        'animate-spin rounded-full border-brand-200 border-t-brand-600'
      )} />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  )
}
