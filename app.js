(() => {
  'use strict';

  /* ============================================================
   *  Persian Speech-to-Text with the Web Speech API
   *  Recognition always runs in fa-IR; the UI is bilingual.
   *  Persian voice commands control the app and insert punctuation.
   * ============================================================ */

  const RECOGNITION_LANG = 'fa-IR';

  /* ------------------------------------------------------------
   *  Voice commands. Aliases are stored in canonical Persian form
   *  (ک/ی, no ZWNJ, no diacritics) and matched against normalized
   *  speech. Multi-word aliases are matched before shorter ones so
   *  e.g. «نقطه ویرگول» wins over «نقطه».
   * ------------------------------------------------------------ */
  const COMMANDS = [
    { id: 'stop', group: 'control', aliases: ['توقف', 'بس کن', 'تمام کن'], action: 'stop' },
    { id: 'clear', group: 'control', aliases: ['پاک کن متن', 'پاک کن', 'حذف کن متن', 'حذف کن'], action: 'clear' },
    { id: 'copy', group: 'control', aliases: ['کپی کن', 'کپی'], action: 'copy' },
    { id: 'download', group: 'control', aliases: ['دانلود کن', 'ذخیره کن'], action: 'download' },
    { id: 'lang-en', group: 'control', aliases: ['زبان انگلیسی'], action: 'lang-en' },
    { id: 'lang-fa', group: 'control', aliases: ['زبان فارسی'], action: 'lang-fa' },
    { id: 'lang-toggle', group: 'control', aliases: ['تغییر زبان'], action: 'lang-toggle' },
    { id: 'help', group: 'control', aliases: ['راهنما', 'کمک', 'دستورها'], action: 'help' },
    { id: 'close', group: 'control', aliases: ['بستن', 'ببند'], action: 'close' },
    { id: 'period', group: 'punct', aliases: ['نقطه'], punct: '.' },
    { id: 'comma', group: 'punct', aliases: ['ویرگول'], punct: '،' },
    { id: 'question', group: 'punct', aliases: ['علامت سوال'], punct: '؟' },
    { id: 'exclamation', group: 'punct', aliases: ['علامت تعجب'], punct: '!' },
    { id: 'colon', group: 'punct', aliases: ['دو نقطه'], punct: ':' },
    { id: 'semicolon', group: 'punct', aliases: ['نقطه ویرگول'], punct: '؛' },
    { id: 'newline', group: 'punct', aliases: ['خط جدید', 'سطر جدید', 'خط بعد'], punct: '\n' },
  ];

  // Flatten aliases for matching, longest (multi-word) first.
  const ALIASES = [];
  COMMANDS.forEach((cmd) => {
    cmd.aliases.forEach((alias) => {
      ALIASES.push({ cmd, words: alias.split(' ') });
    });
  });
  ALIASES.sort((a, b) => b.words.length - a.words.length);

  const STRINGS = {
    fa: {
      dir: 'rtl',
      title: 'تبدیل گفتار به متن فارسی',
      subtitle: 'دیکتهٔ زنده با Web Speech API',
      toggleLabel: 'English',
      start: 'شروع گفتار',
      stop: 'توقف',
      statusIdle: 'آمادهٔ شنیدن',
      statusListening: 'در حال شنیدن…',
      statusError: 'خطا',
      placeholder: 'متن گفتار شما اینجا نمایش داده می‌شود…',
      copy: 'کپی',
      copied: 'در کلیپ‌بورد کپی شد',
      copyFailed: 'کپی ناموفق بود',
      download: 'دانلود',
      downloaded: 'فایل دانلود شد',
      clear: 'پاک کردن',
      confirmClear: 'برای تأیید دوباره بزنید',
      cleared: 'متن پاک شد',
      empty: 'متنی برای این کار وجود ندارد',
      wordCount: 'کلمه',
      charCount: 'نویسه',
      segmentCount: 'بخش',
      unsupportedTitle: 'مرورگر شما از Web Speech API پشتیبانی نمی‌کند',
      unsupportedText:
        'لطفاً از Chrome یا Edge استفاده کنید. تشخیص گفتار فارسی نیازمند اتصال اینترنت است.',
      footerNote:
        'تشخیص گفتار همیشه با زبان fa-IR انجام می‌شود و صدا برای پردازش به سرویس گفتار مرورگر ارسال می‌شود.',
      helpButton: 'راهنمای دستورها',
      closeHelp: 'بستن',
      helpTitle: 'دستورهای صوتی',
      helpSub: 'در حال ضبط، این فرمان‌ها را بگویید — فرمان‌ها از متن حذف می‌شوند:',
      helpControl: 'کنترل برنامه',
      helpPunct: 'نشانه‌گذاری',
      hint: 'نکته: در حال ضبط بگویید «راهنما» تا فهرست فرمان‌ها را ببینید.',
      stoppedByCommand: 'ضبط با فرمان صوتی متوقف شد',
      commandLabels: {
        stop: 'توقف ضبط',
        clear: 'پاک کردن متن',
        copy: 'کپی متن',
        download: 'دانلود فایل',
        'lang-en': 'تغییر زبان به انگلیسی',
        'lang-fa': 'تغییر زبان به فارسی',
        'lang-toggle': 'تغییر زبان',
        help: 'نمایش این راهنما',
        close: 'بستن راهنما',
        period: '. نقطه',
        comma: '، ویرگول',
        question: '؟ علامت سوال',
        exclamation: '! علامت تعجب',
        colon: ': دو نقطه',
        semicolon: '؛ نقطه ویرگول',
        newline: '↵ خط جدید',
      },
      errors: {
        'no-speech': 'صدایی تشخیص داده نشد. دوباره تلاش کنید…',
        aborted: 'شناسایی متوقف شد',
        'audio-capture': 'میکروفونی پیدا نشد',
        network: 'خطای شبکه. اتصال اینترنت را بررسی کنید',
        'not-allowed': 'دسترسی به میکروفون رد شد',
        'service-not-allowed': 'سرویس تشخیص گفتار مجاز نیست',
        'language-not-supported': 'زبان فارسی (fa-IR) در این مرورگر پشتیبانی نمی‌شود',
        default: 'خطای ناشناخته در تشخیص گفتار',
      },
    },
    en: {
      dir: 'ltr',
      title: 'Persian Speech to Text',
      subtitle: 'Live dictation with the Web Speech API',
      toggleLabel: 'فارسی',
      start: 'Start listening',
      stop: 'Stop',
      statusIdle: 'Ready',
      statusListening: 'Listening…',
      statusError: 'Error',
      placeholder: 'Your transcribed speech will appear here…',
      copy: 'Copy',
      copied: 'Copied to clipboard',
      copyFailed: 'Copy failed',
      download: 'Download',
      downloaded: 'File downloaded',
      clear: 'Clear',
      confirmClear: 'Click again to confirm',
      cleared: 'Transcript cleared',
      empty: 'There is nothing to process yet',
      wordCount: 'words',
      charCount: 'characters',
      segmentCount: 'segments',
      unsupportedTitle: "Your browser doesn't support the Web Speech API",
      unsupportedText:
        'Please use Chrome or Edge. Persian speech recognition requires an internet connection.',
      footerNote:
        'Recognition always runs in Persian (fa-IR); your audio is sent to the browser\u2019s speech service for processing.',
      helpButton: 'Voice commands',
      closeHelp: 'Close',
      helpTitle: 'Voice commands',
      helpSub: 'While recording, say any of these — commands are removed from the transcript:',
      helpControl: 'App controls',
      helpPunct: 'Punctuation',
      hint: 'Tip: while recording, say “راهنما” (help) to open this list.',
      stoppedByCommand: 'Recording stopped by voice command',
      commandLabels: {
        stop: 'Stop recording',
        clear: 'Clear transcript',
        copy: 'Copy text',
        download: 'Download file',
        'lang-en': 'Switch UI to English',
        'lang-fa': 'Switch UI to Persian',
        'lang-toggle': 'Switch UI language',
        help: 'Show this help',
        close: 'Close help',
        period: '. Period',
        comma: '، Comma',
        question: '؟ Question mark',
        exclamation: '! Exclamation mark',
        colon: ': Colon',
        semicolon: '؛ Semicolon',
        newline: '↵ New line',
      },
      errors: {
        'no-speech': 'No speech detected. Trying again…',
        aborted: 'Recognition was interrupted',
        'audio-capture': 'No microphone was found',
        network: 'Network error. Check your internet connection',
        'not-allowed': 'Microphone access was denied',
        'service-not-allowed': 'The speech service is not allowed',
        'language-not-supported': 'Persian (fa-IR) is not supported in this browser',
        default: 'Unknown speech recognition error',
      },
    },
  };

  const els = {
    html: document.documentElement,
    langToggle: document.getElementById('langToggle'),
    langToggleLabel: document.getElementById('langToggleLabel'),
    helpBtn: document.getElementById('helpBtn'),
    helpModal: document.getElementById('helpModal'),
    helpBackdrop: document.getElementById('helpBackdrop'),
    helpClose: document.getElementById('helpClose'),
    helpListControl: document.getElementById('helpListControl'),
    helpListPunct: document.getElementById('helpListPunct'),
    unsupported: document.getElementById('unsupported'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    timer: document.getElementById('timer'),
    transcriptCard: document.querySelector('.transcript-card'),
    transcript: document.getElementById('transcript'),
    startBtn: document.getElementById('startBtn'),
    startLabel: document.getElementById('startLabel'),
    startIconMic: document.getElementById('startIconMic'),
    startIconStop: document.getElementById('startIconStop'),
    copyBtn: document.getElementById('copyBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    clearBtn: document.getElementById('clearBtn'),
    clearLabel: document.getElementById('clearLabel'),
    wordCount: document.getElementById('wordCount'),
    charCount: document.getElementById('charCount'),
    segmentCount: document.getElementById('segmentCount'),
    toast: document.getElementById('toast'),
  };

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const supported = Boolean(SpeechRecognition);

  const state = {
    listening: false,
    startTime: 0,
    timerId: null,
  };

  let recognition = null;
  let finalSegments = [];
  let interimText = '';
  let clearArmed = false;
  let clearArmTimer = null;
  let toastTimer = null;

  let lang = (() => {
    try {
      return localStorage.getItem('stt-lang') || 'fa';
    } catch {
      return 'fa';
    }
  })();
  if (lang !== 'fa' && lang !== 'en') lang = 'fa';

  const t = () => STRINGS[lang];

  /* ---------- Persian text normalization (for matching only) ---------- */

  function normalizePersian(text) {
    return String(text)
      .replace(/[يىئ]/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/[\u064B-\u065F\u0670]/g, '') // diacritics (tashkeel)
      .replace(/[\u200C\u200B]/g, '') // ZWNJ / zero-width space
      .replace(/[^\u0621-\u063A\u0641-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ---------- Voice command detection ---------- */

  // Splits a recognized chunk into words, extracts any voice commands
  // (removing them) and replaces punctuation commands with their symbol.
  function processFinalChunk(raw) {
    const originalWords = raw.split(/\s+/).filter(Boolean);
    const normWords = originalWords.map(normalizePersian);
    const consumed = new Array(originalWords.length).fill(false);
    const replacements = {};
    const fired = new Set();

    for (const entry of ALIASES) {
      for (let i = 0; i <= normWords.length - entry.words.length; i++) {
        let match = true;
        for (let j = 0; j < entry.words.length; j++) {
          if (consumed[i + j] || normWords[i + j] !== entry.words[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          for (let j = 0; j < entry.words.length; j++) consumed[i + j] = true;
          if (entry.cmd.punct != null) replacements[i] = entry.cmd.punct;
          fired.add(entry.cmd.id);
          break;
        }
      }
    }

    const out = [];
    for (let i = 0; i < originalWords.length; i++) {
      if (replacements[i] != null) {
        out.push(replacements[i]);
        continue;
      }
      if (!consumed[i]) out.push(originalWords[i]);
    }

    return { fired, text: out.join(' ') };
  }

  function executeCommand(id) {
    switch (id) {
      case 'stop':
        stopListening();
        showToast(t().stoppedByCommand);
        break;
      case 'clear':
        doClear();
        break;
      case 'copy':
        doCopy();
        break;
      case 'download':
        doDownload();
        break;
      case 'lang-en':
        setLang('en');
        break;
      case 'lang-fa':
        setLang('fa');
        break;
      case 'lang-toggle':
        setLang(lang === 'fa' ? 'en' : 'fa');
        break;
      case 'help':
        openHelp();
        break;
      case 'close':
        closeHelp();
        break;
      default:
        break;
    }
  }

  /* ---------- i18n ---------- */

  function applyLang() {
    const s = t();
    els.html.lang = lang;
    els.html.dir = s.dir;
    document.title = s.title;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key in s) el.textContent = s[key];
    });

    els.langToggleLabel.textContent = s.toggleLabel;
    els.transcript.setAttribute('data-placeholder', s.placeholder);
    els.helpBtn.setAttribute('aria-label', s.helpButton);
    els.helpClose.setAttribute('aria-label', s.closeHelp);

    // Re-sync dynamic labels that may have been overridden.
    els.startLabel.textContent = state.listening ? s.stop : s.start;
    els.clearLabel.textContent = s.clear;
    if (clearArmed) disarmClear();
    renderStatus();
    buildHelpList();
  }

  function setLang(next) {
    lang = next === 'en' ? 'en' : 'fa';
    try {
      localStorage.setItem('stt-lang', lang);
    } catch {
      /* ignore */
    }
    applyLang();
  }

  function buildHelpList() {
    const s = t();
    els.helpListControl.textContent = '';
    els.helpListPunct.textContent = '';
    COMMANDS.forEach((cmd) => {
      const li = document.createElement('li');
      const say = document.createElement('code');
      say.className = 'help-say';
      say.textContent = cmd.aliases.slice(0, 3).join(' / ');
      const act = document.createElement('span');
      act.className = 'help-action';
      act.textContent = s.commandLabels[cmd.id] || '';
      li.appendChild(say);
      li.appendChild(act);
      (cmd.group === 'control' ? els.helpListControl : els.helpListPunct).appendChild(li);
    });
  }

  function openHelp() {
    buildHelpList();
    els.helpModal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closeHelp() {
    els.helpModal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  /* ---------- Status ---------- */

  function renderStatus() {
    const s = t();
    els.statusDot.classList.toggle('listening', state.listening);
    if (state.listening) {
      els.statusText.textContent = s.statusListening;
    } else {
      els.statusText.textContent = s.statusIdle;
    }
  }

  function showError(code) {
    const s = t();
    els.statusDot.classList.add('error');
    els.statusDot.classList.remove('listening');
    els.statusText.textContent = s.errors[code] || s.errors.default;
  }

  /* ---------- Transcript ---------- */

  function cleanSpacing(text) {
    return text
      .replace(/[ \t]+/g, ' ')
      .replace(/ +([.,،؟!؛:])/g, '$1')
      .replace(/ *\n */g, '\n')
      .trim();
  }

  function fullText() {
    return cleanSpacing(finalSegments.join(' '));
  }

  function hasContent() {
    return finalSegments.length > 0 || interimText.length > 0;
  }

  function renderTranscript() {
    els.transcript.textContent = '';
    els.transcript.appendChild(document.createTextNode(fullText()));
    if (interimText) {
      const span = document.createElement('span');
      span.className = 'interim';
      span.textContent = (finalSegments.length ? ' ' : '') + interimText;
      els.transcript.appendChild(span);
    }
    els.transcript.scrollTop = els.transcript.scrollHeight;
    updateStats();
    updateSecondaryButtons();
  }

  function updateStats() {
    const text = (finalSegments.join(' ') + ' ' + interimText).trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = fullText().length;
    els.wordCount.textContent = String(words);
    els.charCount.textContent = String(chars);
    els.segmentCount.textContent = String(finalSegments.length);
  }

  function updateSecondaryButtons() {
    const has = hasContent();
    els.copyBtn.disabled = !has;
    els.downloadBtn.disabled = !has;
    els.clearBtn.disabled = !has;
  }

  /* ---------- Timer ---------- */

  function startTimer() {
    state.startTime = Date.now();
    els.timer.textContent = '00:00';
    state.timerId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      const pad = (n) => String(n).padStart(2, '0');
      els.timer.textContent = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    }, 250);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  /* ---------- Speech recognition ---------- */

  function initRecognition() {
    const rec = new SpeechRecognition();
    rec.lang = RECOGNITION_LANG;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const raw = (result[0] && result[0].transcript) || '';
          const processed = processFinalChunk(raw);
          if (processed.text) finalSegments.push(processed.text);
          interimText = '';
          processed.fired.forEach(executeCommand);
        } else {
          interimText = (result[0] && result[0].transcript) || '';
        }
      }
      renderTranscript();
    };

    rec.onerror = (event) => {
      const code = event.error || 'default';
      if (code === 'no-speech' || code === 'aborted') {
        // Benign: keep the session alive; onend will restart if needed.
        return;
      }
      stopListening();
      showError(code);
      showToast(t().errors[code] || t().errors.default);
    };

    rec.onend = () => {
      if (state.listening) {
        // Chrome occasionally ends the stream on its own despite
        // continuous=true — restart to keep dictating.
        window.setTimeout(() => {
          if (state.listening && recognition) {
            try {
              recognition.start();
            } catch {
              /* already started — ignore */
            }
          }
        }, 250);
      } else {
        stopTimer();
        renderStatus();
      }
    };

    return rec;
  }

  function startListening() {
    if (!supported || state.listening) return;
    state.listening = true;
    startTimer();
    renderStatus();
    els.transcriptCard.classList.add('listening');
    els.startLabel.textContent = t().stop;
    els.startIconMic.hidden = true;
    els.startIconStop.hidden = false;
    els.startBtn.classList.add('is-listening');
    try {
      recognition.start();
    } catch {
      /* already running */
    }
  }

  function stopListening() {
    if (!state.listening) return;
    state.listening = false;
    stopTimer();
    renderStatus();
    els.transcriptCard.classList.remove('listening');
    els.startLabel.textContent = t().start;
    els.startIconMic.hidden = false;
    els.startIconStop.hidden = true;
    els.startBtn.classList.remove('is-listening');
    try {
      recognition.stop();
    } catch {
      /* not running */
    }
  }

  /* ---------- Actions ---------- */

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      return true;
    } catch {
      return false;
    }
  }

  async function doCopy() {
    if (!hasContent()) {
      showToast(t().empty);
      return;
    }
    const ok = await copyText(fullText());
    showToast(ok ? t().copied : t().copyFailed);
  }

  function downloadText(text) {
    const stamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '-');
    const blob = new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persian-transcript-${stamp}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function doDownload() {
    if (!hasContent()) {
      showToast(t().empty);
      return;
    }
    downloadText(fullText());
    showToast(t().downloaded);
  }

  function doClear() {
    finalSegments = [];
    interimText = '';
    disarmClear();
    renderTranscript();
    showToast(t().cleared);
  }

  function disarmClear() {
    clearArmed = false;
    els.clearBtn.classList.remove('btn-danger');
    els.clearLabel.textContent = t().clear;
    if (clearArmTimer) {
      clearTimeout(clearArmTimer);
      clearArmTimer = null;
    }
  }

  /* ---------- Toast ---------- */

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove('show');
      toastTimer = null;
    }, 2200);
  }

  /* ---------- Events ---------- */

  els.langToggle.addEventListener('click', () => {
    setLang(lang === 'fa' ? 'en' : 'fa');
  });

  els.helpBtn.addEventListener('click', openHelp);
  els.helpClose.addEventListener('click', closeHelp);
  els.helpBackdrop.addEventListener('click', closeHelp);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !els.helpModal.hidden) closeHelp();
  });

  els.startBtn.addEventListener('click', () => {
    if (state.listening) {
      stopListening();
    } else {
      startListening();
    }
  });

  els.copyBtn.addEventListener('click', doCopy);
  els.downloadBtn.addEventListener('click', doDownload);

  els.clearBtn.addEventListener('click', () => {
    if (!hasContent()) return;
    if (!clearArmed) {
      clearArmed = true;
      els.clearBtn.classList.add('btn-danger');
      els.clearLabel.textContent = t().confirmClear;
      clearArmTimer = setTimeout(disarmClear, 3000);
    } else {
      doClear();
    }
  });

  /* ---------- Boot ---------- */

  if (!supported) {
    els.unsupported.hidden = false;
    els.startBtn.disabled = true;
    els.statusDot.classList.add('error');
    els.statusText.textContent = t().statusError;
  } else {
    recognition = initRecognition();
  }

  applyLang();
  updateSecondaryButtons();
})();
