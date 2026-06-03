# King of Tokyo Scorecard

A responsive web app for tracking [King of Tokyo](https://iello.fr/en/games/king-of-tokyo/) board game scores.

## Features

- 🎮 **2–5 players** — configurable at game start
- 👾 **5 monster avatars** — Cyber Kitty, Gigazaur, Meka Dragon, Kong, Alienoid
- ❤️ **Health tracker** — 0–12, starts at 10; skull overlay when dead
- ⭐ **Star tracker** — 0–20; win banner at 20 stars
- 🏙️ **Tokyo City** — track who's in Tokyo
- 📊 **Live dashboard** — leader board + Tokyo status
- 💾 **Auto-saves** — localStorage persistence across refreshes

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4

## Getting Started

```bash
cd king-of-tokyo
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

## Deploy to Azure

See [`.github/workflows/azure-deploy.yml`](.github/workflows/azure-deploy.yml).

Add your Azure Static Web Apps token as a GitHub secret:
```
AZURE_STATIC_WEB_APPS_API_TOKEN
```
