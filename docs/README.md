# ticket-to-tail Documentation

## Overview

`ticket-to-tail` is a minimal train journey planner designed for travelers with dogs. The app helps users search for train routes, compare journey options, and estimate ticket pricing for dog travel.

## What the app does

- Provides station autocomplete for departure and destination fields.
- Displays journey options as cards with departure, arrival, duration, transfers, and pricing.
- Highlights dog ticket logic for **small dogs** and **large dogs**.
- Uses live transport API data by default but supports an offline mock mode for testing.

## Key features

### Search form

The search form includes:

- `From` and `To` station inputs with autocomplete.
- A **swap** button next to the destination input to reverse the route.
- A geolocation button next to the origin input to find nearby stations.
- Date and time pickers.
- Dog mode buttons for `No dog`, `Small dog`, and `Large dog`.

### Journey results

Search results render as journey cards with:

- Departure and arrival times
- Trip duration
- Number of transfers
- A visual segment bar for each leg
- Dog pricing summary
- Transfer risk indication for short connection windows

## Offline mock mode

This feature lets you test the app without relying on the external transport API.

### Enable mock mode

Run the development server with:

```bash
VITE_USE_MOCK_API=true npm run dev
```

Or toggle mock mode manually in the UI when the live API becomes unavailable.

### What mock mode does

- Uses `src/lib/mockData.ts` as the source of station and journey data.
- Overrides API calls in `src/lib/api.ts` with mock helpers.
- Returns example station autocomplete results and journey routes even when the network or API is unavailable.
- Station search supports umlaut characters (e.g., searching "münchen" finds "München Hbf").

### Mock data included

The mock data currently includes:

**Stations (13 total):**
- München Hbf
- Berlin Hbf
- Augsburg Hbf
- Nürnberg Hbf
- Frankfurt (Main) Hbf
- Köln Hbf
- Düsseldorf Hbf
- Hamburg Hbf
- Hannover Hbf
- Stuttgart Hbf
- Munich East Station
- Dresden Hbf
- Ingolstadt Hbf

**Example routes and train types:**

*Munich to Berlin (4 routes):*
- Direct `ICE 574` (fast, 5h)
- `ICE 612` → `ICE 178` via Nürnberg (transfer)
- `IC 289` via Ingolstadt & Nürnberg (slower regional option)
- `RE 5874` → `ICE 505` budget option (transfer)

*Munich to Augsburg (3 routes):*
- `RE 5874`, `RE 5884`, `RE 5894` (short regional, ~50 min)

*Munich to Cologne (2 routes):*
- `ICE 803` and `ICE 813` via Frankfurt (long distance, ~6h)

*Berlin to Hamburg (2 routes):*
- `ICE 501`, `ICE 511` (direct, ~2h)

*Generic fallback routes:*
- `ICE 100` (direct)
- `IC 200` (direct alternative)

Train types included: **ICE**, **IC**, **RE** (Regional Express), and multi-leg journeys with transfers.

## Project structure

- `src/App.tsx` — main app shell and search wiring
- `src/components/SearchForm.tsx` — the search form and input controls
- `src/components/StationInput.tsx` — station autocomplete input
- `src/components/JourneyResults.tsx` — result list rendering
- `src/components/JourneyCard.tsx` — individual journey card layout
- `src/components/JourneyTimeline.tsx` — journey leg timeline
- `src/lib/api.ts` — API helper functions and live/mock routing
- `src/lib/mockApi.ts` — mock API implementations
- `src/lib/mockData.ts` — offline station and journey fixtures
- `src/lib/types.ts` — shared app types
- `src/lib/helpers.ts` — formatting and journey utilities
- `src/lib/pricing.ts` — dog pricing estimates

## Adding or updating mock data

To extend offline test coverage:

1. Add or update station fixtures in `src/lib/mockData.ts`.
2. Add matching route logic in `findMockJourneys`.
3. If needed, update `src/lib/mockApi.ts` to support additional mock endpoints.

## Local development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Enable mock mode locally:

```bash
VITE_USE_MOCK_API=true npm run dev
```

## Notes for GitHub

This documentation is stored as markdown under `docs/README.md`, so it is visible on GitHub when browsing the repository.
