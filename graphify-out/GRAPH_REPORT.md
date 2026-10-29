# Graph Report - DeloreanStore  (2026-10-29)

## Corpus Check
- 37 files · ~15,622 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 181 nodes · 430 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `658ee250`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- DeloreanPreloader.jsx
- mockDatabase.js
- App.jsx
- PaymentSimulator.jsx
- ProductDetailModal.jsx
- scripts
- Frontend Design
- ProductGrid.jsx
- Delorean Design System (fuente única de verdad visual)
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `useAppMode()` - 18 edges
2. `react` - 16 edges
3. `Bolt()` - 16 edges
4. `formatCOP()` - 14 edges
5. `Store()` - 11 edges
6. `lucide-react` - 10 edges
7. `SuperadminView()` - 10 edges
8. `DrawerPanel()` - 10 edges
9. `ModalBody()` - 9 edges
10. `ProductGrid()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Store()` --calls--> `ProductGrid()`  [EXTRACTED]
  src/App.jsx → src/components/catalog/ProductGrid.jsx
- `Store()` --calls--> `InstagramFeed()`  [EXTRACTED]
  src/App.jsx → src/components/updates/InstagramFeed.jsx
- `App()` --calls--> `DeloreanPreloader()`  [EXTRACTED]
  src/App.jsx → src/components/layout/DeloreanPreloader.jsx
- `App()` --calls--> `AppModeProvider()`  [EXTRACTED]
  src/App.jsx → src/context/AppModeContext.jsx
- `ProductRow()` --calls--> `formatCOP()`  [EXTRACTED]
  src/components/admin/SuperadminView.jsx → src/services/mockDatabase.js

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.08
Nodes (34): dependencies, lucide-react@^1.64.0, react@^18.3.1, react-dom@^18.3.1, tailwindcss@^4.3.3, @tailwindcss/vite@^4.3.3, devDependencies, eslint@^9.13.0 (+26 more)

### Community 1 - "DeloreanPreloader.jsx"
Cohesion: 0.27
Nodes (7): CHIBIS, DeloreanPreloader(), PARTICLES, pickNext(), buildRects(), PixelSprite(), Speedometer()

### Community 2 - "mockDatabase.js"
Cohesion: 0.13
Nodes (26): EMPTY, ProductForm(), ProductRow(), Stat(), STATUS_OPTIONS, statusForStock(), toInt(), AppModeContext (+18 more)

### Community 3 - "App.jsx"
Cohesion: 0.21
Nodes (16): App(), Store(), SuperadminView(), ProductDetailModal(), CartAndRewardsDrawer(), CATEGORIES, Footer(), AvatarMenu() (+8 more)

### Community 4 - "PaymentSimulator.jsx"
Cohesion: 0.22
Nodes (17): BANKS, Field(), GATEWAYS, INSTALLMENTS, METHODS, PaymentSimulator(), Pills(), RULES (+9 more)

### Community 5 - "ProductDetailModal.jsx"
Cohesion: 0.27
Nodes (14): lucide-react, react, FloatingProductCard(), ModalBody(), SizePicker(), isSoldOut(), STOCK_STATUS, CHECKOUT_MODES (+6 more)

### Community 6 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 7 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 8 - "ProductGrid.jsx"
Cohesion: 0.25
Nodes (11): CATEGORIES, Hero(), norm(), ProductGrid(), dateFmt, InstagramFeed(), useScrollProgress(), useScrollReveal() (+3 more)

### Community 9 - "Delorean Design System (fuente única de verdad visual)"
Cohesion: 0.33
Nodes (5): Color de marca, Delorean Design System (fuente única de verdad visual), Geometría y tipografía, Motion, Superficies

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ProductDetailModal.jsx` to `package.json`, `DeloreanPreloader.jsx`, `mockDatabase.js`, `App.jsx`, `PaymentSimulator.jsx`, `ProductGrid.jsx`?**
  _High betweenness centrality (0.268) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08258258258258258 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `ProductDetailModal.jsx` to `package.json`, `mockDatabase.js`, `App.jsx`, `PaymentSimulator.jsx`, `ProductGrid.jsx`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Should `mockDatabase.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1310483870967742 - nodes in this community are weakly interconnected._