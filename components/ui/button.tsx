import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Kumo content-text-size: every button label is 14px (text-sm).
// Kumo hover-color-transitions: hovers apply instantly â€” no color transition.
// Press feedback is scale-only via `.pressable` (see globals.css).
const buttonVariants = cva(
  "focus-ring pressable inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-gloss-blue text-white",
        secondary: "bg-brand-950/[0.06] text-brand-950 hover:bg-brand-950/10",
        ghost: "text-slate-600 hover:text-brand-950 hover:bg-brand-500/10",
        outline: "bg-white/60 ring-1 ring-kumo-line text-brand-950 hover:bg-kumo-tint",
      },
      size: {
        default: "h-11 px-6 py-2 has-[svg]:ps-[22px]",
        sm: "h-9 px-4 has-[svg]:ps-3.5",
        lg: "h-[52px] px-8 has-[svg]:ps-7",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  static?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, static: isStatic, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), isStatic && "is-static", className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
