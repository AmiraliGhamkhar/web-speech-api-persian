# تبدیل گفتار به متن فارسی — Persian Speech-to-Text

A lightweight, zero-dependency web app that turns spoken **Persian (fa-IR)** into
text using the browser's built-in **Web Speech API**.

## Features

- 🎙️ Live Persian dictation with `continuous` + `interim` results
- 🔁 Auto-restart (Chrome sometimes ends the stream on its own despite `continuous: true`)
- 🗣️ **Persian voice commands** — control the app and insert punctuation by speaking (say «راهنما» while recording to open the cheat sheet)
- 🌐 Bilingual UI — **فارسی (RTL)** / **English (LTR)** with a one-click toggle (choice is remembered)
- 📝 Copy to clipboard, download as `.txt` (UTF-8 with BOM), clear (two-step confirm)
- 📊 Live stats: word / character / segment counts, plus a session timer
- 🌙 Light & dark mode (follows the OS)
- ⚠️ Graceful handling of unsupported browsers and recognition errors

## Voice commands (فارسی)

Say any of these **while recording** — commands are detected in the recognized
text, removed from the transcript, and executed. A question-mark button (?) in
the header opens the full cheat sheet.

| Say… | Effect |
| ---- | ------ |
| «توقف» / «بس کن» / «تمام کن» | Stop recording |
| «پاک کن» / «حذف کن» | Clear the transcript |
| «کپی کن» | Copy text to clipboard |
| «دانلود کن» / «ذخیره کن» | Download as `.txt` |
| «زبان انگلیسی» / «زبان فارسی» / «تغییر زبان» | Switch UI language |
| «راهنما» / «کمک» | Open the command list |
| «بستن» | Close the command list |
| «نقطه» / «ویرگول» / «علامت سوال» / «علامت تعجب» | Insert `.` `،` `؟` `!` |
| «دو نقطه» / «نقطه ویرگول» | Insert `:` `؛` |
| «خط جدید» / «سطر جدید» | Insert a new line |

Matching normalizes Arabic/Persian character variants (ی/ي/ى/ئ، ک/ك، …) and
ignores diacritics and ZWNJ, so minor variations still register.

## Run it

Any static server works — no build step, no dependencies.

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` directly in your browser.

## Requirements

- **Chrome** or **Edge** (desktop or Android) — the Web Speech API is not
  available in Firefox/Safari for `fa-IR`.
- **Microphone permission** and an **internet connection** (audio is streamed to
  the browser's speech service for processing).

## Files

| File          | Purpose                                   |
| ------------- | ----------------------------------------- |
| `index.html`  | Page structure (bilingual via `data-i18n`) |
| `styles.css`  | Styling, RTL/LTR, dark mode               |
| `app.js`      | Recognition logic, i18n, UI state         |
