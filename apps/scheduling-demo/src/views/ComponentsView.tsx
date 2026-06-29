import { ComponentShowcase } from "@acme/ui";

import { PlaceholderView } from "./PlaceholderView";

/**
 * Components — an in-app showcase of the @acme/ui library, skinned to the Acme
 * design system. The gallery itself lives in @acme/ui ({@link ComponentShowcase})
 * so this page and the standalone sandbox stay in sync.
 */
export function ComponentsView() {
  return (
    <PlaceholderView
      title="Components"
      description="A showcase of the @acme/ui component library used across the Acme Scheduling demo."
    >
      <ComponentShowcase />
    </PlaceholderView>
  );
}
