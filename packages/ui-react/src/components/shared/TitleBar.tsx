import { Button } from '../ui/button'

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
      <h1 className="text-2xl font-bold">{title}</h1>
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
              <div className="flex items-center gap-xxs">
                {action.icon && <span className="material-symbols-rounded">{action.icon}</span>}
                <span className="text-base">{action.text}</span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
