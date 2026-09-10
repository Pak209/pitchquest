"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-mint text-navy shadow-glow hover:bg-mint-soft",
        secondary: "bg-sky-500/90 text-white hover:bg-sky-400",
        outline: "border-2 border-navy-elev bg-navy-card text-white hover:bg-navy-elev",
        ghost: "bg-transparent text-white hover:bg-white/10",
        danger: "bg-rose-500 text-white hover:bg-rose-400",
        soft: "bg-navy-elev text-star hover:bg-navy-card",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-3xl px-8 text-lg",
        xl: "h-16 rounded-3xl px-8 text-xl",
        icon: "h-12 w-12",
        tile: "h-auto min-h-[4.5rem] w-full rounded-2xl px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";
