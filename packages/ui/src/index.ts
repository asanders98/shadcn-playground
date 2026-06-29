// Public entry point for @acme/ui.
// Consuming apps import everything from here: `import { Button } from "@acme/ui"`.

export { cn } from "./lib/utils";

// Form controls
export { Button, buttonVariants, type ButtonProps } from "./components/button";
export { Input } from "./components/input";
export { Label } from "./components/label";
export { Checkbox } from "./components/checkbox";
export { RadioGroup, RadioGroupItem } from "./components/radio-group";
export { Switch } from "./components/switch";
export { Slider } from "./components/slider";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./components/select";

// Containers
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/card";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/tabs";
export { Separator } from "./components/separator";

// Overlays
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/tooltip";
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/sheet";

// Navigation
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
} from "./components/sidebar";

// Feedback & display
export { Badge, badgeVariants, type BadgeProps } from "./components/badge";
export { Alert, AlertTitle, AlertDescription } from "./components/alert";
export { Progress } from "./components/progress";
export { Skeleton } from "./components/skeleton";
export { Avatar, AvatarImage, AvatarFallback } from "./components/avatar";
