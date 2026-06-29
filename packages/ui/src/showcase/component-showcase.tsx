import { Bell } from "lucide-react";
import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "../components/alert";
import { Avatar, AvatarFallback } from "../components/avatar";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Checkbox } from "../components/checkbox";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Progress } from "../components/progress";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Separator } from "../components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/sheet";
import { Skeleton } from "../components/skeleton";
import { Slider } from "../components/slider";
import { Switch } from "../components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/tooltip";

/**
 * A grouped showcase of every @acme/ui component and its variants, skinned to
 * the Acme design system. This is the single source of truth for the component
 * gallery — both the standalone sandbox and the in-app "Components" demo page
 * render it, so they never drift.
 *
 * Assumes a {@link TooltipProvider} exists somewhere above it (the Tooltip
 * section needs one); both current consumers provide it at their root.
 */
export function ComponentShowcase() {
  return (
    <div className="space-y-10">
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
          <Label htmlFor="showcase-email">Email</Label>
          <Input id="showcase-email" type="email" placeholder="you@acme.com" />
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
    </div>
  );
}

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
