# 📋 Panduan Integrasi — All-in-One Prompt Generator

## Struktur File

```
src/
├── app/api/all-in-one-generator/
│   └── route.ts                          ← COPY dari api/route.ts
└── components/forms/all-in-one/
    ├── AllInOnePromptGeneratorForm.tsx   ← Main form wrapper
    ├── types.ts                          ← TypeScript types
    ├── constants.ts                      ← Data tema, outfit, durasi, dll
    ├── promptBuilder.ts                  ← Engine prompt AI + Remotion script
    ├── useAllInOneGenerator.ts           ← State + logic hook
    └── sections/
        ├── DnaSection.tsx               ← Tab 1: Konfigurasi DNA
        ├── SceneConfigSection.tsx       ← Tab 2: Per-scene setup + image
        └── OutputSection.tsx            ← Tab 3: Generate + export + Remotion modal
```

## Langkah Integrasi

```bash
# 1. Copy folder
cp -r all-in-one/ src/components/forms/

# 2. API Route
mkdir -p src/app/api/all-in-one-generator
cp all-in-one/api/route.ts src/app/api/all-in-one-generator/route.ts

# 3. Update HomeClient.tsx — lihat PATCH_HomeClient.txt
```

## Flow Tools

```
Tab 1: DNA Konfigurasi
  → Pilih durasi + sec/scene → kalkulasi scene otomatis
  → Pilih tema (5 tema)
  → Pilih visual style (Cinematic / Hyper Realistic / dll)
  → Input judul + inti storyboard
  → Pilih model character + outfit (khusus forest-build)
  → Pilih AI provider + model (dari modelProviders.ts)
  → Klik "Kunci DNA" → pindah ke Tab 2

Tab 2: Scene Setup
  → Navigator scene (chips visual status)
  → Per scene: input storyboard + upload 1-3 image referensi
  → AI otomatis analisa gambar saat upload
  → Bisa generate per scene satu per satu

Tab 3: Generate & Output
  → "Generate All" → AI generate semua scene sekuensial
  → "Generate All + Export Script" → Generate semua + buka Remotion modal
  → View per prompt, copy, download .txt
  → Remotion modal: guide 3 langkah + script siap copy ke Claude Code
```

## Fitur Video Generate (Remotion)

**Status:** Fitur placeholder yang realistis — tidak bisa di-server karena keterbatasan Vercel.

**Yang terjadi ketika klik "Generate All + Export Script":**

1. Generate semua scene prompt (seperti biasa)
2. Buka modal dengan script bash siap pakai untuk Claude Code
3. User copy script → paste ke terminal Claude Code yang sudah install `remotion dev skill`
4. Claude Code buat Remotion project → browser preview → export MP4

**Requirement untuk video generate:**

- Claude Pro/Max account
- Claude Code terinstall di komputer lokal
- `npx skills add remotion dev skill` sudah dijalankan
