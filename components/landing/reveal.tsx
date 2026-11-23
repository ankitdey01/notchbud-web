"use client";

import * as React from "react";

// Scroll-reveal animations removed: renders children directly, no
// IntersectionObserver, no transition. `delay` stays accepted (ignored)
// so existing call sites keep typechecking untouched.
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}
