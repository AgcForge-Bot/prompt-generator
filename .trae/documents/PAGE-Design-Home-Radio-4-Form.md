# Page Design Spec — Home (Radio 4 Form + Meta Dinamis)

## Global Styles
- Layout: desktop-first, max-width container (mis. 1100–1200px), center aligned.
- Spacing system: 8px base (8/16/24/32).
- Typography: 14–16px body, 20–24px section title.
- Color tokens (contoh):
  - Background: #0B0F19 / putih sesuai tema existing
  - Surface/card: kontras 1 tingkat dari background
  - Accent/primary: gunakan warna primary existing (dari `globals.css`/theme)
  - Focus ring: 2px outline yang jelas untuk aksesibilitas
- Button/inputs: tinggi input 40–44px, radius 8px, hover/focus state jelas.

## Page: Home

### Meta Information
- Title (default): menampilkan nama produk + form default.
- Description (default): deskripsi singkat fungsi form default.
- Dinamis: ketika kamu mengganti radio, title dan description ikut berubah sesuai pilihan form aktif.

### Layout
- Struktur utama: stacked sections (vertikal).
- Teknik layout:
  - Container: CSS Grid 2 kolom pada desktop (kolom kiri: radio menu; kolom kanan: area form).
  - Breakpoint tablet/mobile: turun menjadi 1 kolom (radio di atas, form di bawah).

### Page Structure
1. Top area (opsional sesuai existing UI): judul halaman + ringkasan singkat.
2. Main area: grid 2 kolom.
   - Kolom kiri: modul radio menu (4 opsi).
   - Kolom kanan: modul form container (menampilkan komponen form aktif).

### Sections & Components

#### A. Header (ringkas)
- Elemen:
  - H1: “Home” atau judul produk.
  - Paragraf helper (opsional): instruksi singkat memilih form.

#### B. Radio Menu (4 opsi)
- Komponen: `RadioGroup`
- Elemen:
  - Label grup (mis. “Pilih mode/form”)
  - 4 radio item (A, B, C, D) dengan label singkat.
- Interaction:
  - Klik label atau radio memilih opsi.
  - State terpilih jelas (border/warna accent + indicator).
  - Keyboard: arrow keys/space untuk navigasi.

#### C. Form Container (Switcher)
- Komponen: `FormSwitcher`
- Perilaku:
  - Hanya render satu komponen form sesuai pilihan.
  - Menjaga layout stabil saat switching (gunakan tinggi minimum/transition ringan bila perlu).

#### D. Form Components (Terpisah)
- Komponen: `FormA`, `FormB`, `FormC`, `FormD`
- Struktur internal minimal (konsisten antar form):
  - Section title (H2) mengikuti nama form.
  - Area fields (sesuai kebutuhan masing-masing form).
  - Area actions (jika ada) di bagian bawah, align kanan.
- Konsistensi:
  - Gunakan komponen input/button yang sama untuk semua form.

#### E. Meta Updater
- Komponen/utility: `MetaController`
- Perilaku:
  - Saat `selectedForm` berubah: memperbarui `document.title` dan meta description (tag `<meta name="description">`) agar sesuai pilihan.

### Responsive Behavior
- Desktop: 2 kolom (radio ~280–320px; form fleksibel).
- Mobile: 1 kolom; radio menjadi list horizontal wrap atau vertical stack.

### Motion/Transitions (opsional)
- Transition 150–200ms untuk hover/focus.
- Switching form: fade ringan 150ms (hindari animasi berat).
