# تبدیل گفتار به متن فارسی — Persian Speech-to-Text

A lightweight, zero-dependency, full-featured web app that converts spoken **Persian (fa-IR)** into text using the browser's built-in **Web Speech API**, featuring custom vocabulary management, smart ZWNJ (نیم‌فاصله), voice commands, live audio visualization, and offline PWA support.

---

## ✨ Features

- 🎙️ **Live Continuous Persian Dictation:** High-precision speech-to-text with auto-recovery and non-stop stream recycling (prevents browser/silence drops).
- 🏥 **Medical & Technical Dictionaries:**
  - **Comprehensive Medical Dictionary:** 40+ clinical, pharmaceutical, anatomical, diagnostic, and specialty terms (e.g. *«اکوکاردیوگرافی»*, *«آندوسکوپی»*, *«استامینوفن»*, *«هموگلوبین»*, *«سی‌تی‌اسکن»*, *«پاتولوژی»*) with built-in spoken aliases.
  - **One-Click Vocabulary Packs:** Quickly load the Medical Pack or Tech Pack with dedicated buttons in the Vocabulary Manager.
  - Multi-alternative acoustic hypothesis evaluation (`maxAlternatives: 3`) to catch specialized words before common fallbacks.
  - Automatic phonetic alias mapping and fuzzy Levenshtein matching.
  - JSON backup, restore, and category filtering (Tech, AI, General, Medical).
- ✍️ **Persian Orthography & Smart ZWNJ (نیم‌فاصله):**
  - Automatic affix formatting for prefixes (*«می‌»*, *«نمی‌»*, *«بی‌»*) and suffixes (*«‌ها»*, *«‌ترین»*, *«‌سازی»*, *«‌پذیری»*).
  - Punctuation spacing and duplicate mark cleanup.
  - Persian digits toggle (`۱۲۳` vs `123`).
- ✍️ **Directly Editable Transcript & Undo/Redo:**
  - Click and type directly in the transcript while recording or paused.
  - Full Undo / Redo history stack (`Ctrl+Z` / `Ctrl+Y`).
- 📊 **Live Microphone Waveform Visualizer:** Real-time Web Audio API visualizer showing microphone input levels.
- 🗣️ **Persian Voice Commands:** Speak commands to stop recording, clear text, copy, download, switch languages, or insert punctuation marks.
- 💾 **Extended Export Options:**
  - Plain Text (`.txt` with UTF-8 BOM).
  - Markdown (`.md` with metadata frontmatter).
  - Print / Save as PDF (custom print stylesheet).
- ⌨️ **Keyboard Shortcuts:** `Space` / `Alt+S` to record, `Ctrl+Shift+C` to copy, `Ctrl+S` to save, `Ctrl+Z`/`Ctrl+Y` to undo/redo, `Esc` to close modals.
- 📱 **Progressive Web App (PWA):** Installable on Android, iOS, and desktop with offline app shell caching.
- 🌐 **Bilingual UI:** Instant toggle between **فارسی (RTL)** and **English (LTR)**.
- 🌙 **Dark & Light Mode:** Seamlessly matches system preferences.

---

## 🗣️ Voice Commands (دستورهای صوتی)

Speak any of these commands **while recording** — commands are automatically detected, executed, and stripped from your dictation text:

| Say (بگویید…) | Effect (عملکرد) |
| :--- | :--- |
| «توقف» / «بس کن» / «تمام کن» | Stop recording |
| «پاک کن» / «حذف کن» | Clear transcript |
| «کپی کن» / «کپی» | Copy text to clipboard |
| «دانلود کن» / «ذخیره کن» | Download text file |
| «پاکسازی نگارشی» / «مرتب کن» | Re-format & clean orthography |
| «واگرد» / «برگردان» | Undo last change |
| «واژه‌نامه» / «کلمات تخصصی» | Open vocabulary manager |
| «زبان انگلیسی» / «زبان فارسی» / «تغییر زبان» | Switch UI language |
| «راهنما» / «کمک» / «دستورها» | Open help & shortcuts |
| «بستن» / «ببند» | Close open modals |
| «نقطه» | Insert `.` |
| «ویرگول» / «کاما» | Insert `،` |
| «علامت سوال» / «علامت پرسش» | Insert `؟` |
| «علامت تعجب» | Insert `!` |
| «دو نقطه» | Insert `:` |
| «نقطه ویرگول» | Insert `؛` |
| «خط جدید» / «سطر جدید» | Insert a new line |

---

## ⌨️ Keyboard Shortcuts (کلیدهای میانبر)

| Shortcut | Action |
| :--- | :--- |
| `Space` or `Alt + S` | Toggle recording on / off |
| `Ctrl + Z` | Undo transcript change |
| `Ctrl + Y` or `Ctrl + Shift + Z` | Redo transcript change |
| `Ctrl + Shift + C` | Copy full transcript to clipboard |
| `Ctrl + S` | Quick download as `.txt` |
| `Esc` | Close open modals and menus |

---

## 🚀 Run It Locally

Any static server works — no build steps, no external node packages required:

```bash
# Python 3
python3 -m http.server 8080

# Or Node.js
npx serve .
```

Then open `http://localhost:8080` in Chrome or Edge.

---

## 🌐 Requirements & Browser Compatibility

- **Chrome** or **Microsoft Edge** (desktop or Android) — the Web Speech API `fa-IR` cloud endpoint is powered natively in Chromium.
- **Microphone permission** and an **internet connection** (audio is processed securely by the browser's speech service).

---

## 📁 File Structure

| File | Description |
| :--- | :--- |
| `index.html` | Semantic markup with bilingual `data-i18n` support, toolbar, and modals |
| `styles.css` | Modern CSS with theme variables, visualizer styling, responsive layout, and print styles |
| `app.js` | Core recognition engine, smart vocabulary manager, ZWNJ formatter, audio visualizer, undo/redo stack, and i18n |
| `sw.js` | Service Worker providing offline PWA caching |
| `manifest.json` | Web App Manifest for mobile/desktop installability |
| `icon.svg` | Vector application icon |
