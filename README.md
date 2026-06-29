# @nxtpeople/ui

A shared React component library — [shadcn/ui](https://ui.shadcn.com) components
re-skinned to the **NxtPeople design system**. Built once, consumed by every app
in this monorepo via a workspace link, so a styling change in one place
propagates everywhere (with hot reload, no re-copying files).

- **Stack:** React + TypeScript + Tailwind CSS v4 + Vite, in a pnpm monorepo.
- **Model:** the shadcn "copy-in" approach — components are vendored into
  `packages/ui` (not pulled from an external package), built on Radix primitives
  where shadcn uses them, with a `cn()` class-merge helper and
  [CVA](https://cva.style) for variants.
- **Tokens:** a single Tailwind v4 `@theme` layer extracted from the NxtPeople
  Figma file. Restyle the whole library by editing one file.

> This repo covers the **library only**. The showcase demo app
> (workforce-scheduling tool) is deferred to its own phase — `apps/*` is already
> reserved in the workspace for it.

## Repository layout

```
packages/
  ui/        → @nxtpeople/ui      the component library (the product)
  sandbox/   → @nxtpeople/sandbox internal "kitchen sink" dev surface
apps/         reserved for the future demo (out of scope)
```

## Consuming the library

In a workspace app, add the dependency (pnpm links it locally):

```jsonc
// apps/your-app/package.json
{
  "dependencies": {
    "@nxtpeople/ui": "workspace:*"
  }
}
```

**1. Import components** from the single package entry:

```tsx
import { Button, Card, CardHeader, CardTitle } from "@nxtpeople/ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <Button variant="default">Save</Button>
    </Card>
  );
}
```

**2. Import the theme once** (pulls in Tailwind v4 + all DS tokens) in your
app's main CSS, and point Tailwind at the library source so it generates the
utility classes the components use:

```css
/* apps/your-app/src/index.css */
@import "@nxtpeople/ui/styles.css";

/* Tailwind v4 skips node_modules when scanning for class names, and the
   workspace package is symlinked there — so add it as a source explicitly. */
@source "../../../packages/ui/src/**/*.{ts,tsx}";
```

**3. Load the DS fonts** (Poppins for text, Roboto Mono for numerals), e.g. via
Google Fonts in your `index.html`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

That's the whole setup. See `packages/sandbox` for a working reference.

## Components (19)

**Form controls:** Button · Input · Label · Checkbox · RadioGroup · Switch ·
Slider · Select
**Containers:** Card · Tabs · Separator
**Overlays:** Tooltip · Sheet
**Navigation:** Sidebar _(composed)_
**Feedback & display:** Badge · Alert · Progress · Skeleton · Avatar

Each component maps its Figma variant axes onto idiomatic shadcn props rather
than reproducing every axis. Example — `Button` collapses the Figma set's 6 axes
to `variant` (`default` · `secondary` · `outline` · `ghost` · `link` ·
`destructive`) + `size` (`sm` · `default` · `lg` · `icon`), with interaction
states handled by CSS state selectors. The per-component mapping is documented in
each component file's header comment.

`Sidebar` is a **composed** component styled to the DS nav-menu look (the DS has
no dedicated desktop sidebar); it reuses this library's `Sheet` (mobile drawer)
and `Separator`.

## Tokens & design source

Tokens follow the DS taxonomy **Primitive → Brand → Semantic**, with the semantic
layer implementing the DS surface/elevation stacking model — Base (off-white
canvas) → Card → Floating (dropdowns/menus) → Modal (+ scrim) → Tooltip
(deliberately inverted/dark), each paired with its elevation shadow. They are
emitted as Tailwind v4 `@theme` CSS variables in
[`packages/ui/src/styles/theme.css`](packages/ui/src/styles/theme.css):
light theme under `:root`, with an empty `.dark` scaffold ready for future dark
mode. The DS encodes these as Figma **Styles** (not Variables), so values were
read from the foundation frames via the Figma REST API.

**Figma source — file key `PzgNDV3ABFvKennNVgSHbM` ("NxtPeople DS")**

Foundations:

| Frame | Node ID |
| --- | --- |
| Colours | `1:62847` |
| – Primitive | `8989:20213` |
| – Brand | `8989:20214` |
| – Semantic | `8989:20215` |
| Text Styles | `9285:15981` |
| Shadows | `9046:10701` |
| Grid System / Spacing | `9236:10189` (Spacing `9238:10321`) |

Per-component source nodes:

| Component | Node ID | Component | Node ID |
| --- | --- | --- | --- |
| Button | `4242:14161` ¹ | Card / Section Container | `4207:17290` |
| Input / Textinputfield | `9476:12734` | Tabs / Tab Bar | `8037:11181` |
| Badge | `3774:7993` | Tooltip | `9047:11298` |
| Checkbox | `4194:15481` | Alert | `9235:10198` |
| Radio / Radiobutton | `6601:21859` | Progress Bar | `6262:18460` |
| Switch / Toggle | `9446:14477` | Skeleton Loader | `9622:12893` |
| Slider | `2884:8369` | Avatar / Profile Pic | `3048:14682` |
| Select / Dropdown | `5496:15825` | | |

¹ The PRD listed `9476:12727`, which is a small usage instance; `4242:14161` is
the real 6-axis component set. Label derives from Input's label; Sidebar / Sheet /
Separator are composed.

## Development

```bash
pnpm install
pnpm dev         # run the kitchen-sink sandbox (hot-reloads on library edits)
pnpm test        # render-smoke tests at the package export boundary
pnpm typecheck   # type-check all packages
pnpm build       # build @nxtpeople/ui (dist/ — publish-readiness check)
```

In the monorepo, apps consume `@nxtpeople/ui` directly from **source** (see the
package's `exports`), so library edits hot-reload instantly. The `build` script
exists for the "graduate to a published package" path and to verify the public
API + tree-shaking; it is not needed for local development.

## Testing approach

Primary verification is **visual** — every component is rendered in the sandbox
and checked against its Figma node. Automated tests are intentionally light:
render-smoke tests that exercise each component through the `@nxtpeople/ui`
public boundary (the single seam a consuming app uses). Heavy visual-regression
tooling is out of scope.

## Dark mode

A `.dark` block is scaffolded in `theme.css` but intentionally left empty. To
experiment later, populate the semantic roles there and toggle a `dark` class on
a wrapper element — no component changes required.
