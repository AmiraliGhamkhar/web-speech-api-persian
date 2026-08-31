(() => {
  'use strict';

  /* ============================================================
   *  Persian Speech-to-Text with Web Speech API & Smart Vocabulary
   *  - Live Persian dictation with continuous & interim results
   *  - Resilient Auto-Reconnect & Non-Stop Dictation Lifecycle
   *  - Comprehensive Medical & Tech Vocabulary Dictionaries
   *  - Smart Vocabulary & Multi-Alternative Biasing (Custom Words)
   *  - Automatic ZWNJ (نیم‌فاصله) & Persian Orthography Correction
   *  - Persian Digits toggle & Text Formatting
   *  - Undo / Redo history stack & Direct Editable Transcript
   *  - Real-time Mic Audio Visualizer (Web Audio API)
   *  - Extended Export (TXT, Markdown, Print/PDF)
   *  - Keyboard Shortcuts & PWA Offline Support
   *  - Bilingual UI (فارسی / English)
   * ============================================================ */

  const RECOGNITION_LANG = 'fa-IR';

  /* ------------------------------------------------------------
   *  Curated Persian Medical Vocabulary Pack
   * ------------------------------------------------------------ */
  const MEDICAL_VOCABULARY_PACK = [
    {
      id: 'med-echo',
      canonical: 'اکوکاردیوگرافی',
      aliases: ['اکوکاردیو گرافی', 'اکو قلب', 'اکوکاردیو', 'اکو کاردیو گرافی', 'اکو'],
      category: 'medical'
    },
    {
      id: 'med-ecg',
      canonical: 'الکتروکاردیوگرام',
      aliases: ['الکتروکاردیو گرام', 'نوار قلب', 'الکتروکاردیو', 'ای سی جی'],
      category: 'medical'
    },
    {
      id: 'med-angio',
      canonical: 'آنژیوگرافی',
      aliases: ['انژیوگرافی', 'آنژیو گرافی', 'آنژیو', 'انژیو'],
      category: 'medical'
    },
    {
      id: 'med-endo',
      canonical: 'آندوسکوپی',
      aliases: ['اندوسکوپی', 'آندوسکوپی معده', 'آندو اسکوپی', 'اندو اسکوپی'],
      category: 'medical'
    },
    {
      id: 'med-colono',
      canonical: 'کولونوسکوپی',
      aliases: ['کلونوسکوپی', 'کولونو اسکوپی', 'کلونو اسکوپی'],
      category: 'medical'
    },
    {
      id: 'med-radio',
      canonical: 'رادیوگرافی',
      aliases: ['رادیو گرافی', 'رادیولوژی', 'عکس رادیولوژی'],
      category: 'medical'
    },
    {
      id: 'med-sono',
      canonical: 'سونوگرافی',
      aliases: ['سونو گرافی', 'سونو'],
      category: 'medical'
    },
    {
      id: 'med-ct',
      canonical: 'سی‌تی‌اسکن',
      aliases: ['سی تی اسکن', 'سی‌تی اسکن', 'سیتی اسکن', 'سی تی'],
      category: 'medical'
    },
    {
      id: 'med-mri',
      canonical: 'ام‌آر‌آی',
      aliases: ['ام آر آی', 'ام ار ای', 'ام‌ار‌ای', 'ام ار آی'],
      category: 'medical'
    },
    {
      id: 'med-hemo',
      canonical: 'هموگلوبین',
      aliases: ['همو گلوبین', 'هموگلوبین خون', 'اچ بی'],
      category: 'medical'
    },
    {
      id: 'med-antibiotic',
      canonical: 'آنتی‌بیوتیک',
      aliases: ['آنتی بیوتیک', 'انتی بیوتیک', 'آنتیبیوتیک', 'انتی‌بیوتیک'],
      category: 'medical'
    },
    {
      id: 'med-aceta',
      canonical: 'استامینوفن',
      aliases: ['استامینوفن', 'استامینوفن کدئین', 'استامینوفن کدیین', 'استامینوفن پانصد'],
      category: 'medical'
    },
    {
      id: 'med-ibu',
      canonical: 'ایبوپروفن',
      aliases: ['ایبو پروفن', 'بروفن', 'پروفن', 'ژلوفن'],
      category: 'medical'
    },
    {
      id: 'med-amox',
      canonical: 'آموکسی‌سیلین',
      aliases: ['آموکسی سیلین', 'اموکسی سیلین', 'اموکسی‌سیلین'],
      category: 'medical'
    },
    {
      id: 'med-azithro',
      canonical: 'آزیترومایسین',
      aliases: ['آزیترو مایسین', 'ازیترومایسین', 'ازیترو مایسین'],
      category: 'medical'
    },
    {
      id: 'med-ceph',
      canonical: 'سفالکسین',
      aliases: ['سفالکسین', 'سفالکسین پانصد', 'سفیکسیم'],
      category: 'medical'
    },
    {
      id: 'med-diab',
      canonical: 'دیابت',
      aliases: ['دیابت قندی', 'قند خون', 'بیماری قند'],
      category: 'medical'
    },
    {
      id: 'med-htn',
      canonical: 'فشار خون',
      aliases: ['فشارخون', 'هایپرتنشن', 'پرفشاری خون', 'فشار بالا'],
      category: 'medical'
    },
    {
      id: 'med-patho',
      canonical: 'پاتولوژی',
      aliases: ['پاتولوژی', 'آسیب شناسی', 'پاتالوژی'],
      category: 'medical'
    },
    {
      id: 'med-biopsy',
      canonical: 'بیوپسی',
      aliases: ['بیوپسی', 'نمونه برداری', 'بایوپسی'],
      category: 'medical'
    },
    {
      id: 'med-hemato',
      canonical: 'هماتولوژی',
      aliases: ['هماتولوژی', 'خون شناسی'],
      category: 'medical'
    },
    {
      id: 'med-neuro',
      canonical: 'نورولوژی',
      aliases: ['نورولوژی', 'مغز و اعصاب', 'نورولوژیست'],
      category: 'medical'
    },
    {
      id: 'med-cardio',
      canonical: 'کاردیولوژی',
      aliases: ['کاردیولوژی', 'قلب و عروق', 'کاردیولوژیست'],
      category: 'medical'
    },
    {
      id: 'med-gi',
      canonical: 'متخصص گوارش',
      aliases: ['گوارش و کبد', 'گاستروانترولوژی'],
      category: 'medical'
    },
    {
      id: 'med-uro',
      canonical: 'اورولوژی',
      aliases: ['ارولوژی', 'کلیه و مجاری ادراری', 'اورولوژیست'],
      category: 'medical'
    },
    {
      id: 'med-anes',
      canonical: 'بیهوشی',
      aliases: ['هوشبری', 'متخصص بیهوشی', 'آنستزیولوژی'],
      category: 'medical'
    },
    {
      id: 'med-ortho',
      canonical: 'ارتوپدی',
      aliases: ['ارتوپد', 'استخوان و مفاصل', 'ارتوپدیست'],
      category: 'medical'
    },
    {
      id: 'med-opht',
      canonical: 'چشم‌پزشکی',
      aliases: ['چشم پزشکی', 'اپتومتری', 'افتالمولوژی'],
      category: 'medical'
    },
    {
      id: 'med-dent',
      canonical: 'دندان‌پزشکی',
      aliases: ['دندان پزشکی', 'دندانپزشکی', 'دندان ساز'],
      category: 'medical'
    },
    {
      id: 'med-physio',
      canonical: 'فیزیوتراپی',
      aliases: ['فیزیو تراپی', 'توانبخشی', 'طب فیزیکی'],
      category: 'medical'
    },
    {
      id: 'med-metas',
      canonical: 'متاستاز',
      aliases: ['متاستاز', 'گسترش تومور', 'تومور بدخیم'],
      category: 'medical'
    },
    {
      id: 'med-seizure',
      canonical: 'تشنج',
      aliases: ['صرع', 'حملات تشنجی', 'حمله صرع'],
      category: 'medical'
    },
    {
      id: 'med-mi',
      canonical: 'سکته قلبی',
      aliases: ['انفارکتوس', 'سکتهٔ قلبی', 'ایست قلبی', 'انفارکتوس میوکارد'],
      category: 'medical'
    },
    {
      id: 'med-stroke',
      canonical: 'سکته مغزی',
      aliases: ['سکتهٔ مغزی', 'ترومبوز مغزی', 'ایسکمی مغزی'],
      category: 'medical'
    },
    {
      id: 'med-cataract',
      canonical: 'کاتاراکت',
      aliases: ['آب مروارید', 'اب مروارید', 'عمل کاتاراکت'],
      category: 'medical'
    },
    {
      id: 'med-glaucoma',
      canonical: 'گلوکوم',
      aliases: ['آب سیاه', 'اب سیاه', 'فشار چشم'],
      category: 'medical'
    },
    {
      id: 'med-erythro',
      canonical: 'اریتروسیت',
      aliases: ['گلبول قرمز', 'گلبول‌های قرمز', 'اریتروسیت‌ها'],
      category: 'medical'
    },
    {
      id: 'med-leuko',
      canonical: 'لوکوسیت',
      aliases: ['گلبول سفید', 'گلبول‌های سفید', 'لوکوسیت‌ها'],
      category: 'medical'
    },
    {
      id: 'med-platelet',
      canonical: 'پلاکت',
      aliases: ['پلاکت خون', 'ترومبوسیت', 'پلاکت‌ها'],
      category: 'medical'
    },
    {
      id: 'med-creatinine',
      canonical: 'کراتینین',
      aliases: ['کراتینین خون', 'کراتینین ادرار', 'کراتین'],
      category: 'medical'
    }
  ];

  /* ------------------------------------------------------------
   *  Curated Persian Tech & Programming Vocabulary Pack
   * ------------------------------------------------------------ */
  const TECH_VOCABULARY_PACK = [
    {
      id: 'tech-k8s',
      canonical: 'کوبرنتیس',
      aliases: ['کوبرنتیز', 'کوبرنتی', 'کوبرنتس', 'کوبر نیتس', 'کوبیرنتیس', 'کوبرنتیس'],
      category: 'tech'
    },
    {
      id: 'tech-docker',
      canonical: 'داکر',
      aliases: ['داکیر', 'داخر', 'دکر', 'داکرها'],
      category: 'tech'
    },
    {
      id: 'tech-react',
      canonical: 'ری‌اکت',
      aliases: ['ریاکت', 'ری اکت', 'ری‌اکت جی اس', 'ریاکت جی اس'],
      category: 'tech'
    },
    {
      id: 'tech-js',
      canonical: 'جاوااسکریپت',
      aliases: ['جاوا اسکریپت', 'جاوااسکریپ', 'جاوا اسکریپ', 'جاوااسکریپت'],
      category: 'tech'
    },
    {
      id: 'tech-python',
      canonical: 'پایتون',
      aliases: ['پایتن', 'پیتون', 'پای تون', 'پایتون'],
      category: 'tech'
    },
    {
      id: 'tech-github',
      canonical: 'گیت‌هاب',
      aliases: ['گیت هاب', 'گیتهاب', 'گیت‌هب', 'گیت هب'],
      category: 'tech'
    },
    {
      id: 'tech-ai',
      canonical: 'هوش مصنوعی',
      aliases: ['هوش‌مصنوعی', 'هوش مصنویی', 'هوش مصوعی', 'هوش مصنوی'],
      category: 'ai'
    },
    {
      id: 'tech-ml',
      canonical: 'یادگیری ماشین',
      aliases: ['یادگیری‌ماشین', 'یادگیری ماءشین', 'ماشین لرنینگ'],
      category: 'ai'
    },
    {
      id: 'tech-frontend',
      canonical: 'فرانت‌اند',
      aliases: ['فرانت اند', 'فرانتند', 'فرانت‌ند', 'فرانت اندی'],
      category: 'tech'
    },
    {
      id: 'tech-backend',
      canonical: 'بک‌اند',
      aliases: ['بک اند', 'بکند', 'بک‌ند', 'بک اندی'],
      category: 'tech'
    },
    {
      id: 'tech-postgres',
      canonical: 'پست‌گرس',
      aliases: ['پستگرس', 'پست گرس', 'پست‌گرس‌کیوال', 'پستگرس کیو ال'],
      category: 'tech'
    },
    {
      id: 'tech-vpn',
      canonical: 'وی‌پی‌ان',
      aliases: ['وی پی ان', 'وی‌پی ان', 'وی پی‌ان', 'فیلتر شکن'],
      category: 'tech'
    },
    {
      id: 'tech-cloud',
      canonical: 'کلود',
      aliases: ['کلاد', 'رایانش ابری'],
      category: 'tech'
    },
    {
      id: 'tech-linux',
      canonical: 'لینوکس',
      aliases: ['لینوک', 'لینکس'],
      category: 'tech'
    },
    {
      id: 'tech-resume',
      canonical: 'رزومه',
      aliases: ['رزومیه', 'سی وی'],
      category: 'general'
    },
    {
      id: 'tech-email',
      canonical: 'ایمیل',
      aliases: ['ای میل', 'پست الکترونیکی', 'ای‌میل'],
      category: 'general'
    }
  ];

  /* Combine both packs for default curated dictionary */
  const DEFAULT_VOCABULARY = [...TECH_VOCABULARY_PACK, ...MEDICAL_VOCABULARY_PACK];

  /* ------------------------------------------------------------
   *  Voice Commands Definitions
   * ------------------------------------------------------------ */
  const COMMANDS = [
    { id: 'stop', group: 'control', aliases: ['توقف', 'بس کن', 'تمام کن'], action: 'stop' },
    { id: 'clear', group: 'control', aliases: ['پاک کن متن', 'پاک کن', 'حذف کن متن', 'حذف کن'], action: 'clear' },
    { id: 'copy', group: 'control', aliases: ['کپی کن', 'کپی'], action: 'copy' },
    { id: 'download', group: 'control', aliases: ['دانلود کن', 'ذخیره کن'], action: 'download' },
    { id: 'format', group: 'control', aliases: ['پاکسازی نگارشی', 'مرتب کن', 'اصلاح متن'], action: 'format' },
    { id: 'undo', group: 'control', aliases: ['واگرد', 'برگردان', 'عقب برگرد'], action: 'undo' },
    { id: 'lang-en', group: 'control', aliases: ['زبان انگلیسی'], action: 'lang-en' },
    { id: 'lang-fa', group: 'control', aliases: ['زبان فارسی'], action: 'lang-fa' },
    { id: 'lang-toggle', group: 'control', aliases: ['تغییر زبان'], action: 'lang-toggle' },
    { id: 'vocab', group: 'control', aliases: ['واژه‌نامه', 'کلمات تخصصی', 'واژه نامه'], action: 'vocab' },
    { id: 'help', group: 'control', aliases: ['راهنما', 'کمک', 'دستورها'], action: 'help' },
    { id: 'close', group: 'control', aliases: ['بستن', 'ببند'], action: 'close' },
    { id: 'period', group: 'punct', aliases: ['نقطه'], punct: '.' },
    { id: 'comma', group: 'punct', aliases: ['ویرگول', 'کاما'], punct: '،' },
    { id: 'question', group: 'punct', aliases: ['علامت سوال', 'علامت پرسش'], punct: '؟' },
    { id: 'exclamation', group: 'punct', aliases: ['علامت تعجب'], punct: '!' },
    { id: 'colon', group: 'punct', aliases: ['دو نقطه'], punct: ':' },
    { id: 'semicolon', group: 'punct', aliases: ['نقطه ویرگول'], punct: '؛' },
    { id: 'newline', group: 'punct', aliases: ['خط جدید', 'سطر جدید', 'خط بعد'], punct: '\n' },
  ];

  const ALIASES = [];
  COMMANDS.forEach((cmd) => {
    cmd.aliases.forEach((alias) => {
      ALIASES.push({ cmd, words: alias.split(' ') });
    });
  });
  ALIASES.sort((a, b) => b.words.length - a.words.length);

  /* ------------------------------------------------------------
   *  Bilingual UI Strings (fa / en)
   * ------------------------------------------------------------ */
  const STRINGS = {
    fa: {
      dir: 'rtl',
      title: 'تبدیل گفتار به متن فارسی',
      subtitle: 'دیکتهٔ زنده با پشتیبانی از کلمات تخصصی، واژه‌نامه پزشکی و نیم‌فاصله',
      toggleLabel: 'English',
      start: 'شروع گفتار',
      stop: 'توقف',
      statusIdle: 'آمادهٔ شنیدن',
      statusListening: 'در حال شنیدن…',
      statusReconnecting: 'اتصال مجدد به گفتار…',
      statusError: 'خطا',
      placeholder: 'متن گفتار شما اینجا نمایش داده می‌شود یا می‌توانید مستقیماً تایپ و ویرایش کنید…',
      copy: 'کپی',
      copied: 'در کلیپ‌بورد کپی شد',
      copyFailed: 'کپی ناموفق بود',
      export: 'خروجی',
      downloadTxt: 'فایل متنی (.txt)',
      downloadMd: 'مارک‌داون (.md)',
      printPdf: 'چاپ / خروجی PDF',
      downloaded: 'فایل دانلود شد',
      clear: 'پاک کردن',
      confirmClear: 'برای تأیید دوباره بزنید',
      cleared: 'متن پاک شد',
      empty: 'متنی برای پردازش وجود ندارد',
      wordCount: 'کلمه',
      charCount: 'نویسه',
      segmentCount: 'بخش',
      smartZwnj: 'نیم‌فاصله هوشمند',
      persianDigits: 'اعداد فارسی',
      formatText: 'پاکسازی نگارشی',
      formattedToast: 'متن اصلاح و مرتب‌سازی شد',
      tooltipZwnj: 'اصلاح خودکار نیم‌فاصله (می‌،‌ها،‌تر)',
      tooltipDigits: 'تبدیل اعداد به ارقام فارسی (۱۲۳)',
      tooltipFormat: 'اصلاح و پاکسازی نگارشی کل متن',
      tooltipUndo: 'واگرد (Ctrl+Z)',
      tooltipRedo: 'ازنو (Ctrl+Y)',
      unsupportedTitle: 'مرورگر شما از Web Speech API پشتیبانی نمی‌کند',
      unsupportedText: 'لطفاً از Chrome یا Edge استفاده کنید. تشخیص گفتار نیازمند اتصال اینترنت است.',
      footerNote: 'تشخیص گفتار پیوسته و بدون وقفه با Web Speech API • بدون وابستگی خارجی و کاملاً سمت کاربر',
      helpButton: 'راهنما و کلیدهای میانبر',
      closeHelp: 'بستن',
      helpTitle: 'دستورهای صوتی و کلیدهای میانبر',
      helpSub: 'در حال ضبط، این فرمان‌ها را بگویید — فرمان‌ها از متن حذف و اجرا می‌شوند:',
      helpShortcuts: 'کلیدهای میانبر کیبورد',
      shortcutToggle: 'شروع / توقف ضبط گفتار',
      shortcutUndo: 'واگرد (Undo) تغییرات',
      shortcutRedo: 'ازنو (Redo) تغییرات',
      shortcutCopy: 'کپی کل متن',
      shortcutSave: 'ذخیره / دانلود سریع فایل',
      shortcutEsc: 'بستن پنجره‌های باز',
      helpControl: 'کنترل برنامه با گفتار',
      helpPunct: 'نشانه‌گذاری با گفتار',
      hint: 'نکته: ضبط پیوسته فعال است. در حال ضبط بگویید «راهنما» یا کلید Space را بزنید تا ضبط متوقف شود.',
      stoppedByCommand: 'ضبط با فرمان صوتی متوقف شد',
      vocabTitle: 'واژه‌نامه تخصصی و کلمات کلیدی',
      vocabSub: 'کلمات تخصصی پزشکی، اصطلاحات فنی، داروها، نام برندها یا اسامی را اضافه کنید تا سیستم تلفظ‌ها و خطاهای شنیداری را به‌صورت خودکار تصحیح کند:',
      vocabLabelCanonical: 'کلمه یا عبارت اصلی (نگارش صحیح)',
      vocabLabelAliases: 'خطاهای شنیداری و تلفظ‌ها (با ویرگول یا کاما جدا کنید)',
      vocabLabelCategory: 'دسته‌بندی',
      vocabAddBtn: 'افزودن کلمه',
      vocabPresetsLabel: 'بسته‌های تخصصی آماده:',
      presetMed: 'واژه‌نامه جامع پزشکی',
      presetTech: 'واژه‌نامه فناوری و IT',
      presetMedLoaded: 'واژگان تخصصی پزشکی به فرهنگ لغت افزوده شدند',
      presetTechLoaded: 'واژگان فناوری و برنامه‌نویسی به فرهنگ لغت افزوده شدند',
      vocabSearchPlaceholder: 'جستجو در کلمات یا خطاها…',
      vocabExport: 'پشتیبان‌گیری (JSON)',
      vocabImport: 'درون‌ریزی (JSON)',
      vocabReset: 'بازنشانی پیش‌فرض',
      vocabResetConfirm: 'آیا مایلید تمام کلمات واژه‌نامه به فهرست پیش‌فرض بازگردانده شوند؟',
      vocabAddedToast: 'واژه جدید با موفقیت اضافه شد',
      vocabDeletedToast: 'واژه حذف شد',
      vocabImportSuccess: 'واژه‌نامه با موفقیت درون‌ریزی شد',
      vocabImportError: 'فایل وارد شده ساختار معتبری ندارد',
      vocabEmpty: 'واژه‌ای یافت نشد.',
      filterAll: 'همه',
      catTech: 'فناوری و نرم‌افزار',
      catAi: 'هوش مصنوعی',
      catGeneral: 'عمومی / اداری',
      catMedical: 'پزشکی و دارویی',
      wordSuffix: 'واژه',
      commandLabels: {
        stop: 'توقف ضبط گفتار',
        clear: 'پاک کردن متن',
        copy: 'کپی متن در کلیپ‌بورد',
        download: 'دانلود سریع فایل',
        format: 'اصلاح و پاکسازی نگارشی',
        undo: 'واگرد آخرین تغییر',
        vocab: 'باز کردن واژه‌نامه تخصصی',
        'lang-en': 'تغییر زبان به انگلیسی',
        'lang-fa': 'تغییر زبان به فارسی',
        'lang-toggle': 'تغییر زبان برنامه',
        help: 'نمایش راهنما و میانبرها',
        close: 'بستن پنجره‌ها',
        period: '. نقطه',
        comma: '، ویرگول',
        question: '؟ علامت سوال',
        exclamation: '! علامت تعجب',
        colon: ': دو نقطه',
        semicolon: '؛ نقطه ویرگول',
        newline: '↵ خط جدید',
      },
      errors: {
        'no-speech': 'صدایی شنیده نشد، همچنان در حال گوش دادن…',
        aborted: 'شناسایی متوقف شد',
        'audio-capture': 'میکروفونی پیدا نشد',
        network: 'در حال برقراری مجدد ارتباط با سرور تشخیص گفتار…',
        'not-allowed': 'دسترسی به میکروفون رد شد',
        'service-not-allowed': 'سرویس تشخیص گفتار مجاز نیست',
        'language-not-supported': 'زبان فارسی (fa-IR) در این مرورگر پشتیبانی نمی‌شود',
        default: 'خطا در سرویس گفتار',
      },
    },
    en: {
      dir: 'ltr',
      title: 'Persian Speech to Text',
      subtitle: 'Continuous dictation with medical vocabulary & smart ZWNJ',
      toggleLabel: 'فارسی',
      start: 'Start listening',
      stop: 'Stop',
      statusIdle: 'Ready',
      statusListening: 'Listening non-stop…',
      statusReconnecting: 'Reconnecting speech service…',
      statusError: 'Error',
      placeholder: 'Your transcribed speech will appear here, or you can type directly to edit…',
      copy: 'Copy',
      copied: 'Copied to clipboard',
      copyFailed: 'Copy failed',
      export: 'Export',
      downloadTxt: 'Text file (.txt)',
      downloadMd: 'Markdown (.md)',
      printPdf: 'Print / Save as PDF',
      downloaded: 'File downloaded',
      clear: 'Clear',
      confirmClear: 'Click again to confirm',
      cleared: 'Transcript cleared',
      empty: 'There is nothing to process yet',
      wordCount: 'words',
      charCount: 'characters',
      segmentCount: 'segments',
      smartZwnj: 'Smart ZWNJ',
      persianDigits: 'Persian digits',
      formatText: 'Clean text',
      formattedToast: 'Text formatting cleaned up',
      tooltipZwnj: 'Auto-format Persian ZWNJ (mi-, -ha, -tar)',
      tooltipDigits: 'Convert numbers to Persian digits (۱۲۳)',
      tooltipFormat: 'Clean and format entire transcript',
      tooltipUndo: 'Undo changes (Ctrl+Z)',
      tooltipRedo: 'Redo changes (Ctrl+Y)',
      unsupportedTitle: "Your browser doesn't support the Web Speech API",
      unsupportedText: 'Please use Chrome or Edge. Persian speech recognition requires an internet connection.',
      footerNote: 'Continuous non-stop speech recognition via Web Speech API • Zero dependencies, 100% client-side',
      helpButton: 'Voice commands & shortcuts',
      closeHelp: 'Close',
      helpTitle: 'Voice Commands & Shortcuts',
      helpSub: 'While recording, speak any of these — commands are removed and executed:',
      helpShortcuts: 'Keyboard Shortcuts',
      shortcutToggle: 'Start / stop recording',
      shortcutUndo: 'Undo text change',
      shortcutRedo: 'Redo text change',
      shortcutCopy: 'Copy full transcript',
      shortcutSave: 'Quick save / download',
      shortcutEsc: 'Close open modals',
      helpControl: 'App Controls',
      helpPunct: 'Punctuation',
      hint: 'Tip: Continuous dictation is on. Say “راهنما” (help) or press Space to pause.',
      stoppedByCommand: 'Recording stopped by voice command',
      vocabTitle: 'Special Vocabulary & Keywords',
      vocabSub: 'Add medical terminology, pharmaceuticals, technical terms, or names. The app detects phonetic variations and fixes them automatically:',
      vocabLabelCanonical: 'Target Word / Phrase (Canonical)',
      vocabLabelAliases: 'Misheard variants & pronunciations (comma separated)',
      vocabLabelCategory: 'Category',
      vocabAddBtn: 'Add word',
      vocabPresetsLabel: 'Pre-built Vocabulary Packs:',
      presetMed: 'Medical & Clinical Pack',
      presetTech: 'Tech & Developer Pack',
      presetMedLoaded: 'Medical dictionary pack added to vocabulary',
      presetTechLoaded: 'Tech dictionary pack added to vocabulary',
      vocabSearchPlaceholder: 'Search words or aliases…',
      vocabExport: 'Export JSON',
      vocabImport: 'Import JSON',
      vocabReset: 'Reset to Defaults',
      vocabResetConfirm: 'Are you sure you want to reset all vocabulary to default terms?',
      vocabAddedToast: 'New word added to vocabulary',
      vocabDeletedToast: 'Word removed',
      vocabImportSuccess: 'Vocabulary imported successfully',
      vocabImportError: 'Invalid JSON vocabulary file',
      vocabEmpty: 'No vocabulary words found.',
      filterAll: 'All',
      catTech: 'Technology & Dev',
      catAi: 'Artificial Intelligence',
      catGeneral: 'General / Office',
      catMedical: 'Medical & Clinical',
      wordSuffix: 'words',
      commandLabels: {
        stop: 'Stop recording',
        clear: 'Clear transcript',
        copy: 'Copy text to clipboard',
        download: 'Quick download',
        format: 'Clean up orthography',
        undo: 'Undo last change',
        vocab: 'Open vocabulary manager',
        'lang-en': 'Switch UI to English',
        'lang-fa': 'Switch UI to Persian',
        'lang-toggle': 'Switch UI language',
        help: 'Show help & shortcuts',
        close: 'Close modals',
        period: '. Period',
        comma: '، Comma',
        question: '؟ Question mark',
        exclamation: '! Exclamation mark',
        colon: ': Colon',
        semicolon: '؛ Semicolon',
        newline: '↵ New line',
      },
      errors: {
        'no-speech': 'No speech detected, still listening…',
        aborted: 'Recognition was interrupted',
        'audio-capture': 'No microphone was found',
        network: 'Reconnecting to speech server…',
        'not-allowed': 'Microphone access was denied',
        'service-not-allowed': 'The speech service is not allowed',
        'language-not-supported': 'Persian (fa-IR) is not supported in this browser',
        default: 'Speech recognition error',
      },
    },
  };

  /* ------------------------------------------------------------
   *  DOM Elements
   * ------------------------------------------------------------ */
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
    vocabBtn: document.getElementById('vocabBtn'),
    vocabBadge: document.getElementById('vocabBadge'),
    vocabModal: document.getElementById('vocabModal'),
    vocabBackdrop: document.getElementById('vocabBackdrop'),
    vocabClose: document.getElementById('vocabClose'),
    vocabCountBadge: document.getElementById('vocabCountBadge'),
    vocabForm: document.getElementById('vocabForm'),
    vocabCanonical: document.getElementById('vocabCanonical'),
    vocabAliases: document.getElementById('vocabAliases'),
    vocabCategory: document.getElementById('vocabCategory'),
    loadMedPackBtn: document.getElementById('loadMedPackBtn'),
    loadTechPackBtn: document.getElementById('loadTechPackBtn'),
    vocabSearch: document.getElementById('vocabSearch'),
    vocabCategoryFilters: document.getElementById('vocabCategoryFilters'),
    vocabList: document.getElementById('vocabList'),
    vocabEmpty: document.getElementById('vocabEmpty'),
    vocabExportBtn: document.getElementById('vocabExportBtn'),
    vocabImportBtn: document.getElementById('vocabImportBtn'),
    vocabFileInput: document.getElementById('vocabFileInput'),
    vocabResetBtn: document.getElementById('vocabResetBtn'),
    unsupported: document.getElementById('unsupported'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    audioVisualizer: document.getElementById('audioVisualizer'),
    timer: document.getElementById('timer'),
    toggleZwnj: document.getElementById('toggleZwnj'),
    toggleDigits: document.getElementById('toggleDigits'),
    formatBtn: document.getElementById('formatBtn'),
    undoBtn: document.getElementById('undoBtn'),
    redoBtn: document.getElementById('redoBtn'),
    transcriptCard: document.querySelector('.transcript-card'),
    transcript: document.getElementById('transcript'),
    startBtn: document.getElementById('startBtn'),
    startLabel: document.getElementById('startLabel'),
    startIconMic: document.getElementById('startIconMic'),
    startIconStop: document.getElementById('startIconStop'),
    copyBtn: document.getElementById('copyBtn'),
    exportDropdownBtn: document.getElementById('exportDropdownBtn'),
    exportDropdownContainer: document.querySelector('.export-dropdown-container'),
    exportMenu: document.getElementById('exportMenu'),
    downloadTxtBtn: document.getElementById('downloadTxtBtn'),
    downloadMdBtn: document.getElementById('downloadMdBtn'),
    printBtn: document.getElementById('printBtn'),
    clearBtn: document.getElementById('clearBtn'),
    clearLabel: document.getElementById('clearLabel'),
    wordCount: document.getElementById('wordCount'),
    charCount: document.getElementById('charCount'),
    segmentCount: document.getElementById('segmentCount'),
    toast: document.getElementById('toast'),
  };

  /* ------------------------------------------------------------
   *  App State & LocalStorage
   * ------------------------------------------------------------ */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const supported = Boolean(SpeechRecognition);

  const state = {
    listening: false,
    startTime: 0,
    timerId: null,
    smartZwnj: localStorage.getItem('stt-smart-zwnj') !== 'false', // default true
    persianDigits: localStorage.getItem('stt-persian-digits') !== 'false', // default true
    selectedVocabCategory: 'all',
    vocabSearchQuery: '',
    audioStream: null,
    audioContext: null,
    analyser: null,
    visualizerAnimId: null,
  };

  let recognition = null;
  let finalSegments = [];
  let interimText = '';
  let clearArmed = false;
  let clearArmTimer = null;
  let toastTimer = null;
  let undoStack = [];
  let redoStack = [];
  let isInternalEdit = false;

  // Continuous Recognition Resiliency State
  let isRestarting = false;
  let restartTimeoutId = null;
  let watchdogIntervalId = null;
  let retryCount = 0;
  const MAX_RETRY_DELAY = 1500;

  let lang = (() => {
    try {
      return localStorage.getItem('stt-lang') || 'fa';
    } catch {
      return 'fa';
    }
  })();
  if (lang !== 'fa' && lang !== 'en') lang = 'fa';

  const t = () => STRINGS[lang];

  // Load custom vocabulary
  let vocabulary = (() => {
    try {
      const stored = localStorage.getItem('stt-vocabulary');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return JSON.parse(JSON.stringify(DEFAULT_VOCABULARY));
  })();

  function saveVocabulary() {
    try {
      localStorage.setItem('stt-vocabulary', JSON.stringify(vocabulary));
    } catch {
      /* ignore */
    }
    updateVocabLookup();
    renderVocabList();
    updateVocabBadge();
  }

  function mergeVocabularyPack(pack) {
    const existingCanonicals = new Set(vocabulary.map((v) => normalizePersian(v.canonical)));
    let addedCount = 0;

    pack.forEach((item) => {
      const norm = normalizePersian(item.canonical);
      if (!existingCanonicals.has(norm)) {
        vocabulary.push(JSON.parse(JSON.stringify(item)));
        existingCanonicals.add(norm);
        addedCount++;
      }
    });

    saveVocabulary();
    return addedCount;
  }

  /* ------------------------------------------------------------
   *  Persian Text Normalization & Orthography
   * ------------------------------------------------------------ */

  function normalizePersian(text) {
    return String(text || '')
      .replace(/[يىئ]/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/[\u064B-\u065F\u0670]/g, '') // Tashkeel / diacritics
      .replace(/[\u200C\u200B]/g, '') // ZWNJ / zero-width space
      .replace(/[^\u0621-\u063A\u0641-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC0-9۰-۹a-zA-Z\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Levenshtein distance for fuzzy vocabulary matching
  function levenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) d[i][0] = i;
    for (let j = 0; j <= n; j++) d[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        d[i][j] = Math.min(
          d[i - 1][j] + 1,      // deletion
          d[i][j - 1] + 1,      // insertion
          d[i - 1][j - 1] + cost // substitution
        );
      }
    }
    return d[m][n];
  }

  function wordSimilarity(w1, w2) {
    const maxLen = Math.max(w1.length, w2.length);
    if (maxLen === 0) return 1.0;
    return 1 - levenshteinDistance(w1, w2) / maxLen;
  }

  // Digits converters
  const EN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  function toPersianDigits(text) {
    let out = String(text || '');
    for (let i = 0; i < 10; i++) {
      out = out.replace(new RegExp(EN_DIGITS[i], 'g'), FA_DIGITS[i]);
    }
    return out;
  }

  function toEnglishDigits(text) {
    let out = String(text || '');
    for (let i = 0; i < 10; i++) {
      out = out.replace(new RegExp(FA_DIGITS[i], 'g'), EN_DIGITS[i]);
    }
    return out;
  }

  /* ---------- Smart ZWNJ & Orthography Formatter ---------- */

  function applyPersianOrthography(text) {
    if (!text) return '';
    let out = String(text);

    // 1. Prefixes: می‌ and نمی‌
    out = out.replace(/(^|\s)(می|نمی)\s+([^\s.,،؟!؛:«»()]+)/g, '$1$2\u200C$3');

    // 2. Prefix: بی‌
    out = out.replace(/(^|\s)(بی)\s+([^\s.,،؟!؛:«»()]+)/g, '$1$2\u200C$3');

    // 3. Suffixes: ها / های / هایی / هایمان / هایتان / هایشان
    out = out.replace(/([^\s.,،؟!؛:«»()]+)\s+(ها|های|هایی|هایم|هایت|هایش|هایمان|هایتان|هایشان)(?=[\s.,،؟!؛:«»\)]|$)/g, '$1\u200C$2');

    // 4. Suffixes: تر / ترین / تری
    out = out.replace(/([^\s.,،؟!؛:«»()]+)\s+(تر|ترین|تری)(?=[\s.,،؟!؛:«»\)]|$)/g, (match, p1, p2) => {
      if (p1 === 'به' && (p2 === 'تر' || p2 === 'ترین')) return `${p1}${p2}`; // بهتر / بهترین
      return `${p1}\u200C${p2}`;
    });

    // 5. Verbal / noun suffixes: شناسی، سازی، گذاری، پذیری، مندی
    out = out.replace(/([^\s.,،؟!؛:«»()]+)\s+(شناسی|شناس|شناسان|سازی|ساز|سازان|گذاری|گذار|پذیری|پذیر|مندی|مند|گری|گر)(?=[\s.,،؟!؛:«»\)]|$)/g, '$1\u200C$2');

    // 6. Punctuation spacing cleanup
    out = out
      // Remove spaces before punctuation
      .replace(/\s+([.,،؟!؛:»\)])/g, '$1')
      // Remove spaces after opening brackets/quotes
      .replace(/([«\(\[])\s+/g, '$1')
      // Ensure space after punctuation if followed by letter or number
      .replace(/([.,،؟!؛:»\)])([^\s\n.,،؟!؛:»\)])/g, '$1 $2')
      // Remove duplicate punctuation (.. -> . , ،، -> ،)
      .replace(/([.,،؛:])\1+/g, '$1')
      // Clean spacing
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n');

    return out.trim();
  }

  /* ------------------------------------------------------------
   *  Vocabulary Matching Engine
   * ------------------------------------------------------------ */

  let vocabLookup = [];

  function updateVocabLookup() {
    vocabLookup = [];
    vocabulary.forEach((item) => {
      const canonicalNorm = normalizePersian(item.canonical);
      // Canonical itself
      vocabLookup.push({
        canonical: item.canonical,
        phrase: item.canonical,
        words: canonicalNorm.split(' ').filter(Boolean),
        norm: canonicalNorm,
      });

      // Aliases
      if (Array.isArray(item.aliases)) {
        item.aliases.forEach((alias) => {
          const normAlias = normalizePersian(alias);
          if (normAlias) {
            vocabLookup.push({
              canonical: item.canonical,
              phrase: alias,
              words: normAlias.split(' ').filter(Boolean),
              norm: normAlias,
            });
          }
        });
      }
    });

    // Sort longest multi-word phrases first
    vocabLookup.sort((a, b) => b.words.length - a.words.length);
  }
  updateVocabLookup();

  function enhanceSpecialWords(text) {
    if (!text || !vocabLookup.length) return text;

    const originalTokens = text.split(/\s+/).filter(Boolean);
    if (!originalTokens.length) return text;

    const normTokens = originalTokens.map(normalizePersian);
    const consumed = new Array(originalTokens.length).fill(false);
    const replacements = {};

    // 1. Phrase / Multi-word and exact single-word replacement
    for (const entry of vocabLookup) {
      if (entry.words.length === 0) continue;
      for (let i = 0; i <= normTokens.length - entry.words.length; i++) {
        let match = true;
        for (let j = 0; j < entry.words.length; j++) {
          if (consumed[i + j] || normTokens[i + j] !== entry.words[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          for (let j = 0; j < entry.words.length; j++) consumed[i + j] = true;
          replacements[i] = entry.canonical;
          break;
        }
      }
    }

    // 2. Fuzzy match for remaining unconsumed single tokens (length >= 4)
    for (let i = 0; i < originalTokens.length; i++) {
      if (!consumed[i]) {
        const norm = normTokens[i];
        if (norm.length >= 4) {
          let bestMatch = null;
          let bestScore = 0.78; // threshold for single-char distance on short words
          for (const entry of vocabLookup) {
            if (entry.words.length === 1) {
              const score = wordSimilarity(norm, entry.norm);
              if (score > bestScore) {
                bestScore = score;
                bestMatch = entry.canonical;
              }
            }
          }
          if (bestMatch) {
            replacements[i] = bestMatch;
            consumed[i] = true;
          }
        }
      }
    }

    // Build enhanced string
    const result = [];
    for (let i = 0; i < originalTokens.length; i++) {
      if (replacements[i] != null) {
        result.push(replacements[i]);
      } else if (!consumed[i]) {
        result.push(originalTokens[i]);
      }
    }

    return result.join(' ');
  }

  /* ------------------------------------------------------------
   *  Voice Command & Speech Chunk Processing
   * ------------------------------------------------------------ */

  function processFinalChunk(raw) {
    // 1. Command and punctuation detection
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

    const wordsWithoutCommands = [];
    for (let i = 0; i < originalWords.length; i++) {
      if (replacements[i] != null) {
        wordsWithoutCommands.push(replacements[i]);
        continue;
      }
      if (!consumed[i]) wordsWithoutCommands.push(originalWords[i]);
    }

    let text = wordsWithoutCommands.join(' ');

    // 2. Enhance Special Vocabulary & Jargon
    text = enhanceSpecialWords(text);

    // 3. Smart ZWNJ & Orthography
    if (state.smartZwnj) {
      text = applyPersianOrthography(text);
    }

    // 4. Digits Conversion
    if (state.persianDigits) {
      text = toPersianDigits(text);
    }

    return { fired, text };
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
        doDownloadTxt();
        break;
      case 'format':
        doFormatText();
        break;
      case 'undo':
        undo();
        break;
      case 'vocab':
        openVocabModal();
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
        closeVocabModal();
        closeExportMenu();
        break;
      default:
        break;
    }
  }

  /* ------------------------------------------------------------
   *  Undo / Redo Management & Editable Transcript
   * ------------------------------------------------------------ */

  function pushUndo(currentText) {
    if (undoStack.length >= 50) undoStack.shift();
    undoStack.push(currentText);
    redoStack = [];
    updateUndoRedoButtons();
  }

  function undo() {
    if (!undoStack.length) return;
    const current = getTranscriptText();
    redoStack.push(current);
    const prev = undoStack.pop();
    setTranscriptText(prev, false);
    updateUndoRedoButtons();
  }

  function redo() {
    if (!redoStack.length) return;
    const current = getTranscriptText();
    undoStack.push(current);
    const next = redoStack.pop();
    setTranscriptText(next, false);
    updateUndoRedoButtons();
  }

  function updateUndoRedoButtons() {
    els.undoBtn.disabled = undoStack.length === 0;
    els.redoBtn.disabled = redoStack.length === 0;
  }

  function getTranscriptText() {
    return els.transcript.innerText || '';
  }

  function setTranscriptText(text, shouldPushUndo = true) {
    const prev = getTranscriptText();
    if (shouldPushUndo && prev !== text) {
      pushUndo(prev);
    }
    isInternalEdit = true;
    finalSegments = text ? [text] : [];
    renderTranscript();
    isInternalEdit = false;
  }

  /* ------------------------------------------------------------
   *  Transcript Rendering & UI Update
   * ------------------------------------------------------------ */

  function cleanSpacing(text) {
    return String(text || '')
      .replace(/[ \t]+/g, ' ')
      .replace(/ +([.,،؟!؛:])/g, '$1')
      .replace(/ *\n */g, '\n')
      .trim();
  }

  function fullText() {
    return cleanSpacing(finalSegments.join(' '));
  }

  function hasContent() {
    return fullText().length > 0 || interimText.length > 0;
  }

  function renderTranscript() {
    const text = fullText();
    els.transcript.textContent = '';
    
    if (text) {
      els.transcript.appendChild(document.createTextNode(text));
    }
    
    if (interimText) {
      const span = document.createElement('span');
      span.className = 'interim';
      span.textContent = (text ? ' ' : '') + interimText;
      els.transcript.appendChild(span);
    }

    els.transcript.scrollTop = els.transcript.scrollHeight;
    updateStats();
    updateSecondaryButtons();
  }

  function updateStats() {
    const combined = (fullText() + ' ' + interimText).trim();
    const words = combined ? combined.split(/\s+/).filter(Boolean).length : 0;
    const chars = fullText().length;
    els.wordCount.textContent = state.persianDigits ? toPersianDigits(words) : String(words);
    els.charCount.textContent = state.persianDigits ? toPersianDigits(chars) : String(chars);
    els.segmentCount.textContent = state.persianDigits ? toPersianDigits(finalSegments.length) : String(finalSegments.length);
  }

  function updateSecondaryButtons() {
    const has = hasContent();
    els.copyBtn.disabled = !has;
    els.exportDropdownBtn.disabled = !has;
    els.clearBtn.disabled = !has;
  }

  /* ------------------------------------------------------------
   *  Live Audio Visualizer (Web Audio API)
   * ------------------------------------------------------------ */

  async function startVisualizer() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      state.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      state.audioContext = new AudioCtx();
      const source = state.audioContext.createMediaStreamSource(state.audioStream);
      state.analyser = state.audioContext.createAnalyser();
      state.analyser.fftSize = 64;
      source.connect(state.analyser);

      els.audioVisualizer.classList.add('active');
      drawVisualizer();
    } catch {
      /* Graceful fallback if mic stream cannot be acquired separately */
    }
  }

  function stopVisualizer() {
    if (state.visualizerAnimId) {
      cancelAnimationFrame(state.visualizerAnimId);
      state.visualizerAnimId = null;
    }
    if (state.audioStream) {
      state.audioStream.getTracks().forEach((track) => track.stop());
      state.audioStream = null;
    }
    if (state.audioContext) {
      state.audioContext.close().catch(() => {});
      state.audioContext = null;
    }
    els.audioVisualizer.classList.remove('active');
    const ctx = els.audioVisualizer.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, els.audioVisualizer.width, els.audioVisualizer.height);
  }

  function drawVisualizer() {
    if (!state.listening || !state.analyser) return;
    const canvas = els.audioVisualizer;
    const ctx = canvas.getContext('2d');
    const bufferLength = state.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!state.listening || !state.analyser) return;
      state.visualizerAnimId = requestAnimationFrame(render);
      state.analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / (bufferLength / 2)) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength / 2; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9 + 2;
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#6366f1');
        grad.addColorStop(1, '#0ea5a4');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth - 2, barHeight, [2, 2, 0, 0]);
        ctx.fill();
        x += barWidth;
      }
    };
    render();
  }

  /* ------------------------------------------------------------
   *  Timer
   * ------------------------------------------------------------ */

  function startTimer() {
    state.startTime = Date.now();
    els.timer.textContent = state.persianDigits ? toPersianDigits('00:00') : '00:00';
    state.timerId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
      els.timer.textContent = state.persianDigits ? toPersianDigits(timeStr) : timeStr;
    }, 250);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  /* ------------------------------------------------------------
   *  Resilient Speech Recognition & Continuous Lifecycle Manager
   * ------------------------------------------------------------ */

  function createRecognitionInstance() {
    if (recognition) {
      try {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.onstart = null;
        recognition.abort();
      } catch {
        /* ignore */
      }
    }

    const rec = new SpeechRecognition();
    rec.lang = RECOGNITION_LANG;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    rec.onstart = () => {
      isRestarting = false;
      retryCount = 0;
      if (state.listening) {
        renderStatus();
      }
    };

    rec.onresult = (event) => {
      retryCount = 0;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (result.isFinal) {
          // Select best hypothesis using vocabulary scoring
          let bestTranscript = (result[0] && result[0].transcript) || '';
          let maxMatches = 0;

          for (let j = 0; j < result.length; j++) {
            const alt = result[j].transcript;
            const normAlt = normalizePersian(alt);
            let matches = 0;
            for (const item of vocabLookup) {
              if (normAlt.includes(item.norm)) matches += 2;
            }
            for (const cmd of ALIASES) {
              if (normAlt.includes(cmd.cmd.aliases[0])) matches += 3;
            }
            if (matches > maxMatches) {
              maxMatches = matches;
              bestTranscript = alt;
            }
          }

          // Process final chunk with commands, vocabulary, and orthography
          const processed = processFinalChunk(bestTranscript);
          if (processed.text) {
            pushUndo(getTranscriptText());
            finalSegments.push(processed.text);
          }
          interimText = '';
          processed.fired.forEach(executeCommand);
        } else {
          // Interim hypothesis display
          let rawInterim = (result[0] && result[0].transcript) || '';
          if (state.smartZwnj) rawInterim = applyPersianOrthography(rawInterim);
          if (state.persianDigits) rawInterim = toPersianDigits(rawInterim);
          interimText = rawInterim;
        }
      }
      renderTranscript();
    };

    rec.onerror = (event) => {
      const code = event.error || 'default';

      // 1. Benign / recoverable events: silence timeouts or network reconnects
      if (code === 'no-speech' || code === 'aborted') {
        if (state.listening) {
          scheduleRestart(100);
        }
        return;
      }

      if (code === 'network') {
        // Cloud speech session periodic recycle (Google servers disconnect every 60s of streaming)
        if (state.listening) {
          els.statusText.textContent = t().statusReconnecting;
          scheduleRestart(350);
        }
        return;
      }

      // 2. Fatal permission/service errors: stop recording completely
      if (code === 'not-allowed' || code === 'service-not-allowed' || code === 'language-not-supported') {
        stopListening();
        showError(code);
        showToast(t().errors[code] || t().errors.default);
        return;
      }

      // 3. Temporary audio capture or other glitches: recover
      if (state.listening) {
        scheduleRestart(500);
      }
    };

    rec.onend = () => {
      if (state.listening) {
        // Automatically restart to keep recording continuously
        scheduleRestart(100);
      } else {
        stopTimer();
        stopVisualizer();
        renderStatus();
      }
    };

    return rec;
  }

  function scheduleRestart(delay = 100) {
    if (!state.listening) return;
    if (restartTimeoutId) clearTimeout(restartTimeoutId);

    isRestarting = true;
    const backoff = Math.min(delay + (retryCount * 200), MAX_RETRY_DELAY);
    retryCount++;

    restartTimeoutId = setTimeout(() => {
      if (!state.listening) return;
      try {
        recognition = createRecognitionInstance();
        recognition.start();
      } catch {
        if (state.listening) {
          scheduleRestart(400);
        }
      }
    }, backoff);
  }

  function startWatchdog() {
    if (watchdogIntervalId) clearInterval(watchdogIntervalId);
    watchdogIntervalId = setInterval(() => {
      if (state.listening && !isRestarting) {
        try {
          if (!recognition) {
            scheduleRestart(50);
          }
        } catch {
          scheduleRestart(200);
        }
      }
    }, 2500);
  }

  function stopWatchdog() {
    if (watchdogIntervalId) {
      clearInterval(watchdogIntervalId);
      watchdogIntervalId = null;
    }
  }

  function startListening() {
    if (!supported || state.listening) return;
    state.listening = true;
    retryCount = 0;
    isRestarting = false;
    startTimer();
    startVisualizer();
    startWatchdog();
    renderStatus();
    els.transcriptCard.classList.add('listening');
    els.startLabel.textContent = t().stop;
    els.startIconMic.hidden = true;
    els.startIconStop.hidden = false;
    els.startBtn.classList.add('is-listening');

    try {
      recognition = createRecognitionInstance();
      recognition.start();
    } catch {
      scheduleRestart(200);
    }
  }

  function stopListening() {
    if (!state.listening) return;
    state.listening = false;
    isRestarting = false;
    if (restartTimeoutId) {
      clearTimeout(restartTimeoutId);
      restartTimeoutId = null;
    }
    stopWatchdog();
    stopTimer();
    stopVisualizer();
    renderStatus();
    els.transcriptCard.classList.remove('listening');
    els.startLabel.textContent = t().start;
    els.startIconMic.hidden = false;
    els.startIconStop.hidden = true;
    els.startBtn.classList.remove('is-listening');

    if (recognition) {
      try {
        recognition.stop();
      } catch {
        /* not running */
      }
    }
  }

  /* ------------------------------------------------------------
   *  Formatting & Editing Actions
   * ------------------------------------------------------------ */

  function doFormatText() {
    const text = getTranscriptText();
    if (!text.trim()) {
      showToast(t().empty);
      return;
    }
    pushUndo(text);
    let formatted = enhanceSpecialWords(text);
    formatted = applyPersianOrthography(formatted);
    if (state.persianDigits) {
      formatted = toPersianDigits(formatted);
    }
    finalSegments = [formatted];
    renderTranscript();
    showToast(t().formattedToast);
  }

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

  function getTimestamp() {
    return new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '-');
  }

  function doDownloadTxt() {
    if (!hasContent()) {
      showToast(t().empty);
      return;
    }
    const text = fullText();
    const stamp = getTimestamp();
    const blob = new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persian-transcript-${stamp}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(t().downloaded);
    closeExportMenu();
  }

  function doDownloadMd() {
    if (!hasContent()) {
      showToast(t().empty);
      return;
    }
    const text = fullText();
    const stamp = getTimestamp();
    const words = els.wordCount.textContent;
    const chars = els.charCount.textContent;
    const dateFormatted = new Date().toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US');

    const mdContent = `---
title: Persian Speech Transcript
date: ${dateFormatted}
words: ${words}
characters: ${chars}
generator: Web Speech API Persian
---

# گفتار پیاده‌سازی شده

${text}
`;

    const blob = new Blob(['\uFEFF' + mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persian-transcript-${stamp}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(t().downloaded);
    closeExportMenu();
  }

  function doPrint() {
    if (!hasContent()) {
      showToast(t().empty);
      return;
    }
    closeExportMenu();
    window.print();
  }

  function doClear() {
    const prev = getTranscriptText();
    if (prev) pushUndo(prev);
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

  /* ------------------------------------------------------------
   *  Vocabulary Manager UI & Actions
   * ------------------------------------------------------------ */

  function updateVocabBadge() {
    const count = vocabulary.length;
    els.vocabBadge.textContent = state.persianDigits ? toPersianDigits(count) : String(count);
    els.vocabCountBadge.textContent = `${state.persianDigits ? toPersianDigits(count) : count} ${t().wordSuffix}`;
  }

  function renderVocabList() {
    const list = els.vocabList;
    list.textContent = '';

    const query = normalizePersian(state.vocabSearchQuery);
    const filterCat = state.selectedVocabCategory;

    const filtered = vocabulary.filter((item) => {
      // Category filter
      if (filterCat !== 'all' && item.category !== filterCat) return false;
      // Search filter
      if (query) {
        const canonicalNorm = normalizePersian(item.canonical);
        const aliasesNorm = (item.aliases || []).map(normalizePersian).join(' ');
        if (!canonicalNorm.includes(query) && !aliasesNorm.includes(query)) return false;
      }
      return true;
    });

    els.vocabEmpty.hidden = filtered.length > 0;

    filtered.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'vocab-item';

      const main = document.createElement('div');
      main.className = 'vocab-item-main';

      const row = document.createElement('div');
      row.className = 'vocab-canonical-row';

      const canonical = document.createElement('span');
      canonical.className = 'vocab-canonical';
      canonical.textContent = item.canonical;
      row.appendChild(canonical);

      if (item.category) {
        const catTag = document.createElement('span');
        catTag.className = 'category-tag';
        const catKey = 'cat' + item.category.charAt(0).toUpperCase() + item.category.slice(1);
        catTag.textContent = t()[catKey] || item.category;
        row.appendChild(catTag);
      }
      main.appendChild(row);

      if (Array.isArray(item.aliases) && item.aliases.length > 0) {
        const aliasWrap = document.createElement('div');
        aliasWrap.className = 'vocab-aliases';
        item.aliases.forEach((alias) => {
          const chip = document.createElement('span');
          chip.className = 'alias-chip';
          chip.textContent = alias;
          aliasWrap.appendChild(chip);
        });
        main.appendChild(aliasWrap);
      }

      li.appendChild(main);

      const actions = document.createElement('div');
      actions.className = 'vocab-actions';

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-icon-del';
      delBtn.type = 'button';
      delBtn.title = lang === 'fa' ? 'حذف واژه' : 'Delete word';
      delBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      `;
      delBtn.addEventListener('click', () => {
        vocabulary = vocabulary.filter((v) => v.id !== item.id);
        saveVocabulary();
        showToast(t().vocabDeletedToast);
      });

      actions.appendChild(delBtn);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function openVocabModal() {
    renderVocabList();
    updateVocabBadge();
    els.vocabModal.hidden = false;
    document.body.classList.add('modal-open');
    els.vocabCanonical.focus();
  }

  function closeVocabModal() {
    els.vocabModal.hidden = true;
    document.body.classList.remove('modal-open');
    els.vocabForm.reset();
  }

  function exportVocabJson() {
    const dataStr = JSON.stringify(vocabulary, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persian-stt-vocabulary-${getTimestamp()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importVocabJson(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed)) {
          vocabulary = parsed.map((item, idx) => ({
            id: item.id || `v-imp-${Date.now()}-${idx}`,
            canonical: String(item.canonical || '').trim(),
            aliases: Array.isArray(item.aliases) ? item.aliases.map((a) => String(a).trim()).filter(Boolean) : [],
            category: item.category || 'general'
          })).filter((item) => item.canonical);

          saveVocabulary();
          showToast(t().vocabImportSuccess);
        } else {
          showToast(t().vocabImportError);
        }
      } catch {
        showToast(t().vocabImportError);
      }
    };
    reader.readAsText(file);
  }

  /* ------------------------------------------------------------
   *  Help & Export Menu
   * ------------------------------------------------------------ */

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

  function toggleExportMenu() {
    const isOpen = !els.exportMenu.hidden;
    if (isOpen) {
      closeExportMenu();
    } else {
      els.exportMenu.hidden = false;
      els.exportDropdownContainer.classList.add('open');
      els.exportDropdownBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeExportMenu() {
    els.exportMenu.hidden = true;
    els.exportDropdownContainer.classList.remove('open');
    els.exportDropdownBtn.setAttribute('aria-expanded', 'false');
  }

  /* ------------------------------------------------------------
   *  Internationalization (i18n)
   * ------------------------------------------------------------ */

  function applyLang() {
    const s = t();
    els.html.lang = lang;
    els.html.dir = s.dir;
    document.title = s.title;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key in s) el.textContent = s[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key in s) el.setAttribute('placeholder', s[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (key in s) el.setAttribute('title', s[key]);
    });

    els.langToggleLabel.textContent = s.toggleLabel;
    els.transcript.setAttribute('data-placeholder', s.placeholder);
    els.helpBtn.setAttribute('aria-label', s.helpButton);
    els.helpClose.setAttribute('aria-label', s.closeHelp);
    els.vocabBtn.setAttribute('aria-label', s.vocabTitle);
    els.vocabClose.setAttribute('aria-label', s.closeHelp);

    els.startLabel.textContent = state.listening ? s.stop : s.start;
    els.clearLabel.textContent = s.clear;
    if (clearArmed) disarmClear();
    
    renderStatus();
    buildHelpList();
    renderVocabList();
    updateVocabBadge();
    updateStats();
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

  /* ------------------------------------------------------------
   *  Status & Toast
   * ------------------------------------------------------------ */

  function renderStatus() {
    const s = t();
    els.statusDot.classList.toggle('listening', state.listening);
    if (state.listening) {
      els.statusText.textContent = isRestarting ? s.statusReconnecting : s.statusListening;
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

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove('show');
      toastTimer = null;
    }, 2400);
  }

  /* ------------------------------------------------------------
   *  Event Listeners & Shortcuts
   * ------------------------------------------------------------ */

  // Language toggle
  els.langToggle.addEventListener('click', () => {
    setLang(lang === 'fa' ? 'en' : 'fa');
  });

  // Help modal events
  els.helpBtn.addEventListener('click', openHelp);
  els.helpClose.addEventListener('click', closeHelp);
  els.helpBackdrop.addEventListener('click', closeHelp);

  // Vocabulary modal events
  els.vocabBtn.addEventListener('click', openVocabModal);
  els.vocabClose.addEventListener('click', closeVocabModal);
  els.vocabBackdrop.addEventListener('click', closeVocabModal);

  // Load Presets
  els.loadMedPackBtn.addEventListener('click', () => {
    mergeVocabularyPack(MEDICAL_VOCABULARY_PACK);
    state.selectedVocabCategory = 'medical';
    document.querySelectorAll('.filter-pill').forEach((p) => {
      p.classList.toggle('active', p.dataset.category === 'medical');
    });
    renderVocabList();
    showToast(t().presetMedLoaded);
  });

  els.loadTechPackBtn.addEventListener('click', () => {
    mergeVocabularyPack(TECH_VOCABULARY_PACK);
    state.selectedVocabCategory = 'tech';
    document.querySelectorAll('.filter-pill').forEach((p) => {
      p.classList.toggle('active', p.dataset.category === 'tech');
    });
    renderVocabList();
    showToast(t().presetTechLoaded);
  });

  // Vocab form submit (Add word)
  els.vocabForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const canonical = els.vocabCanonical.value.trim();
    const rawAliases = els.vocabAliases.value.trim();
    const category = els.vocabCategory.value;

    if (!canonical) return;

    const aliases = rawAliases
      ? rawAliases.split(/[,،]+/).map((a) => a.trim()).filter(Boolean)
      : [];

    vocabulary.unshift({
      id: `v-${Date.now()}`,
      canonical,
      aliases,
      category
    });

    saveVocabulary();
    els.vocabForm.reset();
    els.vocabCanonical.focus();
    showToast(t().vocabAddedToast);
  });

  // Vocab live search & category filters
  els.vocabSearch.addEventListener('input', (e) => {
    state.vocabSearchQuery = e.target.value;
    renderVocabList();
  });

  els.vocabCategoryFilters.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    document.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    state.selectedVocabCategory = pill.dataset.category;
    renderVocabList();
  });

  els.vocabExportBtn.addEventListener('click', exportVocabJson);
  els.vocabFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      importVocabJson(e.target.files[0]);
      e.target.value = '';
    }
  });

  els.vocabResetBtn.addEventListener('click', () => {
    if (window.confirm(t().vocabResetConfirm)) {
      vocabulary = JSON.parse(JSON.stringify(DEFAULT_VOCABULARY));
      saveVocabulary();
      showToast(t().vocabReset);
    }
  });

  // Editor Toolbar events
  els.toggleZwnj.addEventListener('click', () => {
    state.smartZwnj = !state.smartZwnj;
    localStorage.setItem('stt-smart-zwnj', String(state.smartZwnj));
    els.toggleZwnj.classList.toggle('active', state.smartZwnj);
    els.toggleZwnj.setAttribute('aria-checked', String(state.smartZwnj));
  });

  els.toggleDigits.addEventListener('click', () => {
    state.persianDigits = !state.persianDigits;
    localStorage.setItem('stt-persian-digits', String(state.persianDigits));
    els.toggleDigits.classList.toggle('active', state.persianDigits);
    els.toggleDigits.setAttribute('aria-checked', String(state.persianDigits));
    
    // Refresh digits on current transcript
    const current = getTranscriptText();
    if (current) {
      const converted = state.persianDigits ? toPersianDigits(current) : toEnglishDigits(current);
      setTranscriptText(converted, true);
    }
    updateStats();
  });

  els.formatBtn.addEventListener('click', doFormatText);
  els.undoBtn.addEventListener('click', undo);
  els.redoBtn.addEventListener('click', redo);

  // Transcript live typing & manual edits
  els.transcript.addEventListener('input', () => {
    if (isInternalEdit) return;
    const text = getTranscriptText();
    finalSegments = text ? [text] : [];
    updateStats();
    updateSecondaryButtons();
  });

  // Controls events
  els.startBtn.addEventListener('click', () => {
    if (state.listening) {
      stopListening();
    } else {
      startListening();
    }
  });

  els.copyBtn.addEventListener('click', doCopy);
  els.exportDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleExportMenu();
  });
  els.downloadTxtBtn.addEventListener('click', doDownloadTxt);
  els.downloadMdBtn.addEventListener('click', doDownloadMd);
  els.printBtn.addEventListener('click', doPrint);

  document.addEventListener('click', (e) => {
    if (!els.exportDropdownContainer.contains(e.target)) {
      closeExportMenu();
    }
  });

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

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Esc: close modals and dropdowns
    if (e.key === 'Escape') {
      if (!els.helpModal.hidden) closeHelp();
      if (!els.vocabModal.hidden) closeVocabModal();
      closeExportMenu();
      return;
    }

    // Ctrl+S / Cmd+S: Quick Save TXT
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      doDownloadTxt();
      return;
    }

    // Ctrl+Shift+C: Quick Copy
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      doCopy();
      return;
    }

    // Space / Alt+S: Toggle listening when not inside an input/contenteditable
    const activeEl = document.activeElement;
    const isEditing = activeEl && (
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.isContentEditable
    );

    if (e.altKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (state.listening) stopListening();
      else startListening();
      return;
    }

    if (e.key === ' ' && !isEditing && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (state.listening) stopListening();
      else startListening();
      return;
    }

    // Ctrl+Z / Ctrl+Y for Undo / Redo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      if (e.shiftKey) {
        e.preventDefault();
        redo();
      } else {
        e.preventDefault();
        undo();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
    }
  });

  /* ------------------------------------------------------------
   *  Service Worker Registration (PWA)
   * ------------------------------------------------------------ */

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        /* SW registration failed in unsupported/sandbox environment */
      });
    });
  }

  /* ------------------------------------------------------------
   *  Boot
   * ------------------------------------------------------------ */

  if (!supported) {
    els.unsupported.hidden = false;
    els.startBtn.disabled = true;
    els.statusDot.classList.add('error');
    els.statusText.textContent = t().statusError;
  }

  // Restore toggle states in UI
  els.toggleZwnj.classList.toggle('active', state.smartZwnj);
  els.toggleZwnj.setAttribute('aria-checked', String(state.smartZwnj));
  els.toggleDigits.classList.toggle('active', state.persianDigits);
  els.toggleDigits.setAttribute('aria-checked', String(state.persianDigits));

  applyLang();
  updateSecondaryButtons();
  updateUndoRedoButtons();
})();
