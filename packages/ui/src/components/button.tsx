import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Button — skinned to the Acme DS Button set (Figma node 4242:14161).
 *
 * Figma → shadcn variant mapping
 * ------------------------------
 * The Figma Button set has 6 axes (Type, Style, Size, State, Destructive,
 * Quick Link). They collapse onto idiomatic shadcn `variant` + `size`
 * (interaction states are handled with CSS state selectors, not props):
 *
 *   shadcn variant   →  DS source (exact values live in theme.css tokens)
 *   ──────────────────────────────────────────────────────────────────────
 *   default          →  Type=Primary, Style=Default  (navy #081c4a,
 *                        hover grey-900, active grey-950)
 *   secondary        →  DS Brand/Secondary filled grey
 *   outline          →  Type=Secondary, Style=Default (white + grey border,
 *                        hover blue-50, active blue-100)
 *   ghost            →  Type=Secondary minus the border
 *   link             →  Type=Tertiary (blue-600 text link)
 *   destructive      →  Destructive=True, Primary (red-600, hover/active
 *                        red-700/red-900)
 *
 *   Figma Size=Default → `size: "default"` (h-40, px-16); Size=Small → `sm`
 *   (h-32, px-12). `lg` and `icon` are idiomatic shadcn additions.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-card hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        outline:
          "border border-input bg-card text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent-active",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent-active",
        link: "text-link underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground shadow-card hover:bg-destructive-hover active:bg-destructive-active",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. an `<a>`) instead of a `<button>`. */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
