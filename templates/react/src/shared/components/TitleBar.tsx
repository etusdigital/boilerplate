import { Button } from '@/components/ui/button'

export interface TitleBarAction {
  key: string
  text: string
  icon?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick: () => void
}

interface TitleBarProps {
  title: string
  actions?: TitleBarAction[]
}

export function TitleBar({ title, actions }: TitleBarProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold capitalize">{title}</h1>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <Button
              key={action.key}
              variant={action.variant || 'default'}
              size={action.size || 'lg'}
              disabled={action.disabled}
              onClick={action.onClick}
              className="whitespace-nowrap"
            >
              {action.icon && (
                <span className="material-symbols-rounded text-xl">{action.icon}</span>
              )}
              {action.text}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
