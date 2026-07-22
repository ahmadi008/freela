import { CheckCircle2, Info, XCircle, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { cn } from '../utils/helpers.js'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null

  const styles = {
    success: { bg: 'bg-green-50',  text: 'text-green-800',  ring: 'ring-green-200',  Icon: CheckCircle2 },
    info:    { bg: 'bg-blue-50',   text: 'text-blue-800',   ring: 'ring-blue-200',   Icon: Info },
    error:   { bg: 'bg-red-50',    text: 'text-red-800',    ring: 'ring-red-200',    Icon: XCircle },
  }
  const s = styles[toast.kind] || styles.info

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <div className={cn(
        'pointer-events-auto flex max-w-md items-center gap-3 rounded-xl px-4 py-3 shadow-lg ring-1 animate-slide-down',
        s.bg, s.text, s.ring
      )}>
        <s.Icon className="h-5 w-5 flex-shrink-0" />
        <p className="flex-1 text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  )
}
