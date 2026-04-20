import * as React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "../../lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-[#A7738B] text-white hover:bg-[#976077] shadow-[0_8px_20px_rgb(167,115,139,0.25)]",
      secondary: "bg-[#A3B096] text-white hover:bg-[#92a184] shadow-[0_8px_20px_rgb(163,176,150,0.25)]",
      outline: "border-2 border-[#A7738B] text-[#A7738B] hover:bg-[#A7738B]/5",
      ghost: "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
    };

    const sizes = {
      sm: "h-10 px-4 text-sm",
      md: "h-14 px-8 text-[15px] font-medium tracking-wide",
      lg: "h-16 px-10 text-base font-semibold",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        whileHover={{ y: -1 }}
        className={cn(
          "inline-flex w-full items-center justify-center rounded-tl-[24px] rounded-br-[24px] rounded-tr-[4px] rounded-bl-[4px] transition-all focus:outline-none focus:ring-2 focus:ring-[#A7738B]/50 focus:ring-offset-2 font-sans font-medium",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
