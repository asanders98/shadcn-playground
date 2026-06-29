import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui";

import { COMPANY } from "../data/mock";
import { PlaceholderView } from "./PlaceholderView";

/**
 * Company settings screen. Cosmetic and local-state only — the form fields use
 * uncontrolled defaults and the "Save" button just shows a confirmation; nothing
 * is validated or persisted. Its real job is to give every remaining form
 * control (Input, Label, Checkbox, RadioGroup, Slider, Switch, Select) a
 * believable home, organised into tabbed sections with Separators between them.
 */
export function MyCompanyView() {
  // The only real state: whether the cosmetic "Save" confirmation is showing.
  // Switching tabs clears it so the banner always reflects the last explicit Save.
  const [saved, setSaved] = useState(false);

  return (
    <PlaceholderView
      title="My Company"
      description="Company profile, scheduling defaults, and notifications for Acme Bistro."
    >
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" onValueChange={() => setSaved(false)}>
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* General — company details (Input + Label) and company size. */}
            <TabsContent value="general" className="space-y-6 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company name</Label>
                  <Input id="company-name" defaultValue={COMPANY.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    defaultValue={COMPANY.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue={COMPANY.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america-new_york">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-new_york">
                        Eastern (New York)
                      </SelectItem>
                      <SelectItem value="america-chicago">
                        Central (Chicago)
                      </SelectItem>
                      <SelectItem value="america-denver">
                        Mountain (Denver)
                      </SelectItem>
                      <SelectItem value="america-los_angeles">
                        Pacific (Los Angeles)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Company size</Label>
                <RadioGroup defaultValue="11-50">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="size-small" value="1-10" />
                    <Label htmlFor="size-small" className="font-normal">
                      1–10 employees
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="size-medium" value="11-50" />
                    <Label htmlFor="size-medium" className="font-normal">
                      11–50 employees
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="size-large" value="51-plus" />
                    <Label htmlFor="size-large" className="font-normal">
                      51+ employees
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            {/* Scheduling — week start (Select), hours cap (Slider), toggles. */}
            <TabsContent value="scheduling" className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="week-start">Week starts on</Label>
                <Select defaultValue="monday">
                  <SelectTrigger id="week-start" className="sm:max-w-xs">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="max-hours">
                  Maximum weekly hours per employee
                </Label>
                <Slider
                  id="max-hours"
                  defaultValue={[40]}
                  min={10}
                  max={60}
                  step={5}
                  className="sm:max-w-md"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-publish">Auto-publish schedules</Label>
                  <p className="text-sm text-muted-foreground">
                    Publish the weekly schedule as soon as it&apos;s complete.
                  </p>
                </div>
                <Switch id="auto-publish" defaultChecked />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="allow-swaps" defaultChecked />
                <Label htmlFor="allow-swaps" className="font-normal">
                  Allow staff to swap shifts without manager approval
                </Label>
              </div>
            </TabsContent>

            {/* Notifications — email triggers (Checkbox) and a digest (Switch). */}
            <TabsContent value="notifications" className="space-y-6 pt-4">
              <div className="space-y-3">
                <Label>Email me when</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="notify-published" defaultChecked />
                  <Label htmlFor="notify-published" className="font-normal">
                    A schedule is published
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="notify-swap" defaultChecked />
                  <Label htmlFor="notify-swap" className="font-normal">
                    A shift swap is requested
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="notify-noshow" />
                  <Label htmlFor="notify-noshow" className="font-normal">
                    A staff member is marked as a no-show
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly summary digest</Label>
                  <p className="text-sm text-muted-foreground">
                    A Monday-morning recap of the week ahead.
                  </p>
                </div>
                <Switch id="weekly-digest" />
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="flex items-center gap-4">
            <Button onClick={() => setSaved(true)}>Save changes</Button>
            {saved && (
              <Alert variant="success" className="flex-1">
                <AlertTitle>Settings saved</AlertTitle>
                <AlertDescription>
                  This is a demo — nothing is actually persisted.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </PlaceholderView>
  );
}
