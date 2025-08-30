# Rental Finder (React + Firebase)

A lightweight Airbnb-style app with listings, search/filters, auth, favorites, and booking flow.

## Demo
- Live: <https://nimble-babka-52d07d.netlify.app>
- Video/GIF: <link>

## Stack
React • Vite/CRA • Firebase (Auth, Firestore, Storage) • SCSS • Netlify

## Features
- Email/password auth
- Host & Guest flows
- Listing create/edit with images
- Search, filters, favorites
- Responsive UI + route guards

## Architecture
- `/src/features/*` feature folders (Listing, Auth, Booking, Search)
- State via Context/Redux (note your choice here)
- Data via Firebase SDK
- Routing via React Router
- Env via `.env` 

## Getting Started
```bash
npm i
npm run dev
# build
npm run build
# preview
npm run preview
