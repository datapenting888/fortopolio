// ════════════════════════════════════════════
//  script.js — Logika Absensi DWAdmin Custom
//  Fitur: jam real-time, izin keluar/masuk,
//         kuota harian, status, localStorage
// ════════════════════════════════════════════

// ── KONFIGURASI PENGGUNA ──
// Ganti data di sini sesuai karyawan yang login
const USER = {
  nama:  "RIKI ANDIKA NAINGGOLAN",
  role:  "CS",
  kuota: 4   // maksimum izin keluar per hari
};

// ── KEY localStorage ──
const STORAGE_KEY = "absensi_" + USER.nama.replace(/\s/g, "_");

// ── STATE ──
let state = {
  terpakai: 0,        // berapa kali sudah izin keluar
  sedangDiluar: false // apakah sedang di luar kantor
};

// ── INISIALISASI ──
function init() {
  muatDataHariIni();
  tampilkanUser();
  updateStatus();
  updateProgressBar();
  jalankanJam();
}

// ── TAMPILKAN NAMA & ROLE ──
function tampilkanUser() {
  const el = (id) => document.getElementById(id);
  el("namaUser").textContent   = USER.nama;
  el("roleUser").textContent   = USER.role;
  el("namaKartu").textContent  = USER.nama;
  el("roleBadge").textContent  = USER.role;
}

// ── JAM DIGITAL REAL-TIME ──
function jalankanJam() {
  function update() {
    const now  = new Date();
    const hh   = String(now.getHours()).padStart(2, "0");
    const mm   = String(now.getMinutes()).padStart(2, "0");
    const ss   = String(now.getSeconds()).padStart(2, "0");
    document.getElementById("jamDigital").textContent = `${hh}.${mm}.${ss}`;

    // Tanggal dalam Bahasa Indonesia
    const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    const bln  = ["Januari","Februari","Maret","April","Mei","Juni",
                  "Juli","Agustus","September","Oktober","November","Desember"];
    const tgl  = `${hari[now.getDay()]}, ${now.getDate()} ${bln[now.getMonth()]} ${now.getFullYear()}`;
    document.getElementById("tanggalHari").textContent = tgl;
  }
  update();
  setInterval(update, 1000);
}

// ── TOMBOL IZIN KELUAR ──
function izinKeluar() {
  if (state.sedangDiluar) {
    showAlert("⚠️ Kamu sedang di luar kantor.\nKlik KEMBALI MASUK dulu!", "warning");
    return;
  }

  if (state.terpakai >= USER.kuota) {
    showAlert(`❌ Kuota izin hari ini sudah habis!\nMaksimal ${USER.kuota}x per hari.`, "error");
    return;
  }

  const konfirm = confirm(`Yakin mau IZIN KELUAR?\n\nSisa kuota: ${USER.kuota - state.terpakai - 1} setelah ini`);
  if (!konfirm) return;

  state.terpakai++;
  state.sedangDiluar = true;
  simpanData();
  updateStatus();
  updateProgressBar();
  showAlert("✅ Izin keluar tercatat!\nJangan lupa klik KEMBALI MASUK saat sudah di kantor.", "success");
}

// ── TOMBOL KEMBALI MASUK ──
function kembaliMasuk() {
  if (!state.sedangDiluar) {
    showAlert("ℹ️ Kamu belum tercatat keluar kantor.", "info");
    return;
  }

  const konfirm = confirm("Konfirmasi KEMBALI KE KANTOR?");
  if (!konfirm) return;

  state.sedangDiluar = false;
  simpanData();
  updateStatus();
  showAlert("✅ Kamu sudah tercatat kembali ke kantor!", "success");
}

// ── UPDATE TAMPILAN STATUS ──
function updateStatus() {
  const cardStatus = document.getElementById("cardStatus");
  const statusIcon = document.getElementById("statusIcon");
  const statusLabel = document.getElementById("statusLabel");
  const btnKeluar = document.getElementById("btnKeluar");
  const btnMasuk  = document.getElementById("btnMasuk");

  if (state.sedangDiluar) {
    cardStatus.classList.add("status-diluar");
    statusIcon.textContent = "↪";
    statusLabel.textContent = "Sedang Di Luar Kantor";
    btnKeluar.style.opacity = "0.45";
    btnKeluar.style.cursor  = "not-allowed";
    btnMasuk.style.opacity  = "1";
    btnMasuk.style.cursor   = "pointer";
  } else {
    cardStatus.classList.remove("status-diluar");
    statusIcon.textContent = "✔";
    statusLabel.textContent = "Sudah Kembali ke Office";
    btnKeluar.style.opacity = "1";
    btnKeluar.style.cursor  = "pointer";
    btnMasuk.style.opacity  = "0.45";
    btnMasuk.style.cursor   = "not-allowed";
  }
}

// ── UPDATE PROGRESS BAR ──
function updateProgressBar() {
  const sisa      = USER.kuota - state.terpakai;
  const persen    = Math.max(0, (sisa / USER.kuota) * 100);
  const bar       = document.getElementById("progressBar");
  const sisaLabel = document.getElementById("sisaLabel");
  const terpakai  = document.getElementById("terpakai");
  const kuota     = document.getElementById("kuota");

  bar.style.width          = persen + "%";
  sisaLabel.textContent    = `${sisa} / ${USER.kuota}`;
  terpakai.textContent     = state.terpakai;
  kuota.textContent        = `${USER.kuota} / hari`;

  // Warna progress bar berubah jika hampir habis
  if (sisa <= 1) {
    bar.style.background = "#EF4444"; // merah
  } else if (sisa <= 2) {
    bar.style.background = "#EAB308"; // kuning
  } else {
    bar.style.background = "var(--progress-fill)"; // oranye
  }
}

// ── SIMPAN DATA KE localStorage ──
function simpanData() {
  const today = new Date().toDateString();
  const data  = {
    tanggal:      today,
    terpakai:     state.terpakai,
    sedangDiluar: state.sedangDiluar
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── MUAT DATA HARI INI ──
function muatDataHariIni() {
  const raw   = localStorage.getItem(STORAGE_KEY);
  const today = new Date().toDateString();

  if (raw) {
    const data = JSON.parse(raw);
    // Hanya pakai data jika masih hari yang sama
    if (data.tanggal === today) {
      state.terpakai     = data.terpakai     || 0;
      state.sedangDiluar = data.sedangDiluar || false;
      return;
    }
  }
  // Reset jika hari baru
  state = { terpakai: 0, sedangDiluar: false };
  simpanData();
}

// ── POPUP ALERT SEDERHANA ──
function showAlert(pesan, tipe = "info") {
  const warna = {
    success: "#22C55E",
    error:   "#EF4444",
    warning: "#EAB308",
    info:    "#3B82F6"
  };

  const div = document.createElement("div");
  div.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    background: #1A1A1A; color: #fff; padding: 1rem 1.25rem;
    border-left: 4px solid ${warna[tipe] || warna.info};
    border-radius: 10px; max-width: 320px;
    font-family: 'Rajdhani', sans-serif; font-size: 0.95rem;
    font-weight: 600; line-height: 1.5; white-space: pre-line;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    animation: slideIn 0.3s ease;
  `;
  div.textContent = pesan;
  document.body.appendChild(div);

  // CSS animasi (hanya inject sekali)
  if (!document.getElementById("alertStyle")) {
    const s = document.createElement("style");
    s.id = "alertStyle";
    s.textContent = `
      @keyframes slideIn {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0);   opacity: 1; }
      }
    `;
    document.head.appendChild(s);
  }

  setTimeout(() => div.remove(), 3500);
}

// ── GANTI PASSWORD ──
function gantiPassword() {
  const pw1 = prompt("Masukkan password baru:");
  if (!pw1) return;
  const pw2 = prompt("Konfirmasi password baru:");
  if (pw1 !== pw2) {
    showAlert("❌ Password tidak cocok!", "error");
    return;
  }
  // Simpan hash sederhana (untuk produksi gunakan backend)
  localStorage.setItem("pw_" + USER.nama, btoa(pw1));
  showAlert("✅ Password berhasil diubah!", "success");
}

// ── LOGOUT ──
function logout() {
  if (confirm("Yakin ingin logout?")) {
    // Arahkan ke halaman login (sesuaikan URL)
    window.location.href = "login.html";
  }
}

// ── MULAI ──
document.addEventListener("DOMContentLoaded", init);

function updateAnalogClock() {
  const now = new Date();
  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours();  

  const sDeg = (s / 60) * 360;
  const mDeg = ((m + s / 60) / 60) * 360;
  const hDeg = ((h % 12 + m / 60) / 12) * 360;

  document.querySelector('.second').style.transform = `translateX(-50%) rotate(${sDeg}deg)`;
  document.querySelector('.minute').style.transform = `translateX(-50%) rotate(${mDeg}deg)`;
  document.querySelector('.hour').style.transform = `translateX(-50%) rotate(${hDeg}deg)`;

  // Update text tanggal
  document.getElementById('day-text').textContent = now.toLocaleDateString('id-ID', {weekday:'long'});
  document.getElementById('date-text').textContent = now.toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'});
}

setInterval(updateAnalogClock, 1000);
updateAnalogClock();
