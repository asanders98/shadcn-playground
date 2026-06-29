import { Button } from "@nxtpeople/ui";
import type { ReactNode } from "react";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-6 shadow-card">
        {children}
      </div>
    </section>
  );
}

export function App() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 p-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          @nxtpeople/ui — kitchen sink
        </h1>
        <p className="text-sm text-muted-foreground">
          Internal dev surface for visually verifying components against the
          NxtPeople DS. Not the showcase demo.
        </p>
      </header>

      <Section title="Button — variants">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </Section>

      <Section title="Button — sizes">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </Section>

      <Section title="Button — states">
        <Button disabled>Disabled</Button>
        <Button asChild>
          <a href="#top">As link (asChild)</a>
        </Button>
      </Section>
    </main>
  );
}
