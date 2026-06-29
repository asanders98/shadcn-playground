import { Avatar, AvatarFallback, Card, CardContent, CardHeader, CardTitle } from "@acme/ui";

import { STAFF } from "../data/mock";
import { PlaceholderView } from "./PlaceholderView";

/**
 * Default landing screen. The shift planner is built in a later slice; for now
 * it previews the shared staff roster so the wired-up mock data is visible.
 */
export function PlanningView() {
  return (
    <PlaceholderView
      title="Planning"
      description="Build and publish the weekly shift schedule."
    >
      <Card>
        <CardHeader>
          <CardTitle>Staff roster</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {STAFF.map((member) => (
              <li key={member.id} className="flex items-center gap-3 py-2">
                <Avatar>
                  <AvatarFallback style={{ backgroundColor: member.color, color: "#fff" }}>
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {member.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </PlaceholderView>
  );
}
