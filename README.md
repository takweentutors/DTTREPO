<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Let's Go Tutors

Personalised tuition platform for GCSE and A-Level success.

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS 3 (build-time via PostCSS)
- **Fonts**: Poppins + Montserrat (Google Fonts)
- **Icons**: Lucide React

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Copy `.env.example` to `.env.local` and set your API key:
   ```bash
   cp .env.example .env.local
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   App runs at [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm run preview
```

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |

