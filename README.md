# ASMR Survival Build — AI Video Prompt Generator

> Generate cinematic AI video prompts untuk konten **ASMR Primitive Survival Build**.
> Story-driven, documentary-style, Anti-CGI, optimized untuk **Grok & VEO**.

---

## ✨ Fitur Utama

- 🧬 **Project DNA System** — Lokasi, model, shelter, material dikunci konsisten di semua scene
- 🎬 **Story Arc Engine** — Hook → Preparation → Journey → Build → Living → Closing Credits
- ⭐ **Emotional Injection** — Auto & manual placement: Animal, Civilian, Wonder, Rescue, Cook, Fire, Reflect
- 🚫 **Anti-CGI Rules** — Instruksi eksplisit realism: handheld, 24fps, organic motion, no CGI
- ⏱️ **Duration Engine** — 8–20 menit, pilih 8 atau 10 detik per scene, total scene auto-dihitung
- 📸 **Claude Vision AI** — Upload/URL gambar → AI analisa → deskripsi sinematik masuk ke prompt
- 🌤️ **Time of Day** — Pagi / Siang / Sore / Malam per scene
- 🎥 **Multi-camera Mix** — Depan / Sisi / Belakang / Drone aerial per scene

---

## 🚀 Setup Development (Localhost)

### 1. Clone / Download project ini

```bash
cd asmr-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variable

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxx
```

> **Dapatkan API Key:** https://console.anthropic.com/

### 4. Jalankan development server

```bash
npm run dev
```

Buka: **http://localhost:3000**

---

## ☁️ Deploy ke Vercel

### Cara 1 — Via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Cara 2 — Via GitHub (Recommended)

1. Push project ke GitHub repository
2. Buka [vercel.com](https://vercel.com) → **New Project** → Import dari GitHub
3. Vercel otomatis detect Next.js
4. **PENTING:** Tambahkan Environment Variable di Vercel Dashboard:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-xxxxxxxxxxxx`
5. Klik **Deploy**

### Vercel Environment Variables

Pergi ke: **Vercel Dashboard → Project → Settings → Environment Variables**

| Variable            | Value              |
| ------------------- | ------------------ |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` |

---

## 📁 Struktur Project

```
asmr-generator/
├── app/
│   ├── api/
│   │   └── analyze-image/
│   │       └── route.ts        ← Claude Vision API (server-side, key aman)
│   ├── globals.css             ← Tailwind + custom styles
│   ├── layout.tsx              ← Root layout
│   └── page.tsx                ← Main generator UI
├── lib/
│   ├── data.ts                 ← All constants, options, DNA defaults
│   ├── promptBuilder.ts        ← Prompt generation engine
│   └── sceneGenerator.ts       ← Scene list + phase builder
├── types/
│   └── index.ts                ← TypeScript types
├── .env.example                ← Template env vars
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

---

## 🎬 Cara Pakai

### Step 1 — Duration Engine

Pilih total durasi (8–20 menit) dan durasi per-scene (8 atau 10 detik). Jumlah scene dihitung otomatis.

### Step 2 — Project DNA

Isi dan **kunci** DNA proyek:

- Judul video (story hook)
- Model gender (Laki-laki / Perempuan) — dikunci konsisten
- Mode perjalanan (Jalan kaki / Camper Van / Snowfox / dll)
- Setting lokasi & iklim
- Tipe shelter yang dibangun
- Film style (anti-CGI anchor)

### Step 3 — Image Reference (Optional)

Upload gambar atau paste URL → Claude Vision AI menganalisa → deskripsi masuk otomatis ke prompt.

### Step 4 — Navigasi Scene

Pilih fase dan scene dari Phase Navigator. Tiap scene bisa dikonfigurasi:

- Camera angle, movement, mood
- Craft activity
- Sound ASMR
- Visual atmosphere
- Emotional injection

### Step 5 — Generate

Klik **⚡ Generate Prompt** untuk scene aktif, atau **🎬 Generate Semua** untuk semua scene sekaligus.

---

## 🎯 Story Arc (Urutan Fase)

| Fase              | Emoji | Deskripsi                                        | Porsi |
| ----------------- | ----- | ------------------------------------------------ | ----- |
| Opening Hook      | 🎣    | Cuplikan highlight — bikin penonton penasaran    | ~4%   |
| Preparation       | 🎒    | Mempersiapkan perlengkapan dan bekal             | ~7%   |
| Journey           | 🚗    | Perjalanan menuju lokasi, mix semua sudut kamera | ~16%  |
| Arrival & Scout   | 🔍    | Tiba di lokasi, pilih titik membangun            | ~6%   |
| Build Phase       | 🏗️    | Membangun shelter — fase terpanjang              | ~33%  |
| Challenges        | ⚡    | Tantangan alam: hujan, badai, medan sulit        | ~8%   |
| Living & Relaxing | 🔥    | Berburu, memasak, makan, relaxing                | ~18%  |
| Closing Credits   | 🌅    | Penutup seperti film, credit title               | ~8%   |

---

## 🔒 Keamanan API Key

- API Key **hanya ada** di environment variable server (`.env.local` atau Vercel)
- Claude Vision request diproses di **server-side** (`/api/analyze-image`)
- API Key **tidak pernah dikirim** ke browser
- **Aman** untuk deploy ke Vercel sebagai production app

---

## 🎬 Compatible Platforms

**Primary:** Grok, VEO
**Also works:** Kling AI, Runway Gen-3, Pika 2.0, Sora, Luma Dream Machine, Hailuo, Vidu

---

## 📝 Anti-CGI Rules (Built-in di setiap prompt)

Setiap prompt yang di-generate otomatis menyertakan:

```
• NO CGI, NO 3D rendering — photographic realism ONLY
• Natural camera breathing, organic handheld micro-movement
• Film grain visible — analogue texture, not digital clean
• Motion: natural human pace, no superhuman movements
• Continuity: same person, clothes, location, structure stage
• No objects with wrong scale — correct real-world size always
```
