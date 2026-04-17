# Prompt Video Generator

## Struktur Folder & File

Struktur di bawah ini dibuat untuk memudahkan maintenance. Folder besar/hasil generate tidak dicantumkan agar README tetap terbaca:

- Tidak ditampilkan: `node_modules/`, `.next/`, `.git/`, `.pnpm-store/`, `dist/`, `build/`, `out/`, `coverage/`

```text
prompt-video-generator/
├── .editorconfig
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── tsconfig.json
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── example/
│   ├── asmr_timelapse_prompt_generator_v3.html
│   ├── fastfurious_carparty_prompt_generator.html
│   ├── relaxing_music_video_prompt_generator_v1.html
│   └── war_cinematic_prompt_generator.html
├── .trae/
│   └── documents/
│       ├── PAGE-Design-Home-Radio-4-Form.md
│       ├── PRD-Home-Radio-4-Form.md
│       └── TECH-Architecture-Home-Radio-4-Form.md
└── src/
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── api/
    │       ├── analyze-image/
    │       │   └── route.ts
    │       ├── analyze-product/
    │       │   └── route.ts
    │       └── transform-description/
    │           └── route.ts
    ├── types/
    │   └── index.d.ts
    ├── lib/
    │   ├── data.ts
    │   ├── prompt-builder.ts
    │   └── scene-generator.ts
    └── components/
        ├── OldHomeBackup.tsx
        └── forms/
            ├── AsmrTimelapseConstructorForm.tsx
            ├── CarMusicVideoClipForm.tsx
            ├── ForestBuildPrimitiveCraftForm.tsx
            ├── RelaxingMusicVideoForm.tsx
            ├── WarMusicVideoClipForm.tsx
            ├── asmr/
            │   ├── constants.ts
            │   ├── promptBuilder.ts
            │   ├── types.ts
            │   ├── useAsmrTimelapseGenerator.ts
            │   ├── utils.ts
            │   └── sections/
            │       ├── DurationEngineSection.tsx
            │       ├── ExportAllPromptsSection.tsx
            │       ├── HeaderSection.tsx
            │       ├── ProgressSection.tsx
            │       ├── ProjectDnaSection.tsx
            │       ├── ProjectTypeSection.tsx
            │       ├── PromptOutputSection.tsx
            │       ├── RandomGeneratorSection.tsx
            │       ├── SceneConfigSection.tsx
            │       ├── ScenePhaseSection.tsx
            │       ├── TimeOfDaySection.tsx
            │       ├── TimelineSection.tsx
            │       └── tabs/
            │           ├── AsmrTab.tsx
            │           ├── CameraTab.tsx
            │           ├── EquipmentTab.tsx
            │           ├── LightingTab.tsx
            │           ├── NarrationTab.tsx
            │           └── TimelapseTab.tsx
            ├── car-music/
            │   ├── constants.ts
            │   ├── promptBuilder.ts
            │   ├── types.ts
            │   ├── useCarMusicVideoGenerator.ts
            │   ├── utils.ts
            │   └── sections/
            │       ├── ExportAllPromptsSection.tsx
            │       ├── HeaderSection.tsx
            │       ├── PromptOutputSection.tsx
            │       ├── RandomGeneratorSection.tsx
            │       ├── SceneConfigSection.tsx
            │       ├── SceneTypeSection.tsx
            │       ├── TimelineSection.tsx
            │       └── tabs/
            │           ├── CameraTab.tsx
            │           ├── CarsTab.tsx
            │           ├── CrowdTab.tsx
            │           ├── DjTab.tsx
            │           ├── LightingTab.tsx
            │           ├── LocationTab.tsx
            │           └── PropsTab.tsx
            ├── relaxing-music/
            │   ├── constants.ts
            │   ├── promptBuilder.ts
            │   ├── types.ts
            │   ├── useRelaxingMusicVideoGenerator.ts
            │   ├── utils.ts
            │   └── sections/
            │       ├── DurationEngineSection.tsx
            │       ├── ExportAllPromptsSection.tsx
            │       ├── HeaderSection.tsx
            │       ├── ProgressSection.tsx
            │       ├── PromptOutputSection.tsx
            │       ├── RandomGeneratorSection.tsx
            │       ├── SceneConfigSection.tsx
            │       ├── SceneTypeSection.tsx
            │       ├── TimeOfDaySection.tsx
            │       ├── TimelineSection.tsx
            │       └── tabs/
            │           ├── AnimalsTab.tsx
            │           ├── DroneTab.tsx
            │           ├── ElementsTab.tsx
            │           ├── LightingTab.tsx
            │           ├── LocationTab.tsx
            │           ├── NatureTab.tsx
            │           ├── StyleTab.tsx
            │           └── VisualsTab.tsx
            ├── war-music/
            │   ├── constants.ts
            │   ├── promptBuilder.ts
            │   ├── types.ts
            │   ├── useWarMusicVideoGenerator.ts
            │   ├── utils.ts
            │   └── sections/
            │       ├── ExportAllPromptsSection.tsx
            │       ├── HeaderSection.tsx
            │       ├── PromptOutputSection.tsx
            │       ├── RandomGeneratorSection.tsx
            │       ├── SceneConfigSection.tsx
            │       ├── SceneTypeSection.tsx
            │       ├── TimelineSection.tsx
            │       └── tabs/
            │           ├── CameraTab.tsx
            │           ├── CivilianTab.tsx
            │           ├── DjTab.tsx
            │           ├── LightingTab.tsx
            │           ├── LocationTab.tsx
            │           ├── SoldiersTab.tsx
            │           ├── VehiclesTab.tsx
            │           └── VfxTab.tsx
            ├── forest-build/
            │   ├── DurationEngineSection.tsx
            │   ├── ExportAllPromptsSection.tsx
            │   ├── Field.tsx
            │   ├── ImageReferenceSection.tsx
            │   ├── PhaseNavigationSection.tsx
            │   ├── ProjectDnaSection.tsx
            │   ├── PromptOutputSection.tsx
            │   ├── SceneConfigSection.tsx
            │   ├── SceneEditorSection.tsx
            │   ├── Sel.tsx
            │   ├── TimeOfDaySection.tsx
            │   ├── constants.ts
            │   ├── promptBuilder.ts
            │   ├── sceneGenerator.ts
            │   ├── types.ts
            │   ├── useForestBuildGenerator.ts
            │   ├── useForestBuildImageState.ts
            │   ├── useForestBuildProjectState.ts
            │   ├── useForestBuildPromptState.ts
            │   ├── useToast.ts
            │   └── utils.ts
            └── product-promo-video/
                ├── ProductPromoVideoForm.tsx
                ├── constants.ts
                ├── promptBuilder.ts
                ├── types.ts
                ├── useProductPromoGenerator.ts
                ├── useProductPromoImageState.ts
                └── sections/
                    ├── CategoryAndModelSections.tsx
                    ├── ConfigSections.tsx
                    ├── ProductInfoSection.tsx
                    └── SceneOutputSection.tsx
```

## Entry Point Penting

- Home (selector semua tools): [page.tsx](file:///d:/laragon/www/tools/Prompt-Video-Generator/prompt-video-generator/src/app/page.tsx)
- Global styling + utility class untuk form: [globals.css](file:///d:/laragon/www/tools/Prompt-Video-Generator/prompt-video-generator/src/app/globals.css)
- API routes (App Router):
  - Vision analyze image: [route.ts](file:///d:/laragon/www/tools/Prompt-Video-Generator/prompt-video-generator/src/app/api/analyze-image/route.ts)
  - Analyze product: [route.ts](file:///d:/laragon/www/tools/Prompt-Video-Generator/prompt-video-generator/src/app/api/analyze-product/route.ts)
  - Transform description: [route.ts](file:///d:/laragon/www/tools/Prompt-Video-Generator/prompt-video-generator/src/app/api/transform-description/route.ts)

## Pola Arsitektur Form (konsisten)

Semua generator form mengikuti pola:

- `src/components/forms/<NamaForm>.tsx` = wrapper (render sections + toast)
- `src/components/forms/<tool-folder>/` =
  - `constants.ts` / `types.ts` / `utils.ts` / `promptBuilder.ts`
  - `use<...>Generator.ts` (state + handler)
  - `sections/` + `sections/tabs/` (UI per bagian)

## Ringkasan Fungsi Folder

- `src/app/` = Next App Router (Home, layout, CSS global, dan API routes).
- `src/app/page.tsx` = Home selector (radio card) untuk memilih tool/form.
- `src/app/api/*/route.ts` = Route handler API (server-side).
- `src/components/forms/` = Seluruh UI form generator (wrapper + folder tool).
- `src/components/forms/<tool>/use...Generator.ts` = Sumber state + handler utama tool itu (generate/copy/export/random).
- `src/components/forms/<tool>/promptBuilder.ts` = Builder string prompt (format output prompt).
- `src/components/forms/<tool>/constants.ts` = Opsi dropdown, default, scene types, time-of-day, dll.
- `src/components/forms/<tool>/types.ts` = Tipe data (SceneConfig/DNA/Generator API).
- `src/components/forms/<tool>/sections/` = Bagian UI yang dipisah agar file pendek (header, timeline, duration engine, output, export).
- `src/components/forms/<tool>/sections/tabs/` = Tab panel per kategori konfigurasi (mis. kamera/lighting/props).
- `src/components/forms/forest-build/Field.tsx` & `Sel.tsx` = Komponen input dasar yang dipakai lintas tool.
- `src/components/forms/forest-build/useToast.ts` = Toast kecil untuk feedback aksi (copy, generate, dsb).
- `src/lib/` = Helper/engine generik (prompt builder lama, scene generator, data util).
- `src/types/` = Tipe global/shared untuk request/response API dan app.
- `public/` = Asset statis (ikon/svgs).
- `example/` = HTML sumber referensi (aslinya sebelum dikonversi ke React).
- `.trae/documents/` = Dokumen PRD/arsitektur/desain internal untuk panduan struktur.
