// ============================================================
// TEMPLATE: Bengkel / Workshop — Industrial clean theme
// ============================================================
export function workshopTemplate(data: {
  name: string; address: string; phone: string; rating: number;
  reviews: number; waLink: string; mapsLink: string; thumbnail?: string;
}): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.name} — Bengkel Terpercaya</title>
<meta name="description" content="${data.name} — Bengkel profesional. Rating ${data.rating}/5 dari ${data.reviews} review.">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif}h1,h2,.brand{font-family:'Oswald',sans-serif}.accent{color:#f59e0b}.bg-accent{background:#f59e0b}.hero-bg{background:linear-gradient(135deg,#0c0c0c 0%,#1c1917 50%,#0c0c0c 100%)}</style>
</head><body class="bg-[#0c0c0c] text-white">

<section class="hero-bg min-h-screen flex flex-col justify-center px-6 py-12">
  <div class="max-w-lg mx-auto text-center">
    <div class="text-6xl mb-4">🔧</div>
    <p class="accent text-xs tracking-[4px] mb-2">BENGKEL PROFESIONAL</p>
    <h1 class="text-4xl md:text-5xl font-bold mb-4 uppercase">${data.name}</h1>
    <p class="text-white/50 text-sm mb-8">Solusi terbaik untuk kendaraan Anda</p>
    <div class="flex justify-center gap-4 mb-8">
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold accent">${data.rating}</div><div class="text-[10px] text-white/40">⭐ RATING</div></div>
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold">${data.reviews.toLocaleString()}</div><div class="text-[10px] text-white/40">REVIEW</div></div>
    </div>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-accent text-black px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all"><i class="fab fa-whatsapp text-xl"></i>KONSULTASI GRATIS</a>
  </div>
</section>

<section class="py-16 px-6 bg-[#0c0c0c]">
  <div class="max-w-lg mx-auto">
    <h2 class="text-3xl text-center mb-8 uppercase">Layanan</h2>
    <div class="grid grid-cols-2 gap-3">
      ${[{n:'Service Rutin',p:'Rp 150.000',e:'🛠️'},{n:'Ganti Oli',p:'Rp 80.000',e:'🛢️'},{n:'Tune Up Mesin',p:'Rp 250.000',e:'⚙️'},{n:'AC & Kelistrikan',p:'Rp 200.000',e:'⚡'},{n:'Rem & Suspensi',p:'Rp 300.000',e:'🔩'},{n:'Body Repair',p:'Rp 500.000+',e:'🚗'}].map(s=>`<div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center"><div class="text-2xl mb-2">${s.e}</div><div class="text-sm font-bold mb-1">${s.n}</div><div class="accent text-sm font-bold">${s.p}</div></div>`).join('')}
    </div>
  </div>
</section>

<section class="py-16 px-6 bg-[#1c1917]">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl mb-6 uppercase">Lokasi</h2>
    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"><i class="fas fa-map-marker-alt accent text-2xl mb-3"></i><p class="text-white/70 text-sm">${data.address}</p></div>
    <div class="flex gap-3 justify-center">
      <a href="${data.mapsLink}" target="_blank" class="bg-white/10 px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-all"><i class="fas fa-directions mr-2"></i>Maps</a>
      <a href="tel:${data.phone.replace(/[^0-9+]/g,'')}" class="bg-white/10 px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-all"><i class="fas fa-phone mr-2"></i>Telepon</a>
    </div>
  </div>
</section>

<section class="py-16 px-6 hero-bg">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl mb-4 uppercase">Booking Service</h2>
    <p class="text-white/50 text-sm mb-6">Chat langsung untuk jadwalkan service Anda</p>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-accent text-black px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all"><i class="fab fa-whatsapp text-xl"></i>BOOKING SEKARANG</a>
  </div>
</section>

<footer class="py-6 px-6 bg-[#0c0c0c] text-center"><p class="text-white/20 text-xs">${data.name} &copy; 2026 | Sovereign Digital</p></footer>
</body></html>`
}
