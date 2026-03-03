# TokoMekkah Inventory — Vite Edition

Versi migrasi dari Next.js ke **Vite + React + TypeScript**. Lebih ringan, build lebih cepat, PWA tetap berjalan.

## Stack

- **Vite 6** — build tool ultra cepat
- **React 19** — UI library
- **TypeScript** — type safety
- **TailwindCSS 3** — styling
- **React Router v7** — routing SPA (pengganti Next.js App Router)
- **Dexie.js** — IndexedDB offline-first
- **Firebase** — auth + Firestore cloud sync
- **vite-plugin-pwa** — PWA support

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Konfigurasi Firebase
```bash
cp .env.example .env
```
Isi file `.env` dengan kredensial Firebase Anda.

### 3. Jalankan dev server
```bash
npm run dev
```

### 4. Build untuk produksi
```bash
npm run build
```

## Perubahan dari versi Next.js

| Komponen | Next.js (lama) | Vite (baru) |
|---|---|---|
| Routing | `useRouter`, `usePathname` | `useNavigate`, `useLocation` |
| Link | `<Link href>` | `<Link to>` |
| Params | `useParams` dari `next/navigation` | `useParams` dari `react-router-dom` |
| Env vars | `NEXT_PUBLIC_*` | `VITE_*` |
| Cookies | `cookies-next` | Helper native `document.cookie` |
| Middleware | `middleware.ts` | Route guard di `App.tsx` |

## Perbaikan Bug dari versi Next.js

1. **SyncManager uplink hooks** — sekarang ada cleanup function yang benar, mencegah hooks terdaftar berkali-kali
2. **Race condition sync** — menggunakan counter `syncCount` alih-alih boolean tunggal
3. **Lokasi di Edit Product** — sekarang juga menggunakan searchable dropdown (konsisten dengan Add Product)
4. **SyncManager** — perbaikan loopback protection yang lebih andal

## Deploy

Proyek ini bisa di-deploy ke:
- **Vercel** — `vercel deploy`
- **Netlify** — drag & drop folder `dist/`
- **Firebase Hosting** — `firebase deploy`

Pastikan hosting mendukung SPA redirect (semua route ke `index.html`).
