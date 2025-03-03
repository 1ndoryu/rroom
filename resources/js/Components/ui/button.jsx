// resources/js/Components/ui/button.jsx

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[100px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-primary hover:bg-primary/90 hover:text-[--black]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background  hover:bg-accent hover:text-accent-foreground hover:border-[#000] hover:border-[1px]",
        secondary: "bg-[--black] text-[--white] hover:bg-secondary/80 hover:text-[--black] hover:border-[#666] hover:border-[1px] border-['transparent'] border-[1px]",
        ghost: "hover:bg-accent hover:text-accent-foreground text-[--black]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[100px] px-3 text-xs",
        lg: "h-10 rounded-[100px] px-8",
        icon: "h-9 w-9 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
