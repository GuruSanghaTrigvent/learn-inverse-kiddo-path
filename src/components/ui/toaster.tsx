
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            // Add extra styling for error toasts
            className={variant === "destructive" ? "border-2 border-destructive" : ""}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className={variant === "destructive" ? "text-destructive font-bold" : ""}>
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className={variant === "destructive" ? "text-destructive-foreground/90" : ""}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
