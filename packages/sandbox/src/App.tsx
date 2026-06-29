import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui";
import { Bell, Home, Settings, Users } from "lucide-react";
import type { ReactNode } from "react";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-card">
        {children}
      </div>
    </section>
  );
}

export function App() {
  return (
    <TooltipProvider>
      <main className="mx-auto max-w-5xl space-y-10 p-10">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            @acme/ui — kitchen sink
          </h1>
          <p className="text-sm text-muted-foreground">
            Internal dev surface for visually verifying components against the
            Acme DS. Not the showcase demo.
          </p>
        </header>

        <Section title="Button">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </Section>

        <Section title="Text inputs">
          <div className="grid w-72 gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@acme.com" />
          </div>
        </Section>

        <Section title="Selection controls">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked /> Accept terms
          </label>
          <RadioGroup defaultValue="a" className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="a" /> Option A
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="b" /> Option B
            </label>
          </RadioGroup>
          <label className="flex items-center gap-2 text-sm">
            <Switch defaultChecked /> Notifications
          </label>
        </Section>

        <Section title="Slider + Select">
          <Slider defaultValue={[40]} max={100} className="w-64" />
          <Select>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planner">Planner</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="worker">Worker</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        <Section title="Containers — Card, Tabs, Separator">
          <Card className="w-72">
            <CardHeader>
              <CardTitle>Shift summary</CardTitle>
              <CardDescription>This week at a glance</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              12 shifts · 3 open
            </CardContent>
          </Card>
          <Tabs defaultValue="day" className="w-72">
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
            <TabsContent value="day" className="text-sm text-muted-foreground">
              Day view
            </TabsContent>
            <TabsContent value="week" className="text-sm text-muted-foreground">
              Week view
            </TabsContent>
          </Tabs>
          <div className="flex h-16 items-center gap-3 text-sm">
            Left
            <Separator orientation="vertical" />
            Right
          </div>
        </Section>

        <Section title="Overlays — Tooltip, Sheet">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Inverted tooltip surface</TooltipContent>
          </Tooltip>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine the schedule view.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </Section>

        <Section title="Sidebar (composed)">
          <div className="h-72 w-full overflow-hidden rounded-lg border border-border">
            <SidebarProvider>
              <Sidebar>
                <SidebarHeader>
                  <span className="px-2 font-semibold">Acme</span>
                </SidebarHeader>
                <SidebarSeparator />
                <SidebarContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive>
                        <Home /> Dashboard
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Users /> People
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Settings /> Settings
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                  <span className="px-2 text-xs text-muted-foreground">v0.0.0</span>
                </SidebarFooter>
              </Sidebar>
              <div className="flex flex-1 items-center gap-2 p-4">
                <SidebarTrigger />
                <span className="text-sm text-muted-foreground">
                  Main content area
                </span>
              </div>
            </SidebarProvider>
          </div>
        </Section>

        <Section title="Feedback & display">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="outline">Outline</Badge>
          <Avatar>
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <Progress value={64} className="w-56" />
          <Skeleton className="h-10 w-40" />
        </Section>

        <Section title="Alert">
          <div className="w-full space-y-3">
            <Alert>
              <Bell />
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>A new shift was published.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <Bell />
              <AlertTitle>Conflict</AlertTitle>
              <AlertDescription>Two shifts overlap.</AlertDescription>
            </Alert>
          </div>
        </Section>
      </main>
    </TooltipProvider>
  );
}
