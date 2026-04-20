import * as React from "react"
import { cn } from "../../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md border-2 border-gray-100 bg-white px-5 text-[15px] placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#A7738B] focus-visible:ring-4 focus-visible:ring-[#A7738B]/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
