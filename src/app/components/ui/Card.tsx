import * as React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -2, scale: 1.01 } : {}}
        whileTap={hoverable ? { scale: 0.98 } : {}}
        className={cn(
          "bg-white rounded-tl-[32px] rounded-br-[32px] rounded-tr-md rounded-bl-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden",
          hoverable && "cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
