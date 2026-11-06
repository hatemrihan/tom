# TOM — portfolio & open-source components

The portfolio of **Hatem Rihan** ([tomm.one](https://tomm.one)) and **TOM Components**, a free library of 85+ motion-rich React components.

- **Portfolio**: scroll-driven hero, project showcase, contact stepper, client agreement.
- **Components** (`/components`): every component has a live preview, its full source and copy-paste install steps.
- **Admin** (`/admin`): contact inbox with charts, plus a manager to rename, describe, hide or feature components.

## Components

Each component is **one self-contained file** in [`components/library`](components/library). It depends only on React, [Motion](https://motion.dev), Tailwind CSS and a tiny `cn` helper.

```bash
npm i motion clsx tailwind-merge
```

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Then copy a component (for example [`hold-to-confirm.tsx`](components/library/hold-to-confirm/hold-to-confirm.tsx)) into your project. Every docs page shows the exact file paths.

| Folder | What's inside |
| --- | --- |
| `components/library/<name>/` | the component |
| `components/library/demos/` | usage examples (also shown as the "Usage" tab) |
| `components/library/registry.ts` | names, descriptions, categories, credits |
| `components/library/_lib/` | shared `cn` and noise helpers |

### Adding a component

1. Create `components/library/<slug>/<slug>.tsx`.
2. Add a demo at `components/library/demos/<slug>.tsx` (default export).
3. Register it in `registry.ts`.
4. Run `node scripts/gen-previews.mjs`.

## Development

```bash
cp .env.example .env.local   # fill in Supabase + admin key
npm install
npm run dev
```

Create the tables once: paste [`supabase/migrations/20261106000000_init.sql`](supabase/migrations/20261106000000_init.sql) into the Supabase SQL editor and run it (or `supabase db push`). Row Level Security is on: the publishable key can only read component settings, and contacts are reachable only from the server with the secret key.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase project (public reads) |
| `SUPABASE_SECRET_KEY` | server-only key for contact submissions and admin data |
| `ADMIN_SECRET_KEY` | sign-in key for `/admin` (signed, httpOnly session cookie) |
| `GOOGLE_SITE_VERIFICATION` | optional Search Console token |

The site builds and runs without a database. Forms and admin data show a clear notice until one is connected.

## Credits

Several components were inspired by interaction ideas shared by [dqnamo](https://www.dqnamo.com), [React Drops](https://reactdrops.dev) and [Skiper UI](https://skiper-ui.com). Each docs page links the original idea. All code in this repository is an original implementation.

## License

[MIT](LICENSE) © Hatem Rihan
