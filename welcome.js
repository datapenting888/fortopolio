// ── welcome.js ──
// Menampilkan pesan "Selamat Datang" saat tombol diklik

function tampilkanSambutan(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('modal');
  if (modal) modal.classList.add('active');
}

function tutupModal(event) {
  // Tutup hanya jika klik di luar kotak modal
  if (event.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('active');
  }
}

// Tutup dengan tombol ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
  }
});

// Tampilkan sambutan otomatis saat halaman pertama kali dibuka (opsional)
// window.addEventListener('load', () => tampilkanSambutan());
