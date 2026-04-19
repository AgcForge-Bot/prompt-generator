# 📋 Panduan Integrasi — Drama Ad Gimmick Mode

## Struktur File Baru

```
src/
├── app/api/drama-mode-generator/
│   └── route.ts                          ← COPY dari api/route.ts
└── components/forms/product-promo-video/
    ├── drama-mode/                        ← COPY seluruh folder ini
    │   ├── types.ts
    │   ├── constants.ts
    │   ├── promptBuilder.ts
    │   ├── useDramaModeGenerator.ts
    │   ├── DramaModeForm.tsx
    │   └── sections/
    │       ├── DramaConfigSection.tsx
    │       └── DramaOutputSection.tsx
    └── PromoModeSelector.tsx              ← COPY ke folder product-promo-video/
```

## Langkah Integrasi

```bash
# 1. Copy drama-mode folder
cp -r drama-mode/ src/components/forms/product-promo-video/

# 2. Copy PromoModeSelector
cp drama-mode/PromoModeSelector.tsx src/components/forms/product-promo-video/

# 3. API Route
mkdir -p src/app/api/drama-mode-generator
cp drama-mode/api/route.ts src/app/api/drama-mode-generator/route.ts
```

## Update ProductPromoVideoForm.tsx

Tambahkan import dan state untuk mode selector:

```tsx
// ── TAMBAHKAN IMPORT INI ──
import PromoModeSelector, { type PromoVideoMode } from "./product-promo-video/PromoModeSelector";
import DramaModeForm from "./product-promo-video/drama-mode/DramaModeForm";

// ── DI DALAM COMPONENT, TAMBAHKAN STATE ──
const [promoMode, setPromoMode] = useState<PromoVideoMode>("standard");

// ── DI DALAM RETURN JSX, SEBELUM HEADER ATAU SETELAH HEADER ──
// Tambahkan PromoModeSelector:
<PromoModeSelector selected={promoMode} onChange={setPromoMode} />

// ── CONDITIONAL RENDER FORM SESUAI MODE ──
{promoMode === "standard" ? (
  // ... semua JSX form standard yang sudah ada ...
) : (
  <DramaModeForm />
)}
```

## Contoh Implementasi ProductPromoVideoForm.tsx

```tsx
"use client";

import { useState } from "react";
import useProductPromoGenerator from "./product-promo-video/useProductPromoGenerator";
import PromoModeSelector, {
  type PromoVideoMode,
} from "./product-promo-video/PromoModeSelector";
import DramaModeForm from "./product-promo-video/drama-mode/DramaModeForm";
// ... existing imports ...

export default function ProductPromoVideoForm() {
  const gen = useProductPromoGenerator();
  const [promoMode, setPromoMode] = useState<PromoVideoMode>("standard");

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
        {/* Header — tetap tampil di kedua mode */}
        <header className="mb-8 pb-6 border-b border-leaf/20">
          {/* ... existing header ... */}
        </header>

        {/* ── MODE SELECTOR — tambahan baru ── */}
        <PromoModeSelector selected={promoMode} onChange={setPromoMode} />

        {/* ── CONDITIONAL: Standard atau Drama Mode ── */}
        {promoMode === "standard" ? (
          <>{/* ... semua konten form standard yang sudah ada ... */}</>
        ) : (
          <DramaModeForm />
        )}
      </div>
      {/* Toast tetap di sini */}
    </div>
  );
}
```

## Ringkasan Fitur Drama Mode

| Fitur          | Detail                                                                  |
| -------------- | ----------------------------------------------------------------------- |
| Formula        | Setup Klise → Eskalasi Absurd → Twist Produk → CTA                      |
| Referensi      | Ogilvy Thailand, Korean drama tropes, sinetron hiperbola                |
| Template auto  | 10 kategori produk sudah punya template gimmick spesifik                |
| Mode instruksi | AUTO (AI pakai template) atau MANUAL (user input per babak)             |
| Durasi         | Min 2 menit, kalkulasi otomatis babak                                   |
| Output         | JSON lengkap per scene, siap untuk AI video generator                   |
| Bahasa         | Instruksi ke AI dalam Inggris, dialogue karakter dalam Bahasa Indonesia |
| Konsistensi    | continuityAnchor dikunci AI — karakter & produk identik semua scene     |
| CTA            | 2-3 scene dengan 5 style gimmick closing pilihan                        |
