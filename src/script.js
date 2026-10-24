/**
 * ==============================================================================
 * SCRIPT.JS - LOGIKA MODULAR LENGKAP WEBSITE PESANTREN DARUL ABRAR
 * ==============================================================================
 * Vanilla JavaScript murni (ES6+) yang modular, rapi, dan terdokumentasi.
 * Menangani seluruh interaksi:
 * 1. Mobile Navigation & Hamburger Toggle
 * 2. Section Fasilitas (Grid 3x2 & Modal Interaktif)
 * 3. Section Galeri Aktivitas Santri (Viewer 1:1 & Grid Windowing)
 * 4. Section Prestasi Santri (Kartu Utama ~42% + 3 Kartu Samping ~58% Rasio 2/3)
 * 5. Section Berita Terbaru (2/3 Kiri Berita Utama, 1/3 Kanan 3 Berita, Looping 1-7)
 * 6. Section PPDB (Jadwal Gelombang, Syarat, Alur, & Modal Quick Register)
 * 7. Section Testimoni (Auto-Scroll Halus Tanpa Henti + Hover Pause/Resume)
 * ==============================================================================
 */

// ============================================================================
// HELPER: UNIVERSAL DATA FETCHER (Fallback Bertingkat & Embedded Array)
// ============================================================================
async function fetchPesantrenData(fileName, fallbackEmbeddedData) {
  const urls = [
    `./data/${fileName}`,
    `./data/${fileName}`,
    `./src/data/${fileName}`,
    `./src/data/${fileName}`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0) {
          return data;
        }
      }
    } catch {
      // Lanjutkan ke URL berikutnya
    }
  }

  console.warn(`[Pesantren Data] Menggunakan embedded fallback untuk ${fileName}`);
  return fallbackEmbeddedData;
}

// ============================================================================
// 1. MOBILE NAVIGATION & HAMBURGER TOGGLE
// ============================================================================
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isExpanded));

    mobileMenu.classList.toggle('hidden');
    hamburgerIcon?.classList.toggle('hidden');
    closeIcon?.classList.toggle('hidden');
  });

  const navLinks = document.querySelectorAll('.mobile-nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      hamburgerIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================================
// 2. SECTION FASILITAS PESANTREN (GRID 3x2 & MODAL DETAIL)
// ============================================================================
let dataFasilitasPesantren = [];

const FALLBACK_FASILITAS = [
  {
    id: 1,
    judul: "Masjid Agung Al-Abrar",
    kategori: "Ibadah & Spiritual",
    deskripsi_singkat: "Pusat peribadahan dan halaqah Al-Qur'an berkapasitas 2.500 jamaah dengan arsitektur Timur Tengah modern berhawa sejuk.",
    deskripsi_lengkap: "Masjid Agung Al-Abrar merupakan jantung spiritual pesantren. Dilengkapi karpet tebal berkualitas tinggi, sistem tata suara akustik mutakhir, pendingin ruangan sentral ramah lingkungan, serta mezzanine khusus santriwati. Setiap hari menjadi tempat shalat berjamaah 5 waktu, qiyamul lail terpadu, dan kajian kitab kuning ba'da Shubuh & Maghrib.",
    gambar_url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1200&auto=format&fit=crop",
    spesifikasi: [
      { label: "Kapasitas", nilai: "2.500 Jamaah" },
      { label: "Fasilitas Audio", nilai: "Line Array JBL & Akustik Terbina" },
      { label: "Area Santriwati", nilai: "Mezzanine Lantai 2 Khusus" },
      { label: "Operasional", nilai: "24 Jam Terbuka untuk Ibadah" }
    ],
    tag_highlight: "Pusat Spiritual"
  },
  {
    id: 2,
    judul: "Asrama Santri Terpadu & Higienis",
    kategori: "Hunian & Asrama",
    deskripsi_singkat: "Asrama bertingkat dengan sirkulasi udara optimal, ranjang kayu ergonomis, loker pribadi, dan pengawasan musyrif 24 jam.",
    deskripsi_lengkap: "Kompleks asrama santri putra dan putri dibangun terpisah dengan pagar pembatas asri dan sistem keamanan terpadu. Setiap kamar dihuni 6-8 santri didampingi seorang musyrif (pembina kamar) alumni Timur Tengah.",
    gambar_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop",
    spesifikasi: [
      { label: "Kapasitas Total", nilai: "1.200 Santri (Putra & Putri Terpisah)" },
      { label: "Pembina Kamar", nilai: "1 Musyrif per Kamar (24 Jam)" },
      { label: "Sirkulasi Udara", nilai: "Cross-Ventilation Alami" },
      { label: "Air Bersih", nilai: "Sumur Artesis Bor Terfiltrasi" }
    ],
    tag_highlight: "Kenyamanan Santri"
  },
  {
    id: 3,
    judul: "Perpustakaan & Maktabah Digital",
    kategori: "Literasi & Riset",
    deskripsi_singkat: "Koleksi lebih dari 15.000 judul kitab kuning klasik, literatur Islam kontemporer, ensiklopedia umum, dan akses e-library internasional.",
    deskripsi_lengkap: "Maktabah Darul Abrar memadukan khazanah keilmuan Islam turats dengan kemudahan teknologi informasi. Tersedia ruang baca nyaman beralaskan karpet lembut, bilik riset ber-AC, serta katalog komputer terintegrasi.",
    gambar_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
    spesifikasi: [
      { label: "Jumlah Koleksi", nilai: "15.000+ Eksemplar Kitab & Buku" },
      { label: "Sistem Katalog", nilai: "OPAC Digital & E-Reader Tablet" },
      { label: "Ruang Riset", nilai: "Full AC, Beralaskan Karpet Permadani" },
      { label: "Akses Jurnal", nilai: "Langganan Jurnal Kajian Islam Global" }
    ],
    tag_highlight: "Khazanah Ilmu"
  },
  {
    id: 4,
    judul: "Laboratorium Komputer & Bahasa Digital",
    kategori: "Teknologi & Bahasa",
    deskripsi_singkat: "Laboratorium multimedia 60 unit PC berkecepatan tinggi untuk pembelajaran coding, desain grafis, dan tes TOEFL/TOAFL.",
    deskripsi_lengkap: "Pusat pengembangan literasi digital santri. Dilengkapi perangkat komputer modern, headset isolasi suara untuk kursus audio bahasa Arab (Nathiqiyyah) dan bahasa Inggris, serta software coding Python & Web Development.",
    gambar_url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
    spesifikasi: [
      { label: "Jumlah Unit", nilai: "60 Unit PC Workstation Core i7" },
      { label: "Konektivitas", nilai: "Dedicated Fiber Optic 200 Mbps" },
      { label: "Fasilitas Audio", nilai: "Noise-Cancelling Headset Lab Bahasa" },
      { label: "Software Lab", nilai: "Lisensi Microsoft, Adobe & Python Dev" }
    ],
    tag_highlight: "Era Digital"
  },
  {
    id: 5,
    judul: "Laboratorium Sains Terpadu (IPA)",
    kategori: "Sains & Inovasi",
    deskripsi_singkat: "Fasilitas praktikum Fisika, Kimia, dan Biologi lengkap dengan mikroskop binokuler digital serta peralatan uji coba sains modern.",
    deskripsi_lengkap: "Sarana eksplorasi ilmu alam yang mengantarkan santri meraih berbagai medali Olimpiade Sains Nasional (OSN). Memiliki alat peraga anatomi lengkap, lemari asam kimia, teleskop astronomi pengamatan hilal.",
    gambar_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
    spesifikasi: [
      { label: "Kapasitas Sesi", nilai: "40 Santri per Kelompok Praktikum" },
      { label: "Instrumen Khusus", nilai: "Teleskop Falakiyah & Mikroskop Digital" },
      { label: "Standar Keamanan", nilai: "Safety Shower, Eye-Washer & Lemari Asam" },
      { label: "Output Prestasi", nilai: "Pusat Pembinaan Juara KSM & OSN" }
    ],
    tag_highlight: "Riset & Sains"
  },
  {
    id: 6,
    judul: "Klinik Santri & Poskestren 24 Jam",
    kategori: "Kesehatan & Medis",
    deskripsi_singkat: "Layanan kesehatan siaga 24 jam dengan dokter visit, perawat berlisensi, ruang rawat inap sementara, dan armada ambulans darurat.",
    deskripsi_lengkap: "Pos Kesehatan Pesantren (Poskestren) Darul Abrar bekerja sama dengan Rumah Sakit Islam rujukan kota. Menyediakan pemeriksaan berkala kesehatan & gizi santri, persediaan obat-obatan esensial, nebulizer untuk asma, serta ambulans siaga 24 jam.",
    gambar_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
    spesifikasi: [
      { label: "Layanan Medis", nilai: "24 Jam Non-stop (Dokter & Perawat Jaga)" },
      { label: "Ruang Rawat", nilai: "8 Bed Observasi Ber-AC (Putra & Putri)" },
      { label: "Tanggap Darurat", nilai: "Ambulans Siaga Pesantren Standar Medis" },
      { label: "Program Preventif", nilai: "Pemeriksaan Kesehatan Berkala" }
    ],
    tag_highlight: "Siaga Medis"
  }
];

function renderFasilitasGrid(data) {
  const container = document.getElementById('fasilitas-grid-container');
  if (!container) return;

  container.innerHTML = data.map((item, idx) => `
    <article 
      class="group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#0072CE]/60 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col overflow-hidden cursor-pointer h-full"
      onclick="bukaModalFasilitas(${item.id})"
      data-fasilitas-id="${item.id}"
      tabindex="0"
      role="button"
      aria-label="Lihat detail fasilitas: ${item.judul}"
    >
      <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 shrink-0">
        <img 
          src="${item.gambar_url}" 
          alt="${item.judul}"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10"></div>
        
        <div class="absolute top-3.5 left-3.5 z-10">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#0072CE] shadow-sm uppercase tracking-wider">
            <span class="w-1.5 h-1.5 rounded-full bg-[#DAA520]"></span>
            ${item.kategori}
          </span>
        </div>

        <div class="absolute top-3.5 right-3.5 z-10">
          <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-[#DAA520] text-slate-900 text-[10px] font-extrabold shadow-xs">
            ${item.tag_highlight || 'Unggulan'}
          </span>
        </div>

        <div class="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 text-[#0072CE] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-md">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

      <div class="p-5 sm:p-6 flex flex-col justify-between flex-grow">
        <div>
          <h3 class="text-lg sm:text-xl font-bold text-[#1E293B] group-hover:text-[#0072CE] transition-colors leading-snug line-clamp-2 mb-2">
            ${item.judul}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
            ${item.deskripsi_singkat}
          </p>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0072CE]">
          <span class="inline-flex items-center gap-1 group-hover:underline">
            Lihat Spesifikasi & Detail
          </span>
          <span class="text-slate-400 font-mono text-[11px]">#0${idx + 1}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function bukaModalFasilitas(id) {
  const item = dataFasilitasPesantren.find(f => f.id === id) || FALLBACK_FASILITAS.find(f => f.id === id);
  if (!item) return;

  const modal = document.getElementById('fasilitas-modal');
  const img = document.getElementById('fasilitas-modal-img');
  const kategori = document.getElementById('fasilitas-modal-kategori');
  const title = document.getElementById('fasilitas-modal-title');
  const desc = document.getElementById('fasilitas-modal-desc');
  const specsContainer = document.getElementById('fasilitas-modal-specs');

  if (img) { img.src = item.gambar_url; img.alt = item.judul; }
  if (kategori) kategori.textContent = item.kategori;
  if (title) title.textContent = item.judul;
  if (desc) desc.textContent = item.deskripsi_lengkap || item.deskripsi_singkat;

  if (specsContainer && item.spesifikasi) {
    specsContainer.innerHTML = item.spesifikasi.map(sp => `
      <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col">
        <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">${sp.label}</span>
        <span class="text-xs sm:text-sm font-semibold text-[#1E293B] mt-0.5">${sp.nilai}</span>
      </div>
    `).join('');
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }
}

function tutupModalFasilitas() {
  const modal = document.getElementById('fasilitas-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
}

function initFasilitasModalEvents() {
  document.getElementById('fasilitas-modal-close-btn')?.addEventListener('click', tutupModalFasilitas);
  document.getElementById('fasilitas-modal-btn-close')?.addEventListener('click', tutupModalFasilitas);
  document.getElementById('fasilitas-modal-backdrop')?.addEventListener('click', tutupModalFasilitas);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      tutupModalFasilitas();
      tutupModalBerita();
    }
  });
}

window.bukaModalFasilitas = bukaModalFasilitas;
window.tutupModalFasilitas = tutupModalFasilitas;

// ============================================================================
// 3. SECTION GALERI AKTIVITAS SANTRI (WINDOWING 1:1)
// ============================================================================
let dataKegiatanPesantren = [];
let activeKegiatanId = 1;

const FALLBACK_KEGIATAN = [
  {
    id: 1,
    title: "Tapak Suci Putera Muhammadiyah",
    subtitle: "Seni Bela Diri Santri",
    category: "Bela Diri",
    desc: "Membina ketangkasan fisik, seni bela diri pencak silat khas pesantren, dan pembentukan akhlakul karimah serta mental tangguh santri yang disiplin.",
    img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200&auto=format&fit=crop",
    schedule: "Senin & Kamis (16.00 - 17.30)",
    instructor: "Ustadz Hamdan & Pendekar Satria"
  },
  {
    id: 2,
    title: "Gerakan Pramuka Santri",
    subtitle: "Kepanduan & Kemandirian",
    category: "Kepanduan",
    desc: "Mengasah kecakapan hidup (life skills), teknik tali-temali, pionering menara pandang, penjelajahan alam bebas, dan kepemimpinan berwawasan kebangsaan.",
    img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
    schedule: "Jumat Sore (14.30 - 17.00)",
    instructor: "Kak Syarif & Pembina Gudep"
  },
  {
    id: 3,
    title: "Seni Kaligrafi Islam (Khat)",
    subtitle: "Seni Estetika Al-Qur'an",
    category: "Seni Kaligrafi",
    desc: "Pelatihan seni tulis indah ayat suci Al-Qur'an dengan pena bambu tradisional (handam) dan tinta zafaran (Khat Naskhi, Tsuluts, Riq'ah), melatih rasa seni dan keheningan hati.",
    img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
    schedule: "Rabu Malam (20.00 - 21.30)",
    instructor: "Ustadz Khatib Al-Banjari"
  },
  {
    id: 4,
    title: "Futsal & Liga Santri",
    subtitle: "Kebugaran & Ukhuwah Santri",
    category: "Olahraga",
    desc: "Mengembangkan bakat olahraga bola santri melalui latihan teknik dasar, stamina, taktik permainan tim, serta turnamen persahabatan antar asrama.",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    schedule: "Selasa & Sabtu (16.00 - 17.30)",
    instructor: "Coach Faisal (Dept. Olahraga)"
  },
  {
    id: 5,
    title: "Multimedia & Studio Dakwah",
    subtitle: "Studio Kreatif Dakwah Digital",
    category: "Teknologi",
    desc: "Membekali santri keterampilan era digital dalam produksi podcast islami, sinematografi video dakwah, dokumentasi fotografi, dan desain publikasi kreatif.",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
    schedule: "Ahad Pagi (08.30 - 11.30)",
    instructor: "Ustadz Rian & Tim Media"
  },
  {
    id: 6,
    title: "Muhadharah (Public Speaking)",
    subtitle: "Latihan Khutbah & Retorika",
    category: "Public Speaking",
    desc: "Latihan orasi dakwah, khutbah Jumat, kultum, dan pidato dalam 3 bahasa (Arab, Inggris, Indonesia) guna mencetak dai yang fasih dan berwibawa.",
    img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    schedule: "Kamis Malam (20.00 - 22.00)",
    instructor: "Ustadz Dr. Burhanuddin, M.A."
  },
  {
    id: 7,
    title: "Bahasa Arab (Muhadatsah)",
    subtitle: "Bi'ah Lughawiyyah & Nahwu",
    category: "Kebahasaan",
    desc: "Menghidupkan lingkungan bi'ah lughawiyyah santri lewat percakapan bahasa Arab fusha sehari-hari, debat gramatika nahwu sharaf, dan kajian kutub.",
    img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop",
    schedule: "Ba'da Shubuh & Ashar",
    instructor: "Syaikh Musthafa & Ustadz Farhan"
  },
  {
    id: 8,
    title: "English Club & Debate Forum",
    subtitle: "Daily Fluency & English Debate",
    category: "Kebahasaan",
    desc: "Mengasah kecakapan bahasa Inggris internasional santri melalui english debate forum, storytelling, spelling bee, serta bimbingan persiapan beasiswa ke luar negeri.",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    schedule: "Ba'da Maghrib & Ahad Siang",
    instructor: "Ustadzah Nadia & Tim BEC"
  }
];

function calculateSideKegiatan(activeId) {
  const total = dataKegiatanPesantren.length;
  const activeIndex = dataKegiatanPesantren.findIndex(item => item.id === activeId);
  const sideCards = [];
  for (let offset = 1; offset <= 4; offset++) {
    const nextIndex = (activeIndex + offset) % total;
    sideCards.push(dataKegiatanPesantren[nextIndex]);
  }
  return sideCards;
}

function renderKegiatanUtama(activity) {
  const container = document.getElementById('main-card-container');
  const img = document.getElementById('main-card-img');
  const badge = document.getElementById('main-card-badge');
  const category = document.getElementById('main-card-category');
  const subtitle = document.getElementById('main-card-subtitle');
  const title = document.getElementById('main-card-title');
  const desc = document.getElementById('main-card-desc');
  const schedule = document.getElementById('main-card-schedule');
  const instructor = document.getElementById('main-card-instructor');

  if (!container || !activity) return;

  container.classList.remove('fade-in-card');
  void container.offsetWidth;
  container.classList.add('fade-in-card');

  if (img) { img.src = activity.img; img.alt = activity.title; }
  if (badge) badge.textContent = activity.id;
  if (category) category.textContent = activity.category;
  if (subtitle) subtitle.textContent = activity.subtitle;
  if (title) title.textContent = activity.title;
  if (desc) desc.textContent = activity.desc;
  if (schedule) schedule.textContent = activity.schedule;
  if (instructor) instructor.textContent = activity.instructor;
}

function renderKegiatanSideCards(cards) {
  const grid = document.getElementById('side-cards-grid');
  if (!grid) return;
  grid.innerHTML = '';

  cards.forEach((cardData, idx) => {
    const cardBtn = document.createElement('button');
    cardBtn.type = 'button';
    cardBtn.className = `
      group relative w-full h-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden text-left 
      bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 transform 
      hover:-translate-y-1 hover:ring-3 hover:ring-[#0072CE] focus:outline-none focus:ring-3 focus:ring-[#0072CE]
      fade-in-card cursor-pointer
    `;
    cardBtn.style.animationDelay = `${idx * 40}ms`;
    cardBtn.setAttribute('aria-label', `Pilih kegiatan ${cardData.title} (Nomor ${cardData.id})`);

    cardBtn.addEventListener('click', () => {
      setKegiatanAktif(cardData.id);
    });

    cardBtn.innerHTML = `
      <img 
        src="${cardData.img}" 
        alt="${cardData.title}" 
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15 group-hover:from-black/90 transition-colors"></div>

      <div class="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
        <span class="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#0072CE] text-white font-black text-xs shadow-md ring-2 ring-white/30">
          ${cardData.id}
        </span>
      </div>

      <div class="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-10 pointer-events-none">
        <span class="text-[9px] sm:text-[10px] font-semibold text-[#DAA520] block uppercase tracking-wider line-clamp-1">
          ${cardData.category}
        </span>
        <h4 class="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-md line-clamp-2 mt-0.5 group-hover:text-[#DAA520] transition-colors">
          ${cardData.title}
        </h4>
      </div>
    `;

    grid.appendChild(cardBtn);
  });

  const statusBadge = document.getElementById('window-status-badge');
  if (statusBadge) {
    const sideIds = cards.map(c => c.id).join(', ');
    statusBadge.textContent = `Card Utama: #${activeKegiatanId} | Kanan: [${sideIds}]`;
  }
}

function renderKegiatanDots() {
  const container = document.getElementById('dots-container');
  if (!container) return;
  container.innerHTML = '';

  dataKegiatanPesantren.forEach((act) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `
      h-2.5 rounded-full transition-all duration-300 cursor-pointer
      ${act.id === activeKegiatanId ? 'w-7 bg-[#0072CE]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}
    `;
    dot.title = `Pilih #${act.id}: ${act.title}`;
    dot.setAttribute('aria-label', `Pilih kegiatan ${act.title}`);
    dot.addEventListener('click', () => setKegiatanAktif(act.id));
    container.appendChild(dot);
  });
}

function setKegiatanAktif(id) {
  activeKegiatanId = id;
  const item = dataKegiatanPesantren.find(i => i.id === id);
  if (!item) return;

  renderKegiatanUtama(item);
  renderKegiatanSideCards(calculateSideKegiatan(id));
  renderKegiatanDots();
}

function initKegiatanControls() {
  document.getElementById('prev-btn')?.addEventListener('click', () => {
    const currentIdx = dataKegiatanPesantren.findIndex(i => i.id === activeKegiatanId);
    const prevIdx = (currentIdx - 1 + dataKegiatanPesantren.length) % dataKegiatanPesantren.length;
    setKegiatanAktif(dataKegiatanPesantren[prevIdx].id);
  });

  document.getElementById('next-btn')?.addEventListener('click', () => {
    const currentIdx = dataKegiatanPesantren.findIndex(i => i.id === activeKegiatanId);
    const nextIdx = (currentIdx + 1) % dataKegiatanPesantren.length;
    setKegiatanAktif(dataKegiatanPesantren[nextIdx].id);
  });
}

// ============================================================================
// 4. SECTION PRESTASI SANTRI (MAIN CARD 42% + 3 THUMBNAILS 58% TINGGI 2/3)
// ============================================================================
let dataPrestasiPesantren = [];
let currentPrestasiIndex = 0;
let isPrestasiTransitioning = false;
let prestasiAutoplayTimer = null;
const PRESTASI_AUTOPLAY_MS = 6000;

const FALLBACK_PRESTASI = [
  {
    id: 1,
    judul: "Juara 1 Musabaqah Hifdzil Qur'an 30 Juz Tingkat Internasional",
    kategori: "Tahfidz & Keagamaan",
    deskripsi_singkat: "Santri Muhammad Raihan Al-Fatih meraih predikat Mumtaz dan Juara 1 pada ajang International Holy Quran Competition di Istanbul, mengharumkan nama pesantren di hadapan 45 negara peserta.",
    gambar_url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
    link_detail: "#prestasi-section"
  },
  {
    id: 2,
    judul: "Medali Emas Olimpiade Sains Nasional (OSN) Bidang Astronomi & Astrofisika",
    kategori: "Sains & Teknologi",
    deskripsi_singkat: "Mengintegrasikan ilmu hisab falakiyah klasik dengan astrofisika modern, santri Darul Abrar menduduki peringkat pertama nasional.",
    gambar_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
    link_detail: "#prestasi-section"
  },
  {
    id: 3,
    judul: "Juara Umum Musabaqah Qira'atil Kutub (MQK) Tingkat Nasional",
    kategori: "Kutubut Turats",
    deskripsi_singkat: "Menguasai pembacaan dan pembedahan kitab kuning Fathul Qarib, Ihya Ulumiddin, dan Alfiyah Ibnu Malik dengan pemahaman komprehensif.",
    gambar_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    link_detail: "#prestasi-section"
  },
  {
    id: 4,
    judul: "Juara 1 Lomba Debat Bahasa Arab (Munadharah Lughawiyyah) Antar Kampus",
    kategori: "Kebahasaan",
    deskripsi_singkat: "Menunjukkan kefasihan retorika fusha dan argumentasi filosofis syariat pada kompetisi debat bergengsi se-Asia Tenggara.",
    gambar_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    link_detail: "#prestasi-section"
  },
  {
    id: 5,
    judul: "Juara 1 Kaligrafi Seni Mushaf Al-Qur'an Tingkat Provinsi",
    kategori: "Seni Kaligrafi",
    deskripsi_singkat: "Karya iluminasi mushaf santri dengan teknik zafaran dan tinta handam meraih penghargaan karya seni estetika terbaik dewan juri.",
    gambar_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    link_detail: "#prestasi-section"
  },
  {
    id: 6,
    judul: "Juara 1 Kejuaraan Nasional Pencak Silat Tapak Suci Piala Menpora",
    kategori: "Bela Diri",
    deskripsi_singkat: "Pendekar santri menyapu bersih 3 medali emas kategori tanding kelas tanding remaja dan seni tunggal bersenjata.",
    gambar_url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80",
    link_detail: "#prestasi-section"
  },
  {
    id: 7,
    judul: "Penghargaan Pesantren Ramah Lingkungan & Eco-Pesantren Award",
    kategori: "Inovasi Lingkungan",
    deskripsi_singkat: "Pengelolaan air wudhu daur ulang, instalasi panel surya mandiri, dan bank sampah organik santri diapresiasi Kementerian Agama.",
    gambar_url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
    link_detail: "#prestasi-section"
  }
];

function getNextThreePrestasiQueue(activeIdx) {
  const total = dataPrestasiPesantren.length;
  const queue = [];
  if (total === 0) return queue;

  const maxQueue = Math.min(3, total - 1);
  for (let offset = 1; offset <= (maxQueue > 0 ? maxQueue : 1); offset++) {
    const queueIdx = ((activeIdx + offset) % total + total) % total;
    queue.push({
      item: dataPrestasiPesantren[queueIdx],
      originalIndex: queueIdx,
      queuePosition: offset
    });
  }
  return queue;
}

function renderPrestasiMainCard(data) {
  const card = document.getElementById("prestasi-main-card");
  const img = document.getElementById("prestasi-main-img");
  const kategori = document.getElementById("prestasi-main-kategori");
  const judul = document.getElementById("prestasi-main-judul");
  const deskripsi = document.getElementById("prestasi-main-deskripsi");
  const link = document.getElementById("prestasi-main-link");

  if (!card || !data) return;

  card.classList.add("opacity-40", "scale-[0.99]");

  setTimeout(() => {
    if (img) { img.src = data.gambar_url; img.alt = data.judul; }
    if (kategori) kategori.textContent = data.kategori;
    if (judul) judul.textContent = data.judul;
    if (deskripsi) deskripsi.textContent = data.deskripsi_singkat;
    if (link) link.href = data.link_detail || "#prestasi-section";

    card.classList.remove("opacity-40", "scale-[0.99]");
  }, 160);
}

function renderPrestasiThumbnails(queueList) {
  const container = document.getElementById("prestasi-thumbnails-container");
  if (!container) return;

  container.innerHTML = queueList.map((queueItem) => {
    const { item, originalIndex, queuePosition } = queueItem;
    return `
      <article
        data-target-index="${originalIndex}"
        class="prestasi-thumb-card group relative flex flex-col justify-between min-w-[220px] sm:min-w-[230px] lg:min-w-0 h-[290px] lg:h-[340px] bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md hover:border-[#0072CE] hover:-translate-y-1.5 transition-all duration-300 ease-out select-none shrink-0 lg:shrink"
        tabindex="0"
        role="button"
        aria-label="Pilih antrean +${queuePosition}: ${item.judul}"
      >
        <div class="relative h-[150px] lg:h-[180px] w-full overflow-hidden bg-slate-100 shrink-0">
          <img
            src="${item.gambar_url}"
            alt="${item.judul}"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#1E293B]/80 backdrop-blur-xs text-[11px] font-semibold text-white tracking-wide border border-white/10">
            Antrean +${queuePosition}
          </div>
          <div class="absolute inset-0 bg-[#0072CE]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div class="p-3.5 flex flex-col justify-between flex-1">
          <div>
            <div class="text-[10px] font-bold text-[#0072CE] uppercase tracking-wider mb-1 line-clamp-1">
              ${item.kategori}
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-[#1E293B] group-hover:text-[#0072CE] line-clamp-2 leading-snug transition-colors">
              ${item.judul}
            </h4>
          </div>

          <div class="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
            <span class="group-hover:text-[#0072CE] transition-colors">Klik untuk tampil</span>
            <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#DAA520] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    `;
  }).join("");

  attachPrestasiThumbnailEvents();
}

function updatePrestasiIndicators() {
  const currentEl = document.getElementById("prestasi-current-number");
  const totalEl = document.getElementById("prestasi-total-number");

  if (currentEl) currentEl.textContent = String(currentPrestasiIndex + 1).padStart(2, "0");
  if (totalEl) totalEl.textContent = String(dataPrestasiPesantren.length).padStart(2, "0");
}

function updatePrestasiView() {
  if (!dataPrestasiPesantren || dataPrestasiPesantren.length === 0) return;
  renderPrestasiMainCard(dataPrestasiPesantren[currentPrestasiIndex]);
  renderPrestasiThumbnails(getNextThreePrestasiQueue(currentPrestasiIndex));
  updatePrestasiIndicators();
}

function navigateToPrestasi(targetIndex) {
  if (isPrestasiTransitioning || targetIndex === currentPrestasiIndex || dataPrestasiPesantren.length === 0) return;

  isPrestasiTransitioning = true;
  const total = dataPrestasiPesantren.length;
  currentPrestasiIndex = ((targetIndex % total) + total) % total;
  updatePrestasiView();

  setTimeout(() => {
    isPrestasiTransitioning = false;
  }, 300);
}

function goToNextPrestasi() {
  if (dataPrestasiPesantren.length > 0) navigateToPrestasi(currentPrestasiIndex + 1);
}

function goToPrevPrestasi() {
  if (dataPrestasiPesantren.length > 0) navigateToPrestasi(currentPrestasiIndex - 1);
}

function attachPrestasiThumbnailEvents() {
  const thumbCards = document.querySelectorAll(".prestasi-thumb-card");
  thumbCards.forEach((card) => {
    card.addEventListener("click", () => {
      const targetIdx = parseInt(card.getAttribute("data-target-index"), 10);
      if (!isNaN(targetIdx)) {
        navigateToPrestasi(targetIdx);
        resetPrestasiAutoplay();
      }
    });
  });
}

function startPrestasiAutoplay() {
  stopPrestasiAutoplay();
  if (dataPrestasiPesantren.length > 1) {
    prestasiAutoplayTimer = setInterval(goToNextPrestasi, PRESTASI_AUTOPLAY_MS);
  }
}

function stopPrestasiAutoplay() {
  if (prestasiAutoplayTimer) {
    clearInterval(prestasiAutoplayTimer);
    prestasiAutoplayTimer = null;
  }
}

function resetPrestasiAutoplay() {
  stopPrestasiAutoplay();
  startPrestasiAutoplay();
}

function initPrestasiShowcase() {
  updatePrestasiView();

  document.getElementById("prestasi-btn-prev")?.addEventListener("click", () => {
    goToPrevPrestasi();
    resetPrestasiAutoplay();
  });

  document.getElementById("prestasi-btn-next")?.addEventListener("click", () => {
    goToNextPrestasi();
    resetPrestasiAutoplay();
  });

  const showcaseSection = document.getElementById("prestasi-showcase-section");
  showcaseSection?.addEventListener("mouseenter", stopPrestasiAutoplay);
  showcaseSection?.addEventListener("mouseleave", startPrestasiAutoplay);

  startPrestasiAutoplay();
}

// ============================================================================
// 5. SECTION BERITA TERBARU (SISTEM LOOPING 1+3 BERURUTAN 1-7)
// ============================================================================
// let dataBeritaPesantren = [];
// let activeBeritaIndex = 0;
// let isBeritaTransitioning = false;

// const FALLBACK_BERITA = [
//   {
//     id: 1,
//     judul: "Wisuda Akbar Tahfidz 30 Juz & Pelepasan Santri Angkatan Ke-28 Berlangsung Khidmat",
//     kategori: "Tahfidz & Akademik",
//     tanggal: "18 Oktober 2026",
//     penulis: "Redaksi Darul Abrar",
//     ringkasan: "Sebanyak 145 santri resmi diwisuda dan menyelesaikan hafalan 30 Juz Al-Qur'an bersanad, disaksikan ribuan wali santri serta para ulama terkemuka.",
//     isi_lengkap: "Suasana haru dan penuh rasa syukur menyelimuti Gedung Pertemuan Utama Pesantren Pendidikan Islam Darul Abrar dalam gelaran Wisuda Akbar Tahfidz Al-Qur'an Angkatan Ke-28. Dari total wisudawan, 48 santri di antaranya berhasil menyelesaikan tasmi' 30 Juz sekali duduk dengan predikat Mumtaz Syaraf.",
//     gambar_url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop",
//     baca_menit: "4 menit membaca"
//   },
//   {
//     id: 2,
//     judul: "Santri Darul Abrar Sabet Juara 1 Olimpiade Sains Nasional (OSN) Bidang Astronomi",
//     kategori: "Prestasi Sains",
//     tanggal: "12 Oktober 2026",
//     penulis: "Biro Humas & Prestasi",
//     ringkasan: "Membuktikan perpaduan sains dan ilmu falak, santri kelas XI berhasil mengungguli ratusan delegasi sekolah umum tingkat nasional.",
//     isi_lengkap: "Ahmad Rayhan, santri Madrasah Aliyah Darul Abrar, sukses meraih medali emas pada ajang bergengsi Olimpiade Sains Nasional (OSN) bidang Astronomi dan Astrofisika.",
//     gambar_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200&auto=format&fit=crop",
//     baca_menit: "3 menit membaca"
//   },
//   {
//     id: 3,
//     judul: "Kunjungan Silaturahmi Guru Besar Universitas Al-Azhar Kairo Mesir ke Pesantren",
//     kategori: "Kerjasama Global",
//     tanggal: "05 Oktober 2026",
//     penulis: "Tim Kerjasama Luar Negeri",
//     ringkasan: "Pesantren menjalin kesepahaman beasiswa studi lanjut S1 dan penempatan dosen tamu penutur asli bahasa Arab langsung dari Kairo.",
//     isi_lengkap: "Pesantren menyambut hangat kedatangan Prof. Dr. Syaikh Usamah Al-Azhari beserta rombongan dari Universitas Al-Azhar Kairo. Kunjungan akademik ini membahas penguatan kurikulum bahasa Arab.",
//     gambar_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop",
//     baca_menit: "5 menit membaca"
//   },
//   {
//     id: 4,
//     judul: "Semarak Porseni & Musabaqah Tilawatil Qur'an Antar Santri Se-Provinsi Jawa Barat",
//     kategori: "Kegiatan Santri",
//     tanggal: "28 September 2026",
//     penulis: "Departemen Olahraga & Seni",
//     ringkasan: "Lebih dari 40 pondok pesantren berpartisipasi dalam ajang perlombaan tilawah, kaligrafi, pidato 3 bahasa, dan kejuaraan silat santri.",
//     isi_lengkap: "Gelaran akbar Porseni Santri tahun ini dipusatkan di kompleks kampus terpadu Darul Abrar. Ratusan santri unjuk kebolehan dalam kompetisi Musabaqah Qira'atil Kutub.",
//     gambar_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
//     baca_menit: "3 menit membaca"
//   },
//   {
//     id: 5,
//     judul: "Pelatihan Jurnalistik Islami & Penyiaran Podcast Dakwah Multimedia Santri",
//     kategori: "Literasi & Digital",
//     tanggal: "21 September 2026",
//     penulis: "Studio Media Pesantren",
//     ringkasan: "Santri dibekali keterampilan produksi konten digital positif, sinematografi, teknik penulisan berita, dan etika komunikasi Islam.",
//     isi_lengkap: "Menjawab tantangan revolusi digital, divisi media Darul Abrar menyelenggarakan workshop intensif penulisan jurnalistik dan podcast santri.",
//     gambar_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
//     baca_menit: "4 menit membaca"
//   },
//   {
//     id: 6,
//     judul: "Bakti Sosial & Santunan 500 Anak Yatim Piatu dalam Rangka Milad Ke-35 Pesantren",
//     kategori: "Sosial & Dakwah",
//     tanggal: "14 September 2026",
//     penulis: "Lembaga Amil Zakat & Wakaf",
//     ringkasan: "Wujud nyata kepedulian pesantren kepada masyarakat sekitar melalui penyaluran sembako, pengobatan gratis, dan paket pendidikan anak sholeh.",
//     isi_lengkap: "Dalam rangkaian tasyakuran Milad Pesantren ke-35, Darul Abrar menyalurkan bantuan kepada 500 anak yatim dan keluarga prasejahtera di 5 desa sekitar pondok.",
//     gambar_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
//     baca_menit: "4 menit membaca"
//   },
//   {
//     id: 7,
//     judul: "Pelepasan 32 Santri Penerima Beasiswa Penuh Kuliah ke Universitas di Turki & Maroko",
//     kategori: "Prestasi Alumni",
//     tanggal: "02 September 2026",
//     penulis: "Biro Hubungan Alumni",
//     ringkasan: "Alumni pesantren kembali membanggakan dengan lolos seleksi beasiswa Turkiye Burslari dan Kementerian Wakaf Kerajaan Maroko.",
//     isi_lengkap: "Pesantren kembali melepas 32 lulusan terbaik yang berhasil memenangkan beasiswa penuh jenjang sarjana di Universitas Istanbul dan Sakarya University.",
//     gambar_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
//     baca_menit: "3 menit membaca"
//   }
// ];

// function getNextThreeBerita(currentIdx) {
//   const total = dataBeritaPesantren.length;
//   const list = [];
//   for (let offset = 1; offset <= 3; offset++) {
//     const nextIdx = (currentIdx + offset) % total;
//     list.push({
//       item: dataBeritaPesantren[nextIdx],
//       targetIndex: nextIdx,
//       queueNumber: offset
//     });
//   }
//   return list;
// }

// function renderBeritaUtama(item) {
//   const mainCard = document.getElementById('berita-main-container');
//   const img = document.getElementById('berita-main-img');
//   const kategori = document.getElementById('berita-main-kategori');
//   const tanggal = document.getElementById('berita-main-tanggal');
//   const judul = document.getElementById('berita-main-judul');
//   const ringkasan = document.getElementById('berita-main-ringkasan');
//   const counterCurrent = document.getElementById('berita-counter-current');
//   const counterTotal = document.getElementById('berita-counter-total');

//   if (!mainCard || !item) return;

//   mainCard.classList.add('opacity-40', 'scale-[0.99]');

//   setTimeout(() => {
//     if (img) { img.src = item.gambar_url; img.alt = item.judul; }
//     if (kategori) kategori.textContent = item.kategori;
//     if (tanggal) tanggal.textContent = item.tanggal;
//     if (judul) judul.textContent = item.judul;
//     if (ringkasan) ringkasan.textContent = item.ringkasan;
//     if (counterCurrent) counterCurrent.textContent = String(activeBeritaIndex + 1).padStart(2, '0');
//     if (counterTotal) counterTotal.textContent = String(dataBeritaPesantren.length).padStart(2, '0');

//     mainCard.classList.remove('opacity-40', 'scale-[0.99]');
//   }, 150);
// }

// function renderBeritaSidebar(threeItems) {
//   const container = document.getElementById('berita-sidebar-list');
//   if (!container) return;

//   container.innerHTML = threeItems.map(({ item, targetIndex }) => `
//     <article 
//       class="berita-sidebar-item group flex gap-3.5 sm:gap-4 p-3 sm:p-3.5 bg-white rounded-2xl border border-slate-200/90 hover:border-[#0072CE] hover:shadow-md transition-all duration-300 cursor-pointer select-none"
//       onclick="pilihBeritaAktif(${targetIndex})"
//       data-target-index="${targetIndex}"
//       tabindex="0"
//       role="button"
//       aria-label="Tampilkan berita: ${item.judul}"
//     >
//       <div class="relative w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0">
//         <img 
//           src="${item.gambar_url}" 
//           alt="${item.judul}"
//           loading="lazy"
//           class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
//         />
//         <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
//         <span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-[#DAA520]">
//           #${item.id}
//         </span>
//       </div>

//       <div class="flex flex-col justify-between flex-grow">
//         <div>
//           <div class="flex items-center gap-2 mb-1 text-[10px] sm:text-xs">
//             <span class="font-bold text-[#0072CE] uppercase tracking-wider line-clamp-1">${item.kategori}</span>
//             <span class="text-slate-300">•</span>
//             <span class="text-slate-400 font-mono">${item.tanggal.split(' ')[0]} ${item.tanggal.split(' ')[1]}</span>
//           </div>
//           <h4 class="text-xs sm:text-sm font-bold text-[#1E293B] group-hover:text-[#0072CE] transition-colors leading-snug line-clamp-2">
//             ${item.judul}
//           </h4>
//         </div>

//         <div class="flex items-center justify-between text-[11px] font-medium text-slate-500 mt-2 pt-1 border-t border-slate-100">
//           <span class="group-hover:text-[#0072CE] transition-colors">Jadikan Utama</span>
//           <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#DAA520] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
//           </svg>
//         </div>
//       </div>
//     </article>
//   `).join('');
// }

// function pilihBeritaAktif(index) {
//   if (isBeritaTransitioning) return;
//   const total = dataBeritaPesantren.length;
//   if (total === 0) return;

//   isBeritaTransitioning = true;
//   activeBeritaIndex = ((index % total) + total) % total;

//   renderBeritaUtama(dataBeritaPesantren[activeBeritaIndex]);
//   renderBeritaSidebar(getNextThreeBerita(activeBeritaIndex));

//   setTimeout(() => {
//     isBeritaTransitioning = false;
//   }, 300);
// }

// function bukaModalBerita() {
//   const modal = document.getElementById('berita-modal');
//   const current = dataBeritaPesantren[activeBeritaIndex] || FALLBACK_BERITA[0];
//   if (!modal || !current) return;

//   const img = document.getElementById('berita-modal-img');
//   const title = document.getElementById('berita-modal-title');
//   const meta = document.getElementById('berita-modal-meta');
//   const text = document.getElementById('berita-modal-text');

//   if (img) img.src = current.gambar_url;
//   if (title) title.textContent = current.judul;
//   if (meta) meta.textContent = `${current.kategori} • ${current.tanggal} • Oleh ${current.penulis || 'Redaksi'} • ${current.baca_menit || '3 menit'}`;
//   if (text) text.innerHTML = `<p class="mb-4 font-semibold text-slate-700 leading-relaxed">${current.ringkasan}</p><p class="text-slate-600 leading-relaxed">${current.isi_lengkap}</p>`;

//   modal.classList.remove('hidden');
//   modal.classList.add('flex');
//   document.body.classList.add('overflow-hidden');
// }

// function tutupModalBerita() {
//   const modal = document.getElementById('berita-modal');
//   if (modal) {
//     modal.classList.add('hidden');
//     modal.classList.remove('flex');
//     document.body.classList.remove('overflow-hidden');
//   }
// }

// function initBeritaControls() {
//   document.getElementById('berita-btn-prev')?.addEventListener('click', () => pilihBeritaAktif(activeBeritaIndex - 1));
//   document.getElementById('berita-btn-next')?.addEventListener('click', () => pilihBeritaAktif(activeBeritaIndex + 1));
//   document.getElementById('berita-btn-baca-cta')?.addEventListener('click', (e) => {
//     e.preventDefault();
//     bukaModalBerita();
//   });
//   document.getElementById('berita-modal-close-btn')?.addEventListener('click', tutupModalBerita);
//   document.getElementById('berita-modal-backdrop')?.addEventListener('click', tutupModalBerita);
// }

// window.pilihBeritaAktif = pilihBeritaAktif;
// window.bukaModalBerita = bukaModalBerita;
// window.tutupModalBerita = tutupModalBerita;

/**
 * Portal Berita Pesantren Darul Abrar
 * Versi Revisi: 4 Card List di Sebelah Kiri + 1 Card Berita Utama di Sebelah Kanan
 * Jarak vertikal antar-card konsisten, presisi, dan simetris dengan Card Utama di kanan.
 */

let dataBeritaPesantren = [];
let activeBeritaIndex = 0;
let isBeritaTransitioning = false;

const FALLBACK_BERITA = [
  {
    id: 1,
    judul: "Wisuda Akbar Tahfidz 30 Juz & Pelepasan Santri Angkatan Ke-28 Berlangsung Khidmat",
    kategori: "Tahfidz & Akademik",
    tanggal: "18 Oktober 2026",
    penulis: "Redaksi Darul Abrar",
    ringkasan: "Sebanyak 145 santri resmi diwisuda dan menyelesaikan hafalan 30 Juz Al-Qur'an bersanad, disaksikan ribuan wali santri serta para ulama terkemuka.",
    isi_lengkap: "Suasana haru dan penuh rasa syukur menyelimuti Gedung Pertemuan Utama Pesantren Pendidikan Islam Darul Abrar dalam gelaran Wisuda Akbar Tahfidz Al-Qur'an Angkatan Ke-28. Dari total wisudawan, 48 santri di antaranya berhasil menyelesaikan tasmi' 30 Juz sekali duduk dengan predikat Mumtaz Syaraf.",
    gambar_url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop",
    baca_menit: "4 menit membaca"
  },
  {
    id: 2,
    judul: "Santri Darul Abrar Sabet Juara 1 Olimpiade Sains Nasional (OSN) Bidang Astronomi",
    kategori: "Prestasi Sains",
    tanggal: "12 Oktober 2026",
    penulis: "Biro Humas & Prestasi",
    ringkasan: "Membuktikan perpaduan sains dan ilmu falak, santri kelas XI berhasil mengungguli ratusan delegasi sekolah umum tingkat nasional.",
    isi_lengkap: "Ahmad Rayhan, santri Madrasah Aliyah Darul Abrar, sukses meraih medali emas pada ajang bergengsi Olimpiade Sains Nasional (OSN) bidang Astronomi dan Astrofisika.",
    gambar_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200&auto=format&fit=crop",
    baca_menit: "3 menit membaca"
  },
  {
    id: 3,
    judul: "Kunjungan Silaturahmi Guru Besar Universitas Al-Azhar Kairo Mesir ke Pesantren",
    kategori: "Kerjasama Global",
    tanggal: "05 Oktober 2026",
    penulis: "Tim Kerjasama Luar Negeri",
    ringkasan: "Pesantren menjalin kesepahaman beasiswa studi lanjut S1 dan penempatan dosen tamu penutur asli bahasa Arab langsung dari Kairo.",
    isi_lengkap: "Pesantren menyambut hangat kedatangan Prof. Dr. Syaikh Usamah Al-Azhari beserta rombongan dari Universitas Al-Azhar Kairo. Kunjungan akademik ini membahas penguatan kurikulum bahasa Arab.",
    gambar_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop",
    baca_menit: "5 menit membaca"
  },
  {
    id: 4,
    judul: "Semarak Porseni & Musabaqah Tilawatil Qur'an Antar Santri Se-Provinsi Jawa Barat",
    kategori: "Kegiatan Santri",
    tanggal: "28 September 2026",
    penulis: "Departemen Olahraga & Seni",
    ringkasan: "Lebih dari 40 pondok pesantren berpartisipasi dalam ajang perlombaan tilawah, kaligrafi, pidato 3 bahasa, dan kejuaraan silat santri.",
    isi_lengkap: "Gelaran akbar Porseni Santri tahun ini dipusatkan di kompleks kampus terpadu Darul Abrar. Ratusan santri unjuk kebolehan dalam kompetisi Musabaqah Qira'atil Kutub.",
    gambar_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    baca_menit: "3 menit membaca"
  },
  {
    id: 5,
    judul: "Pelatihan Jurnalistik Islami & Penyiaran Podcast Dakwah Multimedia Santri",
    kategori: "Literasi & Digital",
    tanggal: "21 September 2026",
    penulis: "Studio Media Pesantren",
    ringkasan: "Santri dibekali keterampilan produksi konten digital positif, sinematografi, teknik penulisan berita, dan etika komunikasi Islam.",
    isi_lengkap: "Menjawab tantangan revolusi digital, divisi media Darul Abrar menyelenggarakan workshop intensif penulisan jurnalistik dan podcast santri.",
    gambar_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
    baca_menit: "4 menit membaca"
  },
  {
    id: 6,
    judul: "Bakti Sosial & Santunan 500 Anak Yatim Piatu dalam Rangka Milad Ke-35 Pesantren",
    kategori: "Sosial & Dakwah",
    tanggal: "14 September 2026",
    penulis: "Lembaga Amil Zakat & Wakaf",
    ringkasan: "Wujud nyata kepedulian pesantren kepada masyarakat sekitar melalui penyaluran sembako, pengobatan gratis, dan paket pendidikan anak sholeh.",
    isi_lengkap: "Dalam rangkaian tasyakuran Milad Pesantren ke-35, Darul Abrar menyalurkan bantuan kepada 500 anak yatim dan keluarga prasejahtera di 5 desa sekitar pondok.",
    gambar_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    baca_menit: "4 menit membaca"
  },
  {
    id: 7,
    judul: "Pelepasan 32 Santri Penerima Beasiswa Penuh Kuliah ke Universitas di Turki & Maroko",
    kategori: "Prestasi Alumni",
    tanggal: "02 September 2026",
    penulis: "Biro Hubungan Alumni",
    ringkasan: "Alumni pesantren kembali membanggakan dengan lolos seleksi beasiswa Turkiye Burslari dan Kementerian Wakaf Kerajaan Maroko.",
    isi_lengkap: "Pesantren kembali melepas 32 lulusan terbaik yang berhasil memenangkan beasiswa penuh jenjang sarjana di Universitas Istanbul dan Sakarya University.",
    gambar_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    baca_menit: "3 menit membaca"
  }
];

/**
 * 1. MENGAMBIL 4 BERITA BERIKUTNYA SECARA SIRKULAR
 * Menggantikan getNextThreeBerita (offset 1 s/d 4)
 */
function getNextFourBerita(currentIdx) {
  const total = dataBeritaPesantren.length;
  if (total === 0) return [];
  const list = [];
  const targetCount = Math.min(4, Math.max(1, total - 1));
  for (let offset = 1; offset <= targetCount; offset++) {
    const nextIdx = (currentIdx + offset) % total;
    list.push({
      item: dataBeritaPesantren[nextIdx],
      targetIndex: nextIdx,
      queueNumber: offset
    });
  }
  return list;
}

/**
 * 2. RENDER BERITA UTAMA (Card Kanan)
 */
function renderBeritaUtama(item) {
  const mainCard = document.getElementById('berita-main-container');
  const img = document.getElementById('berita-main-img');
  const kategori = document.getElementById('berita-main-kategori');
  const tanggal = document.getElementById('berita-main-tanggal');
  const judul = document.getElementById('berita-main-judul');
  const ringkasan = document.getElementById('berita-main-ringkasan');
  const counterCurrent = document.getElementById('berita-counter-current');
  const counterTotal = document.getElementById('berita-counter-total');

  if (!mainCard || !item) return;

  // Transisi halus (hanya transform & opacity)
  mainCard.classList.add('opacity-40', 'scale-[0.995]');

  setTimeout(() => {
    if (img) { img.src = item.gambar_url; img.alt = item.judul; }
    if (kategori) kategori.textContent = item.kategori;
    if (tanggal) tanggal.textContent = item.tanggal;
    if (judul) judul.textContent = item.judul;
    if (ringkasan) ringkasan.textContent = item.ringkasan;
    if (counterCurrent) counterCurrent.textContent = String(activeBeritaIndex + 1).padStart(2, '0');
    if (counterTotal) counterTotal.textContent = String(dataBeritaPesantren.length).padStart(2, '0');

    mainCard.classList.remove('opacity-40', 'scale-[0.995]');
  }, 140);
}

/**
 * 3. RENDER 4 CARD LIST (Card Kiri)
 * Container menggunakan class 'grid grid-rows-4 gap-3.5 h-full'
 * Setiap article menggunakan 'h-full flex items-stretch'
 */
function renderBeritaSidebar(fourItems) {
  const container = document.getElementById('berita-sidebar-list');
  if (!container) return;

  container.innerHTML = fourItems.map(({ item, targetIndex }) => `
    <article 
      class="berita-sidebar-item group relative flex items-stretch gap-3 sm:gap-3.5 p-3 sm:p-3.5 bg-white rounded-xl border border-slate-200/90 hover:border-[#0072CE] hover:shadow-sm transition-all duration-200 cursor-pointer select-none overflow-hidden h-full"
      onclick="pilihBeritaAktif(${targetIndex})"
      data-target-index="${targetIndex}"
      tabindex="0"
      role="button"
      aria-label="Tampilkan berita: ${item.judul}"
    >
      <!-- Thumbnail Gambar dengan proporsi tetap -->
      <div class="relative w-24 sm:w-28 shrink-0 rounded-lg overflow-hidden bg-slate-900">
        <img 
          src="${item.gambar_url}" 
          alt="${item.judul}"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors"></div>
        <span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-900/85 backdrop-blur-xs text-[10px] font-bold text-[#DAA520]">
          #${item.id}
        </span>
      </div>

      <!-- Konten Teks Terdistribusi Rata Secara Vertikal -->
      <div class="flex flex-col justify-between flex-grow min-w-0 py-0.5">
        <div>
          <div class="flex items-center gap-1.5 mb-1 text-[11px] leading-tight text-slate-500">
            <span class="font-semibold text-[#0072CE] uppercase tracking-wide truncate max-w-[130px]">${item.kategori}</span>
            <span aria-hidden="true" class="text-slate-300">·</span>
            <span class="text-slate-400 tabular-nums shrink-0">${item.tanggal.split(' ').slice(0, 2).join(' ')}</span>
          </div>
          <h4 class="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#0072CE] transition-colors leading-snug line-clamp-2">
            ${item.judul}
          </h4>
        </div>

        <div class="flex items-center justify-between text-[11px] font-medium text-slate-500 pt-1.5 border-t border-slate-100">
          <span class="group-hover:text-[#0072CE] transition-colors">Jadikan Utama</span>
          <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0072CE] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * 4. LOGIKA PEMILIHAN BERITA AKTIF
 */
function pilihBeritaAktif(index) {
  if (isBeritaTransitioning) return;
  const total = dataBeritaPesantren.length;
  if (total === 0) return;

  isBeritaTransitioning = true;
  activeBeritaIndex = ((index % total) + total) % total;

  renderBeritaUtama(dataBeritaPesantren[activeBeritaIndex]);
  renderBeritaSidebar(getNextFourBerita(activeBeritaIndex));

  setTimeout(() => {
    isBeritaTransitioning = false;
  }, 250);
}

/**
 * 5. MODAL POPUP & CONTROLS
 */
function bukaModalBerita() {
  const modal = document.getElementById('berita-modal');
  const current = dataBeritaPesantren[activeBeritaIndex] || FALLBACK_BERITA[0];
  if (!modal || !current) return;

  const img = document.getElementById('berita-modal-img');
  const title = document.getElementById('berita-modal-title');
  const meta = document.getElementById('berita-modal-meta');
  const text = document.getElementById('berita-modal-text');

  if (img) img.src = current.gambar_url;
  if (title) title.textContent = current.judul;
  if (meta) meta.textContent = `${current.kategori} · ${current.tanggal} · Oleh ${current.penulis || 'Redaksi'} · ${current.baca_menit || '3 menit'}`;
  if (text) {
    text.innerHTML = `
      <p class="mb-4 font-semibold text-slate-800 leading-relaxed text-base">${current.ringkasan}</p>
      <p class="text-slate-600 leading-relaxed text-sm sm:text-base">${current.isi_lengkap}</p>
    `;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');
}

function tutupModalBerita() {
  const modal = document.getElementById('berita-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
}

function initBeritaControls() {
  document.getElementById('berita-btn-prev')?.addEventListener('click', () => {
    pilihBeritaAktif(activeBeritaIndex - 1);
  });
  document.getElementById('berita-btn-next')?.addEventListener('click', () => {
    pilihBeritaAktif(activeBeritaIndex + 1);
  });
  document.getElementById('berita-btn-baca-cta')?.addEventListener('click', (e) => {
    e.preventDefault();
    bukaModalBerita();
  });
  document.getElementById('berita-modal-close-btn')?.addEventListener('click', tutupModalBerita);
  document.getElementById('berita-modal-backdrop')?.addEventListener('click', tutupModalBerita);
}

function initBeritaPesantren(customData) {
  dataBeritaPesantren = (Array.isArray(customData) && customData.length > 0) ? customData : FALLBACK_BERITA;
  activeBeritaIndex = 0;
  
  renderBeritaUtama(dataBeritaPesantren[activeBeritaIndex]);
  renderBeritaSidebar(getNextFourBerita(activeBeritaIndex));
  initBeritaControls();
}

window.pilihBeritaAktif = pilihBeritaAktif;
window.bukaModalBerita = bukaModalBerita;
window.tutupModalBerita = tutupModalBerita;
window.initBeritaPesantren = initBeritaPesantren;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('berita-sidebar-list') && document.getElementById('berita-main-container')) {
    initBeritaPesantren();
  }
});


// ============================================================================
// 6. SECTION PPDB
// ============================================================================
let dataPPDB = null;

const FALLBACK_PPDB = {
  tahun_ajaran: "2026/2027",
  gelombang: [
    {
      id: 1,
      nama: "Gelombang I (Jalur Prestasi & Tahfidz)",
      periode: "01 Nov 2026 - 31 Des 2026",
      status: "Sedang Dibuka",
      status_badge: "bg-emerald-500 text-white",
      is_active: true,
      keuntungan: "Bebas Uang Pangkal 50% bagi Tahfidz min. 5 Juz & Juara OSN/KSM",
      kuota: "Tersisa 45 Kursi Santri"
    },
    {
      id: 2,
      nama: "Gelombang II (Jalur Reguler Tahap 1)",
      periode: "01 Jan 2027 - 28 Feb 2027",
      status: "Segera Dibuka",
      status_badge: "bg-blue-600 text-white",
      is_active: false,
      keuntungan: "Prioritas pemilihan kamar asrama dan tes seleksi terpadu",
      kuota: "Kuota Tersedia: 120 Santri"
    },
    {
      id: 3,
      nama: "Gelombang III (Jalur Reguler Tahap 2)",
      periode: "01 Mar 2027 - 30 Apr 2027",
      status: "Akan Datang",
      status_badge: "bg-slate-400 text-white",
      is_active: false,
      keuntungan: "Pengisian sisa kuota jika masih tersedia",
      kuota: "Sisa Kuota Terbatas"
    }
  ],
  persyaratan: [
    { nomor: "01", judul: "Formulir Pendaftaran", detail: "Mengisi data diri calon santri dan wali secara online di portal resmi PPDB Pesantren." },
    { nomor: "02", judul: "Akta & Kartu Keluarga", detail: "Fotokopi Akta Kelahiran dan Kartu Keluarga (KK) masing-masing sebanyak 3 lembar." },
    { nomor: "03", judul: "Ijazah & Rapor Sekolah", detail: "Fotokopi Ijazah/SKL berlegalisir serta fotokopi rapor 3 semester terakhir dari sekolah asal." },
    { nomor: "04", judul: "Pas Foto Formal", detail: "Pas foto santri ukuran 3x4 (4 lembar) dan 4x6 (4 lembar) dengan baju putih berkopiah/berjilbab." },
    { nomor: "05", judul: "Surat Keterangan Sehat", detail: "Surat keterangan sehat jasmani, bebas penyakit menular, dan bebas narkoba dari RS/Puskesmas." },
    { nomor: "06", judul: "Sertifikat Prestasi (Opsional)", detail: "Piagam kejuaraan minimal tingkat kabupaten atau syahadah tahfidz Al-Qur'an." }
  ],
  alur: [
    { langkah: "1", judul: "Pendaftaran Online", deskripsi: "Buat akun calon santri di portal PPDB dan bayar biaya registrasi seleksi." },
    { langkah: "2", judul: "Unggah Dokumen", deskripsi: "Scan dan unggah berkas persyaratan melalui dashboard akun santri." },
    { langkah: "3", judul: "Ujian Seleksi", deskripsi: "Tes bacaan Al-Qur'an, potensi akademik, psikotes, dan wawancara orang tua." },
    { langkah: "4", judul: "Daftar Ulang", deskripsi: "Pengumuman hasil seleksi dan penyelesaian administrasi seragam serta asrama." }
  ]
};

function renderPPDBContent(data) {
  const gelombangContainer = document.getElementById('ppdb-gelombang-container');
  if (gelombangContainer && data.gelombang) {
    gelombangContainer.innerHTML = data.gelombang.map((g) => `
      <div class="relative p-5 sm:p-6 rounded-3xl border ${g.is_active ? 'border-[#0072CE] bg-blue-50/40 ring-2 ring-[#0072CE]/20' : 'border-slate-200 bg-white'} shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold px-3 py-1 rounded-full ${g.status_badge || 'bg-slate-500 text-white'}">
              ${g.status}
            </span>
            <span class="text-xs font-mono text-slate-500 font-semibold">${g.kuota}</span>
          </div>
          <h4 class="text-base sm:text-lg font-bold text-[#1E293B] mb-1.5">
            ${g.nama}
          </h4>
          <p class="text-xs font-semibold text-[#0072CE] mb-3 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ${g.periode}
          </p>
          <p class="text-xs text-slate-600 leading-relaxed">
            ${g.keuntungan}
          </p>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-200/60">
          <a 
            href="#ppdb-cta" 
            class="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${g.is_active ? 'bg-[#0072CE] text-white hover:bg-blue-700 shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
          >
            ${g.is_active ? 'Daftar di Gelombang Ini' : 'Lihat Jadwal Lengkap'}
          </a>
        </div>
      </div>
    `).join('');
  }

  const syaratContainer = document.getElementById('ppdb-syarat-container');
  if (syaratContainer && data.persyaratan) {
    syaratContainer.innerHTML = data.persyaratan.map((s) => `
      <div class="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#DAA520] transition-colors flex items-start gap-3.5">
        <span class="w-8 h-8 rounded-xl bg-amber-50 text-[#DAA520] font-black text-sm flex items-center justify-center shrink-0 border border-amber-200/60">
          ${s.nomor}
        </span>
        <div>
          <h5 class="text-sm font-bold text-[#1E293B] mb-1">${s.judul}</h5>
          <p class="text-xs text-slate-600 leading-relaxed">${s.detail}</p>
        </div>
      </div>
    `).join('');
  }

  const alurContainer = document.getElementById('ppdb-alur-container');
  if (alurContainer && data.alur) {
    alurContainer.innerHTML = data.alur.map((a) => `
      <div class="flex flex-col items-center text-center p-4">
        <div class="w-12 h-12 rounded-2xl bg-[#0072CE] text-white font-black text-lg flex items-center justify-center shadow-md mb-3 ring-4 ring-blue-100">
          ${a.langkah}
        </div>
        <h5 class="text-sm font-bold text-[#1E293B] mb-1">${a.judul}</h5>
        <p class="text-xs text-slate-600 leading-relaxed">${a.deskripsi}</p>
      </div>
    `).join('');
  }
}

function initPPDBModal() {
  const modal = document.getElementById('ppdb-form-modal');
  const btnClose = document.getElementById('ppdb-form-modal-close');
  const backdrop = document.getElementById('ppdb-form-modal-backdrop');
  const form = document.getElementById('ppdb-quick-form');

  function openPPDB() {
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closePPDB() {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    }
  }

  document.getElementById('ppdb-cta-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openPPDB();
  });

  document.getElementById('ppdb-cta-hero')?.addEventListener('click', (e) => {
    e.preventDefault();
    openPPDB();
  });

  btnClose?.addEventListener('click', closePPDB);
  backdrop?.addEventListener('click', closePPDB);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const namaCalon = document.getElementById('ppdb-input-nama')?.value || 'Calon Santri';
    const noWa = document.getElementById('ppdb-input-wa')?.value || '';
    const jenjang = document.getElementById('ppdb-input-jenjang')?.value || 'MTs';

    const pesanWa = encodeURIComponent(`Halo Panitia PPDB Pesantren Darul Abrar,\nSaya ingin mendaftarkan calon santri:\nNama: ${namaCalon}\nNo WA: ${noWa}\nJenjang: ${jenjang}\nMohon panduan registrasi selanjutnya. Terima kasih.`);
    closePPDB();
    window.open(`https://wa.me/6285939463834?text=${pesanWa}`, '_blank');
  });
}

// ============================================================================
// 7. SECTION TESTIMONI SANTRI (AUTO-SCROLL + HOVER PAUSE/RESUME)
// ============================================================================
let dataTestimoniSantri = [];
let testimoniScrollInterval = null;
let isTestimoniHovered = false;
const SCROLL_SPEED = 0.8;

const FALLBACK_TESTIMONI = [
  {
    id: 1,
    nama: "Muhammad Raihan Fadhil",
    status: "Alumni Angkatan 2022",
    info_tambahan: "Mahasiswa Fakultas Syariah Al-Azhar Kairo & Hafidz 30 Juz",
    asal: "Bandung, Jawa Barat",
    foto_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    kutipan: "Belajar 6 tahun di Pesantren Darul Abrar bukan sekadar menghafal Al-Qur'an dan kitab kuning, tetapi menanamkan adab, kemandirian hidup, dan cara berpikir terbuka.",
    rating: 5
  },
  {
    id: 2,
    nama: "Siti Sarah Nurhaliza",
    status: "Alumni Angkatan 2021",
    info_tambahan: "Mahasiswi Pendidikan Dokter Universitas Indonesia (UI)",
    asal: "Jakarta Selatan",
    foto_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    kutipan: "Banyak orang mengira anak pesantren sulit masuk Fakultas Kedokteran di PTN top. Di Darul Abrar, laboratorium sainsnya luar biasa lengkap dan asatidz sangat suportif dalam membimbing kami.",
    rating: 5
  },
  {
    id: 3,
    nama: "Farhan Daniswara",
    status: "Alumni Angkatan 2020",
    info_tambahan: "Software Engineer & Penerima Beasiswa Turkiye Burslari",
    asal: "Surabaya, Jawa Timur",
    foto_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    kutipan: "Laboratorium komputer dan program coding di pesantren memberikan saya bekal masa depan. Jiwa kepemimpinan yang dilatih lewat organisasi santri sangat berharga.",
    rating: 5
  },
  {
    id: 4,
    nama: "Aisyah Humaira Putri",
    status: "Santriwati Kelas XII MA",
    info_tambahan: "Juara 1 Musabaqah Qira'atil Kutub (MQK) Tingkat Nasional",
    asal: "Medan, Sumatera Utara",
    foto_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    kutipan: "Lingkungan asrama yang hangat dan bimbingan musyrifah yang sabar membuat pesantren terasa seperti rumah kedua. Halaqah qur'an ba'da shubuh melatih kedisiplinan hati.",
    rating: 5
  },
  {
    id: 5,
    nama: "Zulhilmi Al-Bantani",
    status: "Alumni Angkatan 2023",
    info_tambahan: "Pengusaha Muda Santri & Hafidz Mutqin",
    asal: "Serang, Banten",
    foto_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    kutipan: "Di pesantren kami diajarkan konsep barakah dan integritas wirausaha. Kedisiplinan bangun sebelum subuh membentuk mental tangguh dalam membangun bisnis saat ini.",
    rating: 5
  },
  {
    id: 6,
    nama: "Nurul Izzah Maulida",
    status: "Alumni Angkatan 2022",
    info_tambahan: "Penerima Beasiswa S1 Hubungan Internasional UGM",
    asal: "Yogyakarta",
    foto_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    kutipan: "Program English Debate Club dan Muhadatsah Arab di Darul Abrar benar-benar hidup. Terima kasih pondok pesantren atas pendidikan karakter mulia.",
    rating: 5
  }
];

function renderTestimoniTrack(items) {
  const track = document.getElementById('testimoni-track');
  if (!track) return;

  const combinedItems = [...items, ...items];

  track.innerHTML = combinedItems.map((item) => `
    <article 
      class="testimoni-card shrink-0 w-[300px] sm:w-[360px] bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#DAA520]/60 transition-all duration-300 flex flex-col justify-between select-none"
    >
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-1 text-[#DAA520]">
            ${Array.from({ length: item.rating || 5 }).map(() => `
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            `).join('')}
          </div>
          <span class="text-xs font-mono text-slate-400 font-semibold">Testimoni</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
          "${item.kutipan}"
        </p>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center gap-3.5">
        <img 
          src="${item.foto_url}" 
          alt="${item.nama}" 
          loading="lazy"
          class="w-12 h-12 rounded-full object-cover ring-2 ring-[#0072CE]/30 shadow-xs shrink-0"
        />
        <div class="overflow-hidden">
          <h4 class="text-sm font-bold text-[#1E293B] leading-tight truncate">
            ${item.nama}
          </h4>
          <p class="text-[11px] font-semibold text-[#0072CE] mt-0.5 truncate">
            ${item.status}
          </p>
          <p class="text-[10px] text-slate-500 truncate">
            ${item.info_tambahan || item.asal}
          </p>
        </div>
      </div>
    </article>
  `).join('');
}

function initTestimoniAutoScroll() {
  const container = document.getElementById('testimoni-track-container');
  const track = document.getElementById('testimoni-track');
  const statusBadge = document.getElementById('testimoni-status-badge');

  if (!container || !track) return;

  function stepScroll() {
    if (!isTestimoniHovered) {
      container.scrollLeft += SCROLL_SPEED;
      const maxScroll = (container.scrollWidth - container.clientWidth) / 2;
      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0;
      }
    }
    testimoniScrollInterval = requestAnimationFrame(stepScroll);
  }

  testimoniScrollInterval = requestAnimationFrame(stepScroll);

  container.addEventListener('mouseenter', () => {
    isTestimoniHovered = true;
    if (statusBadge) {
      statusBadge.textContent = "Scroll Berhenti (Hover)";
      statusBadge.classList.replace('text-emerald-600', 'text-amber-600');
    }
  });

  container.addEventListener('mouseleave', () => {
    isTestimoniHovered = false;
    if (statusBadge) {
      statusBadge.textContent = "Auto-Scroll Berjalan";
      statusBadge.classList.replace('text-amber-600', 'text-emerald-600');
    }
  });

  container.addEventListener('touchstart', () => { isTestimoniHovered = true; }, { passive: true });
  container.addEventListener('touchend', () => { isTestimoniHovered = false; }, { passive: true });

  document.getElementById('testimoni-btn-prev')?.addEventListener('click', () => {
    container.scrollBy({ left: -340, behavior: 'smooth' });
  });

  document.getElementById('testimoni-btn-next')?.addEventListener('click', () => {
    container.scrollBy({ left: 340, behavior: 'smooth' });
  });
}

// ============================================================================
// 8. INISIALISASI UTAMA
// ============================================================================
async function initAplikasiPesantren() {
  console.info("[Pesantren Darul Abrar] Memuat modul dan data website...");

  // 1. Mobile Menu
  initMobileNavigation();

  // 2. Fasilitas
  dataFasilitasPesantren = await fetchPesantrenData('data_fasilitas.json', FALLBACK_FASILITAS);
  renderFasilitasGrid(dataFasilitasPesantren);
  initFasilitasModalEvents();

  // 3. Galeri Aktivitas Santri
  dataKegiatanPesantren = await fetchPesantrenData('data_kegiatan.json', FALLBACK_KEGIATAN);
  if (dataKegiatanPesantren.length > 0) {
    setKegiatanAktif(1);
    initKegiatanControls();
  }

  // 4. Prestasi Santri (Showcase Section)
  dataPrestasiPesantren = await fetchPesantrenData('data_prestasi.json', FALLBACK_PRESTASI);
  initPrestasiShowcase();

  // 5. Berita Terbaru (Looping 1-7)
  dataBeritaPesantren = await fetchPesantrenData('data_berita.json', FALLBACK_BERITA);
  if (dataBeritaPesantren.length > 0) {
    pilihBeritaAktif(0);
    initBeritaControls();
  }

  // 6. PPDB
  dataPPDB = await fetchPesantrenData('data_ppdb.json', FALLBACK_PPDB);
  renderPPDBContent(dataPPDB);
  initPPDBModal();

  // 7. Testimoni Santri
  dataTestimoniSantri = await fetchPesantrenData('data_testimoni.json', FALLBACK_TESTIMONI);
  renderTestimoniTrack(dataTestimoniSantri);
  initTestimoniAutoScroll();

  console.info("[Pesantren Darul Abrar] Seluruh 9 section berhasil diinisialisasi.");
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAplikasiPesantren);
} else {
  initAplikasiPesantren();
}

export {
  initAplikasiPesantren,
  bukaModalFasilitas,
  tutupModalFasilitas,
  pilihBeritaAktif,
  bukaModalBerita,
  tutupModalBerita,
  navigateToPrestasi
};
