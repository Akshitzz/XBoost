"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function LineShadowText({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}) {
  const MotionComponent = motion(Component);
  const content = typeof children === "string" ? children : null;

  if (!content) {
    throw new Error("LineShadowText only accepts string content");
  }

  return (
    <MotionComponent
      style={{
        "--shadow-color": shadowColor,
      }}
      className={cn(
        "relative z-0 inline-flex whitespace-nowrap",  // Prevents line breaks
        "after:absolute after:left-[0.06em] after:top-[0.04em]",  // Adjusted for smaller text sizes
        "after:content-[attr(data-text)]",
        "after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)]",
        "after:-z-10 after:bg-[length:0.05em_0.05em]",  // Adjusted for smaller sizes
        "after:bg-clip-text after:text-transparent",
        "after:animate-line-shadow",
        className
      )}
      data-text={content}
      {...props}
    >
      {content}
    </MotionComponent>
  );
}
