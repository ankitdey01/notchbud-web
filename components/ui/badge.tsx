import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Kumo content-text-size: badge labels are 14px like all content text.
// Kumo hover-color-transitions: no transition-colors. Kumo font-tracking: no tracking-*.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-kumo-line",
  {
    variants: {
      variant: {
        default: "bg-white/70 text-brand-900 backdrop-blur",
        outline: "text-brand-900",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
