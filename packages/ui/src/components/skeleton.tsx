import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Skeleton — pulsing placeholder block (DS Skeleton Loader, node 9622:12893).
 * Uses the muted surface; shape/size come from the consumer's classes.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
