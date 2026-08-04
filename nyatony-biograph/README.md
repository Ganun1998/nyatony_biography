# Nyatony Kai Tut — Biography, Graduation & Wedding Website

A premium full-stack digital biography, graduation portfolio, and wedding tribute for **Nyatony Kai Chuol Tut**.

---

## Project Structure

```
nyatony-biograph/
├── frontend/          # Next.js 14 App Router — TypeScript + Tailwind CSS
│   └── src/
│       ├── app/       # All pages (App Router)
│       │   ├── (pages)/biography
│       │   ├── (pages)/graduation
│       │   ├── (pages)/wedding
│       │   ├── (pages)/gallery
│       │   ├── (pages)/family-gallery
│       │   ├── (pages)/childhood
│       │   ├── (pages)/graduation-gallery
│       │   ├── (pages)/wedding-gallery
│       │   ├── (pages)/guestbook
│       │   ├── (pages)/contact
│       │   └── admin/
│       ├── components/
│       │   ├── layout/   (Navbar, Footer)
│       │   ├── sections/ (Hero, Biography, Family, FAQ, etc.)
│       │   └── ui/       (ThemeProvider, AnimateIn, BackToTop, etc.)
│       └── data/siteData.ts   ← All content lives here
│
└── backend/           # Node.js + Express + MongoDB
    └── src/
        ├── models/    (User, Gallery, Music, Video, Guestbook, Contact)
        ├── controllers/
        ├── routes/
        ├── middleware/ (auth JWT, file uploads)
        └── server.js
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev         # → http://localhost:3000
```

### Key files to personalise
| File | What to change |
|---|---|
| `src/data/siteData.ts` | All biography text, family members, FAQ, wedding info, playlists |
| `public/images/nyatony-portrait.jpg` | Main hero portrait |
| `public/images/` | All photos (gallery, family, bio chapters) |
| `public/music/` | Wedding music files (.mp3) |
| `public/videos/` | Video files (.mp4) |

---

## Backend Setup

```bash
cd backend
cp .env.example .env      # Then fill in your MongoDB URI and secrets
npm install
npm run seed              # Creates the admin user in MongoDB
npm run dev               # → http://localhost:5000
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Admin login → returns JWT |
| GET | `/api/auth/me` | Bearer | Get current user |
| GET | `/api/guestbook` | — | Get approved guestbook messages |
| POST | `/api/guestbook` | — | Submit a blessing |
| GET | `/api/gallery` | — | Get gallery photos |
| POST | `/api/contact` | — | Send contact message |
| GET | `/api/admin/guestbook` | Admin | All guestbook entries |
| PATCH | `/api/admin/guestbook/:id/approve` | Admin | Approve message |
| DELETE | `/api/admin/guestbook/:id` | Admin | Delete message |
| POST | `/api/admin/gallery` | Admin | Upload gallery image |
| GET | `/api/admin/contact` | Admin | View all contact messages |

---

## Adding Your Content

### 1. Replace photos
Drop your photos into `frontend/public/images/`. The site uses graceful fallbacks if images are missing.

### 2. Add music
Place `.mp3` files in `frontend/public/music/` and update the playlist in `siteData.ts`.

### 3. Update the biography
Edit `BIOGRAPHY_CHAPTERS` in `src/data/siteData.ts` — each chapter has a title, content, and image path.

### 4. Family members
Edit `FAMILY_MEMBERS` in `siteData.ts` — add portraits, names, relationships, and messages.

### 5. Wedding details
Update `WEDDING_DATA` and `SITE_META.weddingDate` for the live countdown.

---

## Design System

| Token | Value |
|---|---|
| Champagne Gold | `#C9A227` |
| Soft Rose | `#F7E7E7` |
| Background | `#FFFFFF` |
| Secondary BG | `#FAF9F6` |
| Dark Text | `#1F2937` |
| Heading Font | Playfair Display |
| Body Font | Inter |

Dark mode is supported via the `.dark` class — toggled by the theme button in the navbar. Preference is saved to `localStorage`.

---

## Admin Panel

Visit `/admin` → login with your admin credentials → access the dashboard at `/admin/dashboard`.

Default credentials (change after first login):
- Email: `admin@nyatony.com`
- Password: `Admin@2026`

---

*Built with love for a remarkable woman — Nyatony Kai Chuol Tut.*
