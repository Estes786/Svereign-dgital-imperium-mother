// ============================================================
// TEMPLATE: Cafe & Restaurant — Warm cozy theme
// ============================================================
export function cafeTemplate(data: {
  name: string; address: string; phone: string; rating: number;
  reviews: number; waLink: string; mapsLink: string; thumbnail?: string;
}): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.name} — Cafe & Restaurant</title>
<meta name="description" content="${data.name} — Rating ${data.rating}/5 dari ${data.reviews} review. Pesan sekarang!">
<meta property="og:title" content="${data.name}"><meta property="og:description" content="Cafe terbaik. Rating ${data.rating}/5">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif}h1,h2,.brand{font-family:'Playfair Display',serif}.warm{color:#c8956c}.bg-warm{background:#c8956c}.hero-bg{background:linear-gradient(135deg,#1a0e08 0%,#2d1810 50%,#1a0e08 100%)}</style>
</head><body class="bg-[#0f0a07] text-white">

<section class="hero-bg min-h-screen flex flex-col justify-center px-6 py-12">
  <div class="max-w-lg mx-auto text-center">
    <div class="text-6xl mb-4">☕</div>
    <p class="warm text-sm tracking-[4px] mb-2">WELCOME TO</p>
    <h1 class="text-4xl md:text-5xl font-bold mb-4">${data.name}</h1>
    <p class="text-white/50 text-sm mb-8 max-w-sm mx-auto">Nikmati suasana nyaman dan menu terbaik kami. Buka setiap hari untuk Anda.</p>
    <div class="flex justify-center gap-4 mb-8">
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold warm">${data.rating}</div><div class="text-[10px] text-white/40">⭐ RATING</div></div>
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold">${data.reviews.toLocaleString()}</div><div class="text-[10px] text-white/40">REVIEW</div></div>
    </div>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-warm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-orange-900/30"><i class="fab fa-whatsapp text-xl"></i>PESAN SEKARANG</a>
  </div>
</section>

<section class="py-16 px-6 bg-[#0f0a07]">
  <div class="max-w-lg mx-auto">
    <h2 class="text-3xl text-center mb-2">Menu Favorit</h2>
    <p class="text-white/40 text-sm text-center mb-8">Pilihan terbaik dari dapur kami</p>
    <div class="grid grid-cols-2 gap-3">
      ${[{n:'Nasi Goreng Spesial',p:'Rp 25.000',e:'🍳'},{n:'Mie Goreng',p:'Rp 22.000',e:'🍜'},{n:'Ayam Bakar',p:'Rp 30.000',e:'🍗'},{n:'Es Kopi Susu',p:'Rp 18.000',e:'☕'},{n:'Smoothie Bowl',p:'Rp 28.000',e:'🥤'},{n:'Pancake Stack',p:'Rp 25.000',e:'🥞'}].map(m=>`<div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center"><div class="text-2xl mb-2">${m.e}</div><div class="text-sm font-bold mb-1">${m.n}</div><div class="warm text-sm font-bold">${m.p}</div></div>`).join('')}
    </div>
    <p class="text-center text-white/30 text-xs mt-4">* Harga dapat berubah sewaktu-waktu</p>
  </div>
</section>

<section class="py-16 px-6 bg-[#1a0e08]">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl mb-6">Lokasi Kami</h2>
    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"><i class="fas fa-map-marker-alt warm text-2xl mb-3"></i><p class="text-white/70 text-sm">${data.address}</p></div>
    <div class="flex gap-3 justify-center">
      <a href="${data.mapsLink}" target="_blank" class="bg-white/10 px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-all"><i class="fas fa-directions mr-2"></i>Maps</a>
      <a href="tel:${data.phone.replace(/[^0-9+]/g,'')}" class="bg-white/10 px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-all"><i class="fas fa-phone mr-2"></i>Telepon</a>
    </div>
  </div>
</section>

<section class="py-16 px-6 hero-bg">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl mb-4">Pesan via WhatsApp</h2>
    <p class="text-white/50 text-sm mb-6">Pesan langsung, antar atau dine-in!</p>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-warm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all"><i class="fab fa-whatsapp text-xl"></i>ORDER SEKARANG</a>
  </div>
</section>

<footer class="py-6 px-6 bg-[#0f0a07] text-center"><p class="text-white/20 text-xs">${data.name} &copy; 2026 | Sovereign Digital</p></footer>
</body></html>`
}
