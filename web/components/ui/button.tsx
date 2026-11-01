import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover",
  secondary: "border-border-strong bg-surface-2 text-foreground hover:bg-border",
  outline: "border-border-strong bg-card text-foreground hover:border-foreground/40 hover:bg-surface",
  ghost: "border-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground",
  accent: "border-highlight-hover bg-highlight text-highlight-foreground hover:bg-highlight-hover",
  danger: "border-danger bg-danger text-white hover:opacity-90 dark:text-background",
};

const sizes: Record<Size, string> = {
  sm: "h-9 pointer-coarse:h-10 px-3 text-sm gap-1.5 rounded-md",
  md: "h-11 px-4 text-sm gap-2 rounded-md",
  lg: "h-12 px-5 text-base gap-2 rounded-md",
  icon: "size-11 rounded-md",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center border font-semibold whitespace-nowrap transition-colors duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ variant = "primary", size = "md", asChild, className, type, ...props }: ButtonProps) {
  if (asChild) return <Slot.Root className={buttonClass(variant, size, className)} {...props} />;
  return <button type={type ?? "button"} className={buttonClass(variant, size, className)} {...props} />;
}
