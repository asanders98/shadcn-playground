import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui";
import type { ReactNode } from "react";

/**
 * Shared layout for a demo screen. In this tracer-bullet slice every route
 * renders one of these; later slices replace the body with the real screen.
 */
export function PlaceholderView({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      {children ?? (
        <Card>
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
            <CardDescription>
              This screen lands in a later slice of the Acme Scheduling demo.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The app shell, navigation, and shared roster are in place — the
            view content gets built on top of them next.
          </CardContent>
        </Card>
      )}
    </section>
  );
}
