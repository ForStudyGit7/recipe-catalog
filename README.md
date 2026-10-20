# Смачний Каталог (Recipe Catalog Web Application)

**Смачний Каталог** is a responsive recipe catalog web application built as a
university individual web application project. It retrieves recipe data from
the public DummyJSON Recipes API and presents it in a searchable, filterable
catalog.

> **Project status:** Stage 1. Search by recipe name, difficulty filtering,
> sorting, and a full recipe details dialog are implemented. Cuisine/category
> filtering is a planned extension; the API already provides cuisine, tags, and
> meal type data that can support it.

## Purpose

The application provides a simple way to discover recipes and review the
information needed to prepare them. Its responsive interface includes:

- Recipe search by name.
- Filtering by difficulty.
- Sorting by recommended order, rating, name, or total preparation time.
- Recipe cards with images, cuisine, difficulty, preparation time, rating, and
  review count.
- A modal details view with ingredients, instructions, serving count, cooking
  times, and calories per serving.
- Loading, request error, and retry states.
- A light/dark theme toggle.

## Tech Stack

| Technology | Use |
| --- | --- |
| HTML5 | Semantic document structure, landmarks, and native dialog |
| CSS3 | Responsive layout, CSS variables, Flexbox, and CSS Grid |
| TypeScript | Typed API response data and application logic |
| JavaScript | Browser runtime for the TypeScript application |
| Vite | Development server and production build |
| ESLint | Listed as a project technology goal; it is not currently configured |
| Prettier | Formatting configuration is present; no npm formatting script is currently defined |

The app uses the browser's native `fetch` API and does not require additional
runtime dependencies.

## Data Source

Recipes are loaded from the
[DummyJSON Recipes API](https://dummyjson.com/recipes). The application
requests up to 30 records from:

```text
https://dummyjson.com/recipes?limit=30
```

No API key is required. The API provides recipe details such as ingredients,
instructions, cuisine, difficulty, tags, meal type, image, rating, and timing.
The application displays a clear loading state while requesting the data and
an error message with a retry action if the request fails.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) with npm.
- Git.

### Install and run locally

Replace `<repository-url>` with the URL of your Git repository:

```bash
git clone <repository-url>
cd recipe-catalog
npm install
npm run dev
```

Vite prints the local development URL in the terminal after starting.

### Production build

```bash
npm run build
```

The production-ready files are generated in the `dist/` directory. To preview
that build locally:

```bash
npm run preview
```

## Accessibility

Accessibility is considered throughout the interface, with implementation
choices informed by WCAG 2.2:

- Semantic `header`, `main`, `section`, and `footer` landmarks.
- A skip link to move directly to the main content.
- Explicit labels for search, filter, and sorting controls.
- Keyboard-visible focus outlines.
- Live and status announcements for loading and result updates, plus an
  announced error state.
- A native HTML `<dialog>` for recipe details, with a labelled title and an
  explicit close button.
- Alternative text for recipe images and accessible names for icon-only
  controls.
- Responsive layouts and reduced-motion support.

These are accessibility-oriented implementation practices and do not
constitute a formal WCAG conformance audit.

## Architecture

The application is a small Vite-powered TypeScript frontend:

```text
index.html       Semantic page structure and interface containers
src/
  api.ts         DummyJSON request and HTTP error handling
  main.ts        Application initialization, rendering, and UI interactions
  style.css      Theme variables, component styles, and responsive layout
  types.ts       Recipe and API response interfaces
```

On page load, `main.ts` calls `fetchRecipes()` from `api.ts`. The API response
is represented by the `RecipesResponse` and `Recipe` interfaces in `types.ts`.
The page renders recipe cards and updates them as the user searches, filters,
or changes the sort order. Selecting a card's details action populates the
native dialog with the full recipe content.

## Available npm Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check the TypeScript project and create a production build |
| `npm run preview` | Serve the production build locally for preview |

ESLint is not configured yet. Prettier configuration is present in the project,
but a formatting script is not currently defined in `package.json`.

## Deployment

**Deployed application URL:** _Add the deployment URL here._
