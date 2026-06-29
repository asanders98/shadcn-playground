import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Separator } from "./separator";
import { Sheet, SheetContent, SheetTitle } from "./sheet";

/**
 * Sidebar — a COMPOSED navigation component styled to Acme nav styling
 * (the DS has no dedicated desktop sidebar — only Navbar Mobile / Nav Menu
 * Option / Menu Option). It is intentionally not a 1:1 Figma port.
 *
 * Composition: a fixed desktop panel that collapses to a Sheet drawer on mobile
 * (reusing this library's Sheet + Separator). Nav items use the DS menu-option
 * look — hover/active on the accent (blue-50/100) surface, all token-driven.
 */

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    onChange();
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}

interface SidebarContextValue {
  /** Desktop panel expanded/collapsed. */
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Mobile drawer open/closed (defaults closed). */
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  /** Toggles whichever surface is active for the current viewport. */
  toggle: () => void;
  isMobile: boolean;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a <SidebarProvider>");
  return ctx;
}

function SidebarProvider({
  defaultOpen = true,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { defaultOpen?: boolean }) {
  const isMobile = useIsMobile();
  // Desktop panel state (controlled by `defaultOpen`) and the mobile drawer
  // state are tracked separately so the drawer never auto-opens on load.
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);
  const toggle = React.useCallback(
    () => (isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o)),
    [isMobile],
  );
  const value = React.useMemo(
    () => ({ open, setOpen, openMobile, setOpenMobile, toggle, isMobile }),
    [open, openMobile, toggle, isMobile],
  );
  return (
    <SidebarContext.Provider value={value}>
      <div className={cn("flex min-h-svh w-full", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({ className, children, ...props }: React.ComponentProps<"aside">) {
  const { open, openMobile, setOpenMobile, isMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      data-state={open ? "open" : "collapsed"}
      className={cn(
        "hidden h-svh shrink-0 flex-col border-r border-border bg-card text-card-foreground transition-[width] duration-200 md:flex",
        open ? "w-64" : "w-0 overflow-hidden border-r-0",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { toggle } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-9", className)}
      onClick={toggle}
      aria-label="Toggle sidebar"
      {...props}
    >
      <PanelLeft />
    </Button>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-3", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-auto p-2", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-3", className)} {...props} />;
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return <Separator className={cn("mx-2 w-auto", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("relative", className)} {...props} />;
}

interface SidebarMenuButtonProps extends React.ComponentProps<"button"> {
  isActive?: boolean;
  asChild?: boolean;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive = false, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-foreground outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground active:bg-accent-active",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
};
