import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'welcome' | 'disclaimer'>('welcome');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // Check if user has already accepted disclaimer
    const hasAccepted = localStorage.getItem('disclaimer-accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleContinue = () => {
    setStep('disclaimer');
  };

  const handleAccept = () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    setAccepted(true);
    setIsOpen(false);
    setStep('welcome');
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('welcome');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-2xl">
        {step === 'welcome' ? (
          <>
            <AlertDialogHeader className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-black text-gradient">AnimeTube</div>
                <AlertDialogTitle className="text-2xl mt-4">
                  Selamat Datang di AnimeTube
                </AlertDialogTitle>
              </div>
            </AlertDialogHeader>

            <AlertDialogDescription className="space-y-4 text-sm text-foreground">
              <p>
                Ini adalah <strong>Proyek Ambisius</strong> yang dirancang untuk memberikan pengalaman eksplorasi konten video secara bebas dan dinamis melalui integrasi sistem pihak ketiga.
              </p>
              
              <p>
                Kami berkomitmen pada <strong>kebebasan akses informasi</strong>, namun kami sangat menghimbau pengguna untuk tetap <strong>bijak</strong> dan menjunjung tinggi nilai <strong>moral serta etika</strong>.
              </p>

              <p>
                Segala konten yang muncul adalah cerminan dari apa yang <strong>Anda cari</strong>; gunakanlah platform ini untuk hal-hal yang <strong>positif</strong>.
              </p>

              <div className="rounded-lg bg-card/50 border border-primary/20 p-4">
                <p className="text-xs">
                  <strong>⚠️ Penting:</strong> Dengan melanjutkan, Anda menyatakan diri sebagai pengguna yang <strong>bertanggung jawab secara penuh</strong> atas segala aktivitas dan konten yang Anda akses di dalam platform ini.
                </p>
              </div>
            </AlertDialogDescription>

            <AlertDialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Keluar
              </Button>
              <Button onClick={handleContinue} className="bg-primary hover:bg-primary/90">
                LANJUTKAN EKSPLORASI →
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <AlertDialogTitle className="text-xl">
                  DISCLAIMER PROYEK AMBISIUS
                </AlertDialogTitle>
              </div>
            </AlertDialogHeader>

            <AlertDialogDescription className="space-y-4 text-sm text-foreground max-h-96 overflow-y-auto">
              <p className="font-semibold text-primary">
                Platform ini adalah sistem eksplorasi video yang ditenagai oleh YouTube API.
              </p>

              <p>
                Kami berkomitmen menyediakan akses teknologi yang terbuka, namun kami <strong>berlepas diri</strong> (tidak bertanggung jawab) atas penyalahgunaan akses oleh pengguna untuk mencari konten yang melanggar norma agama atau hukum.
              </p>

              <div className="space-y-3 rounded-lg bg-destructive/5 border border-destructive/20 p-4">
                <p className="font-semibold text-sm">Dengan menekan tombol di bawah, Anda sadar dan setuju bahwa:</p>
                <ul className="space-y-2 text-xs">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Segala konten yang Anda <strong>cari adalah tanggung jawab pribadi Anda</strong> di dunia maupun di akhirat.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Anda akan menggunakan platform ini <strong>hanya untuk tujuan positif</strong>.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Anda memahami bahwa AnimeTube hanya <strong>media agregasi konten</strong>, bukan penyedia konten.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Semua konten yang muncul adalah <strong>tanggung jawab pencari dan pemilik konten asli</strong>.</span>
                  </li>
                </ul>
              </div>

              <p className="text-xs italic text-muted-foreground">
                Platform ini menyediakan tools untuk filtering konten keluarga, namun teknologi tidak sempurna. Anda tetap bertanggung jawab atas pilihan konten yang dibuka.
              </p>
            </AlertDialogDescription>

            <AlertDialogFooter className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('welcome')}
              >
                ← Kembali
              </Button>
              <Button 
                onClick={handleAccept} 
                className="bg-primary hover:bg-primary/90"
              >
                SAYA MENGERTI & BERTANGGUNG JAWAB ✓
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
