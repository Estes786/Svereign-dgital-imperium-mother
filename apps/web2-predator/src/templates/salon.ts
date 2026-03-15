// ============================================================
// TEMPLATE: Salon & Beauty — Elegant rose theme
// ============================================================
export function salonTemplate(data: {
  name: string; address: string; phone: string; rating: number;
  reviews: number; waLink: string; mapsLink: string; thumbnail?: string;
}): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.name} — Salon & Beauty</title>
<meta name="description" content="${data.name} — Salon kecantikan terpercaya. Rating ${data.rating}/5.">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif}h1,h2,.brand{font-family:'Cormorant Garamond',serif}.rose{color:#d4a0a0}.bg-rose{background:#d4a0a0}.hero-bg{background:linear-gradient(135deg,#1a0f14 0%,#2d1520 50%,#1a0f14 100%)}</style>
</head><body class="bg-[#0f0a0c] text-white">

<section class="hero-bg min-h-screen flex flex-col justify-center px-6 py-12">
  <div class="max-w-lg mx-auto text-center">
    <div class="text-6xl mb-4">💅</div>
    <p class="rose text-xs tracking-[6px] mb-3">BEAUTY & WELLNESS</p>
    <h1 class="text-4xl md:text-5xl font-bold mb-4">${data.name}</h1>
    <p class="text-white/50 text-sm mb-8">Tampil cantik & percaya diri setiap hari</p>
    <div class="flex justify-center gap-4 mb-8">
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold rose">${data.rating}</div><div class="text-[10px] text-white/40">⭐ RATING</div></div>
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold">${data.reviews.toLocaleString()}</div><div class="text-[10px] text-white/40">REVIEW</div></div>
    </div>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-rose text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-pink-900/30"><i class="fab fa-whatsapp text-xl"></i>BOOKING SEKARANG</a>
  </div>
</section>

<section class="py-16 px-6 bg-[#0f0a0c]">
  <div class="max-w-lg mx-auto">
    <h2 class="text-3xl text-center mb-8">Layanan Kami</h2>
    <div class="space-y-3">
      ${[{n:'Hair Styling & Blow',p:'Rp 75.000',i:'fa-cut'},{n:'Manicure & Pedicure',p:'Rp 85.000',i:'fa-hand-sparkles'},{n:'Facial Treatment',p:'Rp 120.000',i:'fa-spa'},{n:'Hair Coloring',p:'Rp 150.000',i:'fa-palette'},{n:'Creambath & Spa',p:'Rp 100.000',i:'fa-water'},{n:'Makeup Profesional',p:'Rp 200.000',i:'fa-magic'}].map(s=>`<div class="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-5 py-4"><div class="flex items-center gap-3"><i class="fas ${s.i} rose w-5 text-center"></i><span class="text-sm">${s.n}</span></div><span class="rose font-bold text-sm">${s.p}</span></div>`).join('')}
    </div>
  </div>
</section>

<section class="py-16 px-6 bg-[#1a0f14]">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl mb-6">Kunjungi Kami</h2>
    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"><i class="fas fa-map-marker-alt rose text-2xl mb-3"></i><p class="text-white/70 text-sm">${data.address}</p></div>
    <div class="flex gap-3 justify-center">
      <a href="${data.mapsLink}" target="_blank" class="bg-white/10 px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-all"><i class="fas fa-directions mr-2"></i>Maps</a>
      <a href="tel:${data.phone.replace(/[^0-9+]/g,'')}" class="bg-white/10 px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-all"><i class="fas fa-phone mr-2"></i>Telepon</a>
    </div>
  </div>
</section>

<section class="py-16 px-6 hero-bg">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl mb-4">Book Appointment</h2>
    <p class="text-white/50 text-sm mb-6">Chat langsung untuk booking jadwal Anda</p>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-rose text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all"><i class="fab fa-whatsapp text-xl"></i>BOOKING VIA WA</a>
  </div>
</section>

<footer class="py-6 px-6 bg-[#0f0a0c] text-center"><p class="text-white/20 text-xs">${data.name} &copy; 2026 | Sovereign Digital</p></footer>
</body></html>`
}
