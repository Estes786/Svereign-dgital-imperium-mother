// ============================================================
// TEMPLATE: Barber Shop — Dark bold theme
// ============================================================
export function barberTemplate(data: {
  name: string; address: string; phone: string; rating: number;
  reviews: number; waLink: string; mapsLink: string; thumbnail?: string;
}): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.name} — Barber Shop Profesional</title>
<meta name="description" content="${data.name} — Barber shop terbaik di area Anda. Rating ${data.rating}/5 dari ${data.reviews} review.">
<meta property="og:title" content="${data.name}"><meta property="og:description" content="Barber shop profesional. Rating ${data.rating}/5">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif}h1,h2,h3,.brand{font-family:'Bebas Neue',sans-serif;letter-spacing:1px}.hero-bg{background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 50%,#16213e 100%)}.gold{color:#d4a574}.bg-gold{background:#d4a574}.glow{box-shadow:0 0 30px rgba(212,165,116,0.3)}</style>
</head><body class="bg-black text-white">

<!-- Hero -->
<section class="hero-bg min-h-screen flex flex-col justify-center px-6 py-12 relative overflow-hidden">
  <div class="absolute inset-0 opacity-5" style="background-image:repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(212,165,116,0.1) 35px,rgba(212,165,116,0.1) 36px)"></div>
  <div class="relative max-w-lg mx-auto text-center">
    <div class="text-6xl mb-4">💈</div>
    <h1 class="text-5xl md:text-6xl gold mb-2 tracking-wider">${data.name.toUpperCase()}</h1>
    <p class="text-white/60 text-sm mb-6">BARBER SHOP PROFESIONAL</p>
    <div class="flex justify-center gap-4 mb-8">
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold gold">${data.rating}</div><div class="text-[10px] text-white/40">⭐ RATING</div></div>
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold text-white">${data.reviews}</div><div class="text-[10px] text-white/40">📝 REVIEW</div></div>
    </div>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-gold text-black px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all glow"><i class="fab fa-whatsapp text-xl"></i>BOOKING SEKARANG</a>
    <p class="text-white/30 text-xs mt-3">Chat langsung via WhatsApp</p>
  </div>
</section>

<!-- Services -->
<section class="py-16 px-6 bg-[#0a0a0a]">
  <div class="max-w-lg mx-auto">
    <h2 class="text-3xl gold text-center mb-8">LAYANAN KAMI</h2>
    <div class="space-y-3">
      ${['Haircut Premium — Rp 50.000','Shaving & Grooming — Rp 35.000','Hair Coloring — Rp 100.000','Kids Haircut — Rp 35.000','Beard Trim & Shape — Rp 25.000','Hair Treatment — Rp 75.000'].map(s=>`<div class="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-5 py-3"><span class="text-sm">${s.split(' — ')[0]}</span><span class="gold font-bold text-sm">${s.split(' — ')[1]}</span></div>`).join('')}
    </div>
  </div>
</section>

<!-- Location -->
<section class="py-16 px-6 bg-black">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl gold mb-6">LOKASI</h2>
    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
      <i class="fas fa-map-marker-alt gold text-2xl mb-3"></i>
      <p class="text-white/70 text-sm">${data.address}</p>
    </div>
    <div class="flex gap-3 justify-center">
      <a href="${data.mapsLink}" target="_blank" class="bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-all"><i class="fas fa-directions mr-2"></i>Google Maps</a>
      <a href="tel:${data.phone.replace(/[^0-9+]/g,'')}" class="bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-all"><i class="fas fa-phone mr-2"></i>Telepon</a>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="py-16 px-6 hero-bg">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl gold mb-4">BOOK SEKARANG</h2>
    <p class="text-white/50 text-sm mb-6">Jangan antri, langsung chat & booking via WhatsApp!</p>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-gold text-black px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all glow"><i class="fab fa-whatsapp text-xl"></i>CHAT WHATSAPP</a>
  </div>
</section>

<footer class="py-6 px-6 bg-black text-center"><p class="text-white/20 text-xs">${data.name} &copy; 2026 | Dibuat oleh Sovereign Digital</p></footer>
</body></html>`
}
