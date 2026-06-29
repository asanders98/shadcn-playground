import { ComponentShowcase, TooltipProvider } from "@acme/ui";

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

        <ComponentShowcase />
      </main>
    </TooltipProvider>
  );
}
