# Graph Report - DeloreanStore  (2026-10-29)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 62 nodes · 94 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- package.json
- DeloreanPreloader.jsx
- @tailwindcss/vite
- react
- eslint.config.js
- devDependencies
- scripts
- eslint-plugin-react
- eslint-plugin-react-refresh
- globals

## God Nodes (most connected - your core abstractions)
1. `DeloreanPreloader()` - 5 edges
2. `react` - 5 edges
3. `scripts` - 5 edges
4. `PixelSprite()` - 4 edges
5. `Speedometer()` - 3 edges
6. `Bolt()` - 3 edges
7. `react-dom` - 3 edges
8. `@tailwindcss/vite` - 3 edges
9. `vite` - 3 edges
10. `@vitejs/plugin-react` - 3 edges

## Surprising Connections (you probably didn't know these)
- `DeloreanPreloader()` --calls--> `PixelSprite()`  [EXTRACTED]
  src/components/layout/DeloreanPreloader.jsx → src/components/layout/PixelSprite.jsx
- `DeloreanPreloader()` --calls--> `Speedometer()`  [EXTRACTED]
  src/components/layout/DeloreanPreloader.jsx → src/components/layout/Speedometer.jsx
- `DeloreanPreloader()` --calls--> `Bolt()`  [EXTRACTED]
  src/components/layout/DeloreanPreloader.jsx → src/components/ui/Bolt.jsx

## Import Cycles
- None detected.

## Communities (10 total, 3 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.18
Nodes (13): dependencies, lucide-react@^1.64.0, react-dom@^18.3.1, tailwindcss@^4.3.3, @types/react-dom@^18.3.1, name, private, type (+5 more)

### Community 1 - "DeloreanPreloader.jsx"
Cohesion: 0.24
Nodes (8): CHIBIS, DeloreanPreloader(), PARTICLES, pickNext(), buildRects(), PixelSprite(), Speedometer(), Bolt()

### Community 2 - "@tailwindcss/vite"
Cohesion: 0.29
Nodes (6): @tailwindcss/vite@^4.3.3, vite@^5.4.10, @vitejs/plugin-react@^4.3.3, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 3 - "react"
Cohesion: 0.40
Nodes (3): react@^18.3.1, react, App()

### Community 4 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): @eslint/js@^9.13.0, eslint-plugin-react-hooks@^5.0.0, @eslint/js, eslint-plugin-react-hooks

### Community 5 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, eslint@^9.13.0, @types/react@^18.3.12, eslint, @types/react

### Community 6 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `DeloreanPreloader.jsx`?**
  _High betweenness centrality (0.415) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`, `@tailwindcss/vite`, `eslint.config.js`, `eslint-plugin-react`, `eslint-plugin-react-refresh`, `globals`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._