# Yoru.js

## Tech Stack

* Engine: Bun
* Bundler: Vite
* Core: React 19
* State Management & Caching: TanStack Query (React Query)
* HTTP Client: Axios
* UI Framework: Material UI (MUI) 
* Routing: React Router DOM

## Commands

### Project Initialization
```bash
bun create yoru my-app
```

### Create View
```bash
bun run g:view [module-name]
```

### Run Dev
```bash
bun run dev
```

## Project Structure Example

```text
.
└── src/
    ├── api/
    │   ├── client/
    │   │   └── product.ts           #define client to get, update, delete, patch etc.
    │   ├── mock/
    │   │   └── product.json         #mock data json
    │   ├── hooks/
    │   │   ├── use-get-product.ts   #example for hooks get product 
    │   │   └── use-add-product.ts   #example for hooks add product
    │   ├── types/
    │   │   └── product.ts           #types request dan response for product
    │   ├── base.ts
    │   └── query-params.ts
    ├── page/
    │   └── ProductPage.tsx          #will render product-view.tsx
    ├── style/
    │   ├── theme.ts                 #for global theme
    │   └── colors.ts                #for global color
    └── views/
        └── product/
            ├── components/
            ├── modals/
            ├── hooks/
            ├── product-view.tsx       #this will orchestrate all components
            ├── product-view.styles.ts #sx MUI style
            └── types.ts