# ticket-to-tail Documentation

## Overview

`ticket-to-tail` is an intelligent train journey planner designed specifically for travelers with dogs. The app helps users search for train routes across Germany, compare journey connection timelines, and evaluate ticket pricing logic and carriage layouts with dog comfort in mind.

## What the app does

- Provides real-time station autocomplete for departure and destination inputs.
- Displays detailed journey options as visual cards with connection durations, transfer details, and pricing breakdowns.
- Highlights dog ticketing rules for **small dogs** (free in carriers) and **large dogs** (requiring an extra ticket).
- Employs a secure backend proxy layer to bypass browser cross-origin blocks (`CORS`) on production servers, route data through a high-performance regional setup, and cleanly falls back to an automated offline mock engine for local testing.

## Key Features

### Search Form
The form utilizes unified atomic design patterns consisting of:
- `From` and `To` autocomplete station entries.
- A **swap direction** button to reverse chosen stations instantly.
- A GPS geolocation lookup selector next to the departure station to locate nearby platforms.
- High-polish, browser-standardized Date and Time picker fields.
- Dog logistics mode selectors (`No dog`, `Small dog`, `Large dog`).

### Journey Results
Search matching sets display customized tracking cards with:
- Departure and arrival timings.
- Complete trip execution duration metric blocks.
- Total number of connection changes.
- A molecular proportional segment bar representing each rail leg visually based on travel minutes.
- Explicit transfer risk flags alerting users if an intermediate switch window is tight for dogs (under 10 minutes).
- Detailed train compositions mapping out coach categories, bistros, and open-plan (`Großraum`) seating configurations optimized for animal companions.

## Automated Mock vs. Production Mode

The application no longer requires manual configuration files or environment variable switches to toggle mock behaviors. It adapts automatically based on the environment compilation context:

### Local Development (Automated Mock Fallback)
When running the development environment locally, Vite flags the runtime state as `import.meta.env.DEV = true`. 
- The application automatically enables the offline mock data layer out-of-the-box.
- Search queries use local dataset mock helpers to prevent layout blocks when offline or during upstream connectivity interruptions.
- Full support for German umlauts is included (e.g., searching "münchen" correctly registers "München Hbf").

### Live Production Deployment
When compiled for cloud deployment, the build pipeline enforces `import.meta.env.DEV = false`. 
- The offline mock mode, test toggles, and warning banners are completely compiled out and hidden from public users.
- All requests communicate exclusively with live transport systems through high-performance gateways.

### Mock Data Included (13 Target Stations)
- München Hbf, Berlin Hbf, Augsburg Hbf, Nürnberg Hbf, Frankfurt (Main) Hbf, Köln Hbf, Düsseldorf Hbf, Hamburg Hbf, Hannover Hbf, Stuttgart Hbf, Munich East Station, Dresden Hbf, Ingolstadt Hbf.

***

## Vercel Cloud Architecture & Proxies

Because the public German Rail API layer enforces browser-level CORS validation patterns, direct frontend network calls from custom domains are blocked live. To overcome this, the app uses a serverless gateway proxy design:

### Edge-Pinning Optimization (`fra1`)
Serverless processing nodes are explicitly configured via `vercel.json` to execute inside the **Frankfurt, Germany (`fra1`)** region. By pinning function infrastructure right next to the physical rail data networks, latency is minimized and the standard 10-second transatlantic serverless timeout errors are entirely eliminated.

***

## Project Structure

- `vercel.json` — System routing specifications, serverless rewrites, and edge deployment region constraints.
- `api/` — Serverless proxy gateway function files bypassing production CORS policies (`stationProxy.ts`, `nearbyProxy.ts`, `journeyProxy.ts`).
- `src/App.tsx` — Main application state wireframe, shell, and core error tracking telemetry.
- `src/components/ui/Primitives.tsx` — Central design token values, shared asset badges, button wrappers, and loading indicators.
- `src/components/ui/Input.tsx` — The parent visual wrapper layout organizing labels, icons, clearing triggers, and error messages uniformly.
- `src/components/ui/StationInput.tsx` — Async field autocomplete logic matching station string variations.
- `src/components/ui/DateTimeInput.tsx` — Standardized temporal field layout hiding default desktop browser indicators.
- `src/components/ui/JourneyTimelineBar.tsx` — Extracted structural component drawing proportional flexbox travel segment trackers.
- `src/components/ui/TrainComposition.tsx` — Extracted molecular layouts tracking train compositions and seat mapping arrays.
- `src/components/SearchForm.tsx` — The unified search form orchestration layer.
- `src/components/JourneyResults.tsx` — Structural search lists managing status indicators and response boards.
- `src/components/JourneyCard.tsx` — Base result display component hosting fare estimates and metadata tracking.
- `src/components/JourneyTimeline.tsx` — Leg track path layouts handling nested detail expansions.
- `src/lib/api.ts` — Main API connectivity core organizing query parameters and relative route targets.
- `src/lib/mockApi.ts` & `mockData.ts` — Data fixtures and route calculation logic for developer sandboxing.

***

## Local Development Lifecycle

To test the application along with the serverless backend functions locally, run the Vercel development emulator to run the proxies and frontend together:

```bash
# 1. Install dependencies
npm install

# 2. Start the local serverless orchestrator
npx vercel dev

# 3. Deploy to Production
npx vercel --prod