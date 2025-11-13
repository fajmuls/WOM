
// @ts-nocheck

const translations = {
  en: {
    translation: {
      appTitle: "Workout Tracker",
      nav: {
        dashboard: "Home",
        journal: "Journal",
        library: "Library",
        timers: "Timers",
        settings: "Settings"
      },
      dashboard: {
        title: "Welcome Back!",
        todaysWorkout: "Today's Workout",
        noWorkoutScheduled: "No workout scheduled for today.",
        viewSchedule: "View Schedule",
        weeklySummary: "Weekly Summary",
        workouts: "Workouts",
        volume: "Volume",
        startEmptyWorkout: "Start Empty Workout",
        quickTimer: "Quick Timer",
        // Old dashboard keys, keep for reference or other components
        workoutLog: { title: "Workout Journal", description: "Summary, calendar & history." },
        workoutLibrary: { title: "Workout Library", description: "Manage exercises and plans." },
        manageTimers: { title: "Manage Timers", description: "Create timer templates." },
        workoutSchedule: { title: "Workout Schedule", description: "Plan your weekly workouts." },
        bodyTracker: { title: "Body Tracker", description: "Log weight and measurements." },
        settings: { title: "Settings", description: "Configure sounds & volume." },
        musicPlayer: { title: "Music Player", description: "Launch Spotify/YT Music." },
      },
      timer: {
        minutes: "Minutes",
        seconds: "Seconds",
        start: "Start",
        templatesTitle: "Timer Templates",
        quickTimerTitle: "Quick Timer",
        noTemplates: "No timer templates created yet.",
        emptyTemplateWarning: "This template has no segments. Please edit it first.",
      },
      workoutLibrary: {
        title: "Workout Library",
        tabs: {
          exercises: "Exercises",
          plans: "Plans",
        }
      },
      manageWorkouts: {
        title: "Manage My Exercises",
        addExercise: "Add New Exercise",
        editExercise: "Edit Exercise",
        placeholder: "e.g., Bench Press",
        selectCategory: "Select a Category",
        categoryPlaceholder: "Category",
        noExercises: "No exercises added yet. Add one to get started!",
        noExercisesInCategory: "No exercises in the '{{category}}' category.",
        deleteConfirmMessage: "Are you sure you want to delete '{{name}}'? This action cannot be undone."
      },
       manageCategories: {
        title: "Manage Categories",
        addCategory: "Add New Category",
        editCategory: "Edit Category",
        categoryNamePlaceholder: "Category Name",
        uncategorized: "Uncategorized",
        deleteConfirmTitle: "Delete Category?",
        deleteConfirmMessage: "Are you sure you want to delete the '{{name}}' category? All exercises in this category will be moved to 'Uncategorized'.",
        renameInfo: "Renaming a category will update all associated exercises."
      },
      workoutLog: {
        title: "Workout Log",
        selectDate: "Log for:",
        logForToday: "Today's Log",
        unknownExercise: "Unknown Exercise",
        sets: "SETS",
        reps: "REPS",
        weight: "WEIGHT",
        time: "TIME",
        secondsAbbr: "secs",
        addSet: "Add Set",
        addExerciseToLog: "Add Exercise to Log",
        addExercise: "Add",
        emptyLog: "Your workout log for this day is empty.",
        setAllSame: "Set All The Same",
        selectCategoryFirst: "Select Category First",
      },
      workoutJournal: {
        title: "Workout Journal",
        tabs: {
          summary: "Summary",
          calendar: "Calendar",
          history: "History",
        },
        summary: {
          thisWeek: "This Week",
          thisMonth: "This Month",
          workouts: "Workouts",
          volume: "Total Volume (kg)",
          sets: "Total Sets",
          totalReps: "Total Reps",
          mostFrequent: "Most Frequent",
          activityLast30Days: "Activity (Last 30 Days)",
          noActivity: "No activity recorded for this period.",
          noData: "No Data",
          exerciseStats: {
              title: "Exercise Statistics",
              exercise: "Exercise",
              sets: "Sets",
              reps: "Reps",
              volume: "Volume (kg)",
          }
        },
        calendar: {
          addExercise: "Add Exercise",
          noLog: "No workout logged for this day.",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        history: {
          noHistory: "Your workout history is empty.",
          reps: "reps",
          sets: "sets"
        }
      },
      manageTimers: {
        title: "Timer Templates",
        editTemplateTitle: "Edit Template",
        createNew: "Create New Template",
        noTemplates: "No templates created. Tap 'Create New' to start!",
        templateName: "Template Name",
        newTemplateName: "New Workout Timer",
        segments: "Segments",
        segmentNamePlaceholder: "Segment Name",
        newSegmentName: "New Segment",
        duration: "Duration",
        addSegment: "Add Segment",
        saveTemplate: "Save Template",
        linkPlan: "Link Workout Plan (Optional)",
        linkPlanOptional: "None - Manual Timer",
        linkPlanDescription: "Linking a plan will auto-populate segments and add a warm-up/cooldown.",
        duplicate: "Duplicate Template",
        totalDuration: "Total Duration",
        restBetweenSegments: "Rest Between Segments",
        enableRest: "Enable",
        restDuration: "Rest Duration (s)",
        segmentDuration: "Duration",
        autoWarmup: "Warm-up",
        autoCooldown: "Cooldown",
        deleteConfirmMessage: "Are you sure you want to delete the timer template '{{name}}'?",
        summary: {
          title: "Template Summary",
          warmup: "Warm-up",
          work: "Work",
          rest: "Rest",
          cooldown: "Cooldown",
        },
        segment: {
            type: "Type",
            types: {
                warmup: "Warm-up",
                work: "Work",
                rest: "Rest",
                cooldown: "Cooldown"
            },
            exercise: "Exercise",
            noExercise: "No specific exercise",
            sets: "Sets",
            workDuration: "Work",
            restDuration: "Rest",
            interval: "Interval"
        }
      },
      managePlans: {
        addPlan: "Create New Plan",
        editPlan: "Edit Plan",
        planName: "Plan Name",
        planNamePlaceholder: "e.g., Push Day",
        selectExercises: "Select Exercises",
        noExercises: "No exercises in library. Add some first!",
        noExercisesInPlan: "No exercises in this plan yet.",
        noPlans: "No workout plans created yet.",
        duplicate: "Duplicate Plan",
        deleteConfirmMessage: "Are you sure you want to delete the plan '{{name}}'?"
      },
      musicPlayer: {
        title: "Music Player",
        platforms: "Supported Platforms",
        addToPlaylist: "Add to Playlist",
        placeholder: "Paste Spotify or YouTube Music URL",
        single: "Single Track",
        playlist: "Playlist",
        note: "Note: This feature opens the official apps. It does not play music directly inside this app.",
        singles: "Tracks",
        playlists: "Playlists",
        nowPlaying: "Open Music Player",
        invalidUrlWarning: "Please enter a valid Spotify or YouTube Music URL.",
        emptyList: "This list is empty.",
        spotifyLink: "Spotify Link",
        ytMusicLink: "YouTube Music Link",
        unknownLink: "Music Link"
      },
      bodyTracker: {
        title: "Body Tracker",
        addMeasurement: "Add New Measurement",
        weight: "Weight (kg)",
        height: "Height (cm)",
        bodyFat: "Body Fat (%) (Optional)",
        bmi: "Body Mass Index",
        latest: "Latest",
        history: "Measurement History",
        noHistory: "No measurements recorded yet.",
      },
      postWorkout: {
        title: "Workout Complete!",
        subtitle: "Review and save your workout log.",
        saveLog: "Save to Journal",
        discard: "Discard"
      },
      setTimerModal: {
        title: "Set Timer",
        close: "Close"
      },
      settings: {
        title: "Settings",
        general: {
            title: "General"
        },
        features: {
            title: "Features"
        },
        theme: {
            title: "Appearance",
            AriTheme: "Ari",
        },
        language: {
          title: "Language",
        },
        reset: {
          title: "Reset Settings",
          button: "Reset",
          confirmTitle: "Reset all settings?",
          confirmMessage: "Are you sure you want to restore all settings to their default values? This cannot be undone."
        },
        notifications: {
            title: "Workout Reminders",
            status: "Status",
            enable: "Enable",
        },
        offline: {
            title: "Offline Mode",
            description: "This app is designed to be offline-first. All your data is stored on your device, and no internet connection is required to use any features."
        },
        volume: {
            title: "Master Volume",
        },
        sounds: {
          title: "Custom Sound Settings",
          frequency: "Frequency (Hz)",
          duration: "Duration (s)",
          waveform: "Waveform",
          test: "Test",
          types: {
            timerEnd: "Timer End",
            segmentEnd: "Segment End",
            interval: "Interval Tick",
            menuClick: "Menu Click",
            splashOpen: "Opening Animation"
          },
          waveforms: {
            sine: "Sine",
            square: "Square",
            sawtooth: "Sawtooth",
            triangle: "Triangle"
          }
        },
        data: {
          title: "Data Management",
          description: "Save your data to a file or load it on another device.",
          howToDetails: "<strong>Export:</strong> Creates a backup of all your custom data (exercises, plans, logs, timers, settings) into a single file. Save this file in a secure location.<br/><br/><strong>Import:</strong> Restores your data from a backup file. <strong>Warning:</strong> This will overwrite all existing data in the app. Use this to move your data to a new device or to recover it.",
          export: "Export Data",
          importFile: "Import from File",
          importFromLink: "Import from Link",
          importWarning: "This will overwrite all your current data. Are you sure you want to continue?",
          importSuccess: "Data imported successfully!",
          importError: "Invalid file format. Please select a valid backup file.",
        },
        version: "Version"
      },
      notification: {
        title: "Time to Work Out!",
        body: "It's time for your scheduled {{workout}} session.",
      },
      importModal: {
        title: "Import Shared Item",
        confirmation: "You have received a shared {{type}} named '{{name}}'. Would you like to add it to your library?",
        addButton: "Add to Library",
        success: "Item added successfully!",
        error: "Failed to import item. The link may be invalid or corrupted.",
        errorInvalidFormat: "Invalid share link format. Please check the link and try again.",
        errorUnsupportedType: "The shared item type is not supported by this version of the app.",
        errorMissingName: "The shared item appears to be corrupted (missing name)."
      },
      importLinkModal: {
        title: "Import from Link",
        placeholder: "Paste the shared link here",
        importButton: "Import",
      },
      importDataModal: {
        title: "Import Data",
        confirmTitle: "Confirm Import",
        confirmMessage: "This will overwrite all current app data. This action cannot be undone. Are you sure?",
        confirmButton: "Yes, Overwrite",
        loading: "Importing data...",
        successTitle: "Import Successful",
        successMessage: "Your data has been restored.",
        errorTitle: "Import Failed",
        doneButton: "Done",
        closeButton: "Close"
      },
      confirmModal: {
        defaultTitle: "Are you sure?",
        confirmButton: "Confirm",
        cancelButton: "Cancel"
      },
      common: {
        save: "Save",
        cancel: "Cancel",
        add: "Add",
        edit: "Edit",
        delete: "Delete",
        optional: "Optional",
        share: "Share",
        shareLinkCopied: "Share link copied to clipboard!"
      }
    }
  },
  id: {
    translation: {
      appTitle: "Pelacak Olahraga",
      nav: {
        dashboard: "Beranda",
        journal: "Jurnal",
        library: "Pustaka",
        timers: "Timer",
        settings: "Setelan"
      },
      dashboard: {
        title: "Selamat Datang!",
        todaysWorkout: "Latihan Hari Ini",
        noWorkoutScheduled: "Tidak ada latihan terjadwal hari ini.",
        viewSchedule: "Lihat Jadwal",
        weeklySummary: "Ringkasan Mingguan",
        workouts: "Latihan",
        volume: "Volume",
        startEmptyWorkout: "Mulai Latihan Kosong",
        quickTimer: "Timer Cepat",
        // Old dashboard keys
        workoutLog: { title: "Jurnal Latihan", description: "Ringkasan, kalender & riwayat." },
        workoutLibrary: { title: "Pustaka Latihan", description: "Kelola latihan dan program." },
        manageTimers: { title: "Kelola Timer", description: "Buat template timer." },
        workoutSchedule: { title: "Jadwal Latihan", description: "Rencanakan latihan mingguan Anda." },
        bodyTracker: { title: "Pelacak Tubuh", description: "Catat berat dan ukuran." },
        settings: { title: "Pengaturan", description: "Konfigurasi suara & volume." },
        musicPlayer: { title: "Pemutar Musik", description: "Buka Spotify/YT Music." },
      },
      timer: {
        minutes: "Menit",
        seconds: "Detik",
        start: "Mulai",
        templatesTitle: "Template Timer",
        quickTimerTitle: "Timer Cepat",
        noTemplates: "Belum ada template timer yang dibuat.",
        emptyTemplateWarning: "Template ini tidak memiliki segmen. Harap edit terlebih dahulu.",
      },
       workoutLibrary: {
        title: "Pustaka Latihan",
        tabs: {
          exercises: "Latihan",
          plans: "Program",
        }
      },
      manageWorkouts: {
        title: "Kelola Latihan Saya",
        addExercise: "Tambah Latihan Baru",
        editExercise: "Edit Latihan",
        placeholder: "cth., Bench Press",
        selectCategory: "Pilih Kategori",
        categoryPlaceholder: "Kategori",
        noExercises: "Belum ada latihan ditambahkan. Tambahkan satu untuk memulai!",
        noExercisesInCategory: "Tidak ada latihan di kategori '{{category}}'.",
        deleteConfirmMessage: "Anda yakin ingin menghapus '{{name}}'? Tindakan ini tidak dapat dibatalkan."
      },
      manageCategories: {
        title: "Kelola Kategori",
        addCategory: "Tambah Kategori Baru",
        editCategory: "Edit Kategori",
        categoryNamePlaceholder: "Nama Kategori",
        uncategorized: "Tanpa Kategori",
        deleteConfirmTitle: "Hapus Kategori?",
        deleteConfirmMessage: "Anda yakin ingin menghapus kategori '{{name}}'? Semua latihan dalam kategori ini akan dipindahkan ke 'Tanpa Kategori'.",
        renameInfo: "Mengganti nama kategori akan memperbarui semua latihan yang terkait."
      },
      workoutLog: {
        title: "Catatan Latihan",
        selectDate: "Catatan untuk:",
        logForToday: "Catatan Hari Ini",
        unknownExercise: "Latihan Tidak Dikenal",
        sets: "SET",
        reps: "REP",
        weight: "BEBAN",
        time: "WAKTU",
        secondsAbbr: "dtk",
        addSet: "Tambah Set",
        addExerciseToLog: "Tambah Latihan ke Catatan",
        addExercise: "Tambah",
        emptyLog: "Catatan latihan Anda untuk hari ini kosong.",
        setAllSame: "Samakan Semua",
        selectCategoryFirst: "Pilih Kategori Dahulu",
      },
      workoutJournal: {
        title: "Jurnal Latihan",
        tabs: {
          summary: "Ringkasan",
          calendar: "Kalender",
          history: "Riwayat",
        },
        summary: {
          thisWeek: "Minggu Ini",
          thisMonth: "Bulan Ini",
          workouts: "Latihan",
          volume: "Total Volume (kg)",
          sets: "Total Set",
          totalReps: "Total Repetisi",
          mostFrequent: "Paling Sering",
          activityLast30Days: "Aktivitas (30 Hari Terakhir)",
          noActivity: "Tidak ada aktivitas tercatat untuk periode ini.",
          noData: "Tidak Ada Data",
           exerciseStats: {
              title: "Statistik Latihan",
              exercise: "Latihan",
              sets: "Set",
              reps: "Rep",
              volume: "Volume (kg)",
          }
        },
        calendar: {
          addExercise: "Tambah Latihan",
          noLog: "Tidak ada latihan tercatat untuk hari ini.",
          days: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
        },
        history: {
          noHistory: "Riwayat latihan Anda kosong.",
          reps: "rep",
          sets: "set"
        }
      },
      manageTimers: {
        title: "Template Timer",
        editTemplateTitle: "Edit Template",
        createNew: "Buat Template Baru",
        noTemplates: "Belum ada template dibuat. Ketuk 'Buat Baru' untuk memulai!",
        templateName: "Nama Template",
        newTemplateName: "Timer Latihan Baru",
        segments: "Segmen",
        segmentNamePlaceholder: "Nama Segmen",
        newSegmentName: "Segmen Baru",
        duration: "Durasi",
        addSegment: "Tambah Segmen",
        saveTemplate: "Simpan Template",
        linkPlan: "Tautkan Program Latihan (Opsional)",
        linkPlanOptional: "Tidak ada - Timer Manual",
        linkPlanDescription: "Menautkan program akan mengisi segmen secara otomatis dan menambah pemanasan/pendinginan.",
        duplicate: "Duplikat Template",
        totalDuration: "Total Durasi",
        restBetweenSegments: "Istirahat Antar Segmen",
        enableRest: "Aktifkan",
        restDuration: "Durasi Istirahat (d)",
        segmentDuration: "Durasi Segmen",
        autoWarmup: "Pemanasan",
        autoCooldown: "Pendinginan",
        deleteConfirmMessage: "Anda yakin ingin menghapus template timer '{{name}}'?",
        summary: {
          title: "Ringkasan Template",
          warmup: "Pemanasan",
          work: "Latihan",
          rest: "Istirahat",
          cooldown: "Pendinginan",
        },
         segment: {
            type: "Tipe",
            types: {
                warmup: "Pemanasan",
                work: "Latihan",
                rest: "Istirahat",
                cooldown: "Pendinginan"
            },
            exercise: "Latihan",
            noExercise: "Tanpa latihan spesifik",
            sets: "Set",
            workDuration: "Latihan",
            restDuration: "Istirahat",
            interval: "Interval"
        }
      },
       managePlans: {
        addPlan: "Buat Program Baru",
        editPlan: "Edit Program",
        planName: "Nama Program",
        planNamePlaceholder: "cth., Push Day",
        selectExercises: "Pilih Latihan",
        noExercises: "Tidak ada latihan di pustaka. Tambahkan dulu!",
        noExercisesInPlan: "Belum ada latihan dalam program ini.",
        noPlans: "Belum ada program latihan yang dibuat.",
        duplicate: "Duplikat Program",
        deleteConfirmMessage: "Anda yakin ingin menghapus program '{{name}}'?"
      },
      musicPlayer: {
        title: "Pemutar Musik",
        platforms: "Platform yang Didukung",
        addToPlaylist: "Tambah ke Playlist",
        placeholder: "Tempel URL Spotify atau YouTube Music",
        single: "Lagu Tunggal",
        playlist: "Playlist",
        note: "Catatan: Fitur ini membuka aplikasi resmi. Musik tidak diputar langsung di dalam aplikasi ini.",
        singles: "Lagu",
        playlists: "Playlist",
        nowPlaying: "Buka Pemutar Musik",
        invalidUrlWarning: "Harap masukkan URL Spotify atau YouTube Music yang valid.",
        emptyList: "Daftar ini kosong.",
        spotifyLink: "Link Spotify",
        ytMusicLink: "Link YouTube Music",
        unknownLink: "Link Musik"
      },
      bodyTracker: {
        title: "Pelacak Tubuh",
        addMeasurement: "Tambah Pengukuran Baru",
        weight: "Berat (kg)",
        height: "Tinggi (cm)",
        bodyFat: "Lemak Tubuh (%) (Opsional)",
        bmi: "Indeks Massa Tubuh",
        latest: "Terbaru",
        history: "Riwayat Pengukuran",
        noHistory: "Belum ada pengukuran yang dicatat.",
      },
      postWorkout: {
        title: "Latihan Selesai!",
        subtitle: "Tinjau dan simpan catatan latihan Anda.",
        saveLog: "Simpan ke Jurnal",
        discard: "Buang"
      },
      setTimerModal: {
        title: "Timer Set",
        close: "Tutup"
      },
      settings: {
        title: "Setelan",
        general: {
            title: "Umum"
        },
        features: {
            title: "Fitur"
        },
        theme: {
            title: "Tampilan",
            AriTheme: "Ari",
        },
         language: {
          title: "Bahasa",
        },
        reset: {
          title: "Setel Ulang Pengaturan",
          button: "Setel Ulang",
          confirmTitle: "Setel ulang semua pengaturan?",
          confirmMessage: "Anda yakin ingin mengembalikan semua pengaturan ke nilai default? Tindakan ini tidak dapat dibatalkan."
        },
        notifications: {
            title: "Pengingat Latihan",
            status: "Status",
            enable: "Aktifkan",
        },
        offline: {
            title: "Mode Luring",
            description: "Aplikasi ini dirancang untuk bekerja secara luring. Semua data Anda disimpan di perangkat Anda, dan tidak diperlukan koneksi internet untuk menggunakan fitur apa pun."
        },
        volume: {
            title: "Volume Utama",
        },
        sounds: {
          title: "Pengaturan Suara Kustom",
          frequency: "Frekuensi (Hz)",
          duration: "Durasi (d)",
          waveform: "Bentuk Gelombang",
          test: "Tes",
          types: {
            timerEnd: "Timer Selesai",
            segmentEnd: "Segmen Selesai",
            interval: "Detak Interval",
            menuClick: "Klik Menu",
            splashOpen: "Animasi Pembuka"
          },
          waveforms: {
            sine: "Sinus",
            square: "Kotak",
            sawtooth: "Gergaji",
            triangle: "Segitiga"
          }
        },
        data: {
          title: "Manajemen Data",
          description: "Simpan data Anda ke file atau muat di perangkat lain.",
          howToDetails: "<strong>Ekspor:</strong> Membuat file cadangan dari semua data kustom Anda (latihan, program, catatan, timer, setelan). Simpan file ini di lokasi yang aman.<br/><br/><strong>Impor:</strong> Mengembalikan data Anda dari file cadangan. <strong>Peringatan:</strong> Ini akan menimpa semua data yang ada di aplikasi. Gunakan ini untuk memindahkan data Anda ke perangkat baru atau memulihkannya.",
          export: "Ekspor Data",
          importFile: "Impor dari File",
          importFromLink: "Impor dari Tautan",
          importWarning: "Ini akan menimpa semua data Anda saat ini. Apakah Anda yakin ingin melanjutkan?",
          importSuccess: "Data berhasil diimpor!",
          importError: "Format file tidak valid. Silakan pilih file cadangan yang valid.",
        },
        version: "Versi"
      },
      notification: {
        title: "Waktunya Latihan!",
        body: "Saatnya untuk sesi {{workout}} terjadwal Anda.",
      },
      importModal: {
        title: "Impor Item",
        confirmation: "Anda menerima {{type}} bersama bernama '{{name}}'. Ingin menambahkannya ke pustaka Anda?",
        addButton: "Tambahkan",
        success: "Item berhasil ditambahkan!",
        error: "Gagal mengimpor item. Tautan mungkin tidak valid atau rusak.",
        errorInvalidFormat: "Format tautan berbagi tidak valid. Silakan periksa tautan dan coba lagi.",
        errorUnsupportedType: "Tipe item yang dibagikan tidak didukung oleh versi aplikasi ini.",
        errorMissingName: "Item yang dibagikan tampaknya rusak (nama tidak ditemukan)."
      },
      importLinkModal: {
        title: "Impor dari Tautan",
        placeholder: "Tempel tautan yang dibagikan di sini",
        importButton: "Impor",
      },
      importDataModal: {
        title: "Impor Data",
        confirmTitle: "Konfirmasi Impor",
        confirmMessage: "Tindakan ini akan menimpa semua data aplikasi saat ini dan tidak dapat dibatalkan. Apakah Anda yakin?",
        confirmButton: "Ya, Timpa",
        loading: "Mengimpor data...",
        successTitle: "Impor Berhasil",
        successMessage: "Data Anda telah dipulihkan.",
        errorTitle: "Impor Gagal",
        doneButton: "Selesai",
        closeButton: "Tutup"
      },
      confirmModal: {
        defaultTitle: "Anda yakin?",
        confirmButton: "Konfirmasi",
        cancelButton: "Batal"
      },
      common: {
        save: "Simpan",
        cancel: "Batal",
        add: "Tambah",
        edit: "Edit",
        delete: "Hapus",
        optional: "Opsional",
        share: "Bagikan",
        shareLinkCopied: "Tautan berhasil disalin!"
      }
    }
  }
};

i18next.init({
  resources: translations,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// --- Data Compression Utilities for Sharing ---

const planKeys = { name: 'n', workoutIds: 'w' };
const templateKeys = { name: 'n', segments: 's', restBetweenSegments: 'r' };
const segmentKeys = { name: 'n', type: 't', duration: 'd', interval: 'i', workoutId: 'w', sets: 's', workDuration: 'wd', restDuration: 'rd' };

const reverseMap = (map) => Object.entries(map).reduce((acc, [key, val]) => ({ ...acc, [val]: key }), {});

const reversedPlanKeys = reverseMap(planKeys);
const reversedTemplateKeys = reverseMap(templateKeys);
const reversedSegmentKeys = reverseMap(segmentKeys);

const transformObject = (obj, keyMap) => {
    if (!obj) return obj;
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = keyMap[key];
        if (newKey) {
            acc[newKey] = value;
        } else {
            // Keep keys that are not in the map (like 'enabled' in restBetweenSegments)
            acc[key] = value;
        }
        return acc;
    }, {});
};

export const compressTemplate = (template) => {
    const compressed = transformObject(template, templateKeys);
    if (compressed.s) {
        compressed.s = compressed.s.map((seg) => transformObject(seg, segmentKeys));
    }
    return compressed;
};

export const decompressTemplate = (compressed) => {
    const decompressed = transformObject(compressed, reversedTemplateKeys);
    if (decompressed.segments) {
        decompressed.segments = decompressed.segments.map((seg) => transformObject(seg, reversedSegmentKeys));
    }
    return decompressed;
};

export const compressPlan = (plan) => {
    return transformObject(plan, planKeys);
};

export const decompressPlan = (plan) => {
    return transformObject(plan, reversedPlanKeys);
};


export default i18next;
