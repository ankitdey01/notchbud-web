import * as React from "react";
import { cn } from "@/lib/utils";

// Kumo LayerCard: ring (never border) + drop shadow, optical padding (px > py).
// Kumo related-text-spacing: title + description stay tight (gap-1.5),
// the card keeps a larger gap to siblings (parent grid gap-6).
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "card-flat rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,55,115,0.08)] ring-1 ring-kumo-line",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("grid gap-1.5 px-5 pt-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

// Kumo heading-case: sentence case (enforced by content, not CSS).
// Kumo content-text-size: headings may use 16px+; card titles use 16px semibold.
// Kumo font-tracking: no tracking-* classes. Kumo font-weight: semibold, never bold.
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-base font-semibold text-brand-950", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

// Kumo content-text-size: body is always 14px (text-sm).
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm leading-relaxed text-slate-600", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

// Kumo text-spacing: vertical padding stays smaller than horizontal (px-5 pb-4).
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-5 pb-4 pt-2", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
