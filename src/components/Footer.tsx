/**
 * Footer minimal — hanya dipakai di halaman About.
 * Halaman lain (home, search, watch, dll) tidak pakai footer
 * agar terasa seperti platform video (YouTube-style).
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface/40 py-6 px-4">
      <div className="mx-auto max-w-3xl text-center space-y-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Disclaimer:</strong> Website ini menampilkan konten pihak ketiga melalui YouTube API.
          Kami tidak mendukung atau bertanggung jawab atas konten yang diunggah pengguna di platform asli.
          Konten yang ditonton adalah pilihan dan tanggung jawab pengguna sendiri.
        </p>
        <p className="text-[11px] text-muted-foreground/50">
          © {new Date().getFullYear()} AnimeTube · Non-commercial / educational use.
          All video content © respective owners.
        </p>
      </div>
    </footer>
  );
}
