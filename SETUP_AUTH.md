# Setup Auth — Supabase + Next.js 16

## 1. Install Dependencies

```bash
pnpm add @supabase/ssr @supabase/supabase-js
```

## 2. File yang Perlu Ditambahkan ke Project

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts       ← browser client
│       ├── server.ts       ← server component client
│       └── middleware.ts   ← session refresh + route guard
├── components/
│   └── auth/
│       ├── AuthCard.tsx    ← layout wrapper halaman auth
│       ├── AuthInput.tsx   ← input field reusable
│       ├── AuthButton.tsx  ← button primary/outline
│       ├── AuthAlert.tsx   ← pesan sukses/error
│       └── UserNav.tsx     ← dropdown user + logout
└── app/
    ├── layout.tsx          ← UPDATE: tambah UserNav server-side
    ├── login/
    │   └── page.tsx
    ├── forgot-password/
    │   └── page.tsx
    ├── reset-password/
    │   └── page.tsx
    └── auth/
        └── callback/
            └── route.ts    ← handler OAuth + email link
middleware.ts               ← ROOT level (sejajar src/)
.env.example                → copy ke .env.local
```

## 3. Setup Supabase Project

1. Buka https://supabase.com → New Project
2. Catat: **Project URL** dan **anon/public key**
3. Dashboard → Authentication → Settings:
   - **Disable "Enable email confirmations"** (karena admin yang buat akun manual)
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs tambahkan:
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (untuk dev)

## 4. Environment Variables

Copy `.env.example` → `.env.local` dan isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## 5. Buat Akun User (Admin Only — Tidak Ada Register Publik)

Karena tidak ada halaman register, admin buat akun langsung di:

**Supabase Dashboard → Authentication → Users → Add User**

- Isi email + password
- Klik "Create User"
- Selesai — user langsung bisa login

## 6. Deploy ke Vercel

Di Vercel Dashboard → Project → Settings → Environment Variables:

| Key                             | Value                      |
| ------------------------------- | -------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...`              |
| `ANTHROPIC_API_KEY`             | `sk-ant-api03-...`         |

## 7. Cara Kerja Auth Flow

```
User buka /           → middleware cek session
                      → belum login → redirect /login

User isi email+pass   → Supabase auth
                      → sukses → redirect ke /
                      → gagal  → tampil error

User lupa password    → /forgot-password
                      → masukkan email
                      → Supabase kirim email
                      → klik link → /auth/callback
                      → callback verifikasi OTP
                      → redirect /reset-password
                      → isi password baru
                      → simpan → redirect /

User logout           → UserNav dropdown → Keluar
                      → supabase.auth.signOut()
                      → redirect /login
```

## 8. Proteksi Double Layer

**Layer 1 — middleware.ts (Edge):**

- Cek session via `getUser()` setiap request
- Redirect ke `/login` jika belum login
- Redirect ke `/` jika sudah login tapi akses `/login`

**Layer 2 — layout.tsx (Server Component):**

- Server-side `getUser()` untuk render conditional UserNav
- Memastikan navbar logout hanya muncul untuk user terautentikasi
