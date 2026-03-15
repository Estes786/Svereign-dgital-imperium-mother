// ============================================================
// TEMPLATE: Generic UMKM — Clean modern theme
// ============================================================
export function genericTemplate(data: {
  name: string; address: string; phone: string; rating: number;
  reviews: number; waLink: string; mapsLink: string; thumbnail?: string; category?: string;
}): string {
  const cat = data.category || 'Bisnis';
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.name}</title>
<meta name="description" content="${data.name} — ${cat} terpercaya. Rating ${data.rating}/5.">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
<style>body{font-family:'Plus Jakarta Sans',sans-serif}.accent{color:#6366f1}.bg-accent{background:#6366f1}.hero-bg{background:linear-gradient(135deg,#0f0f23 0%,#1a1a3e 50%,#0f0f23 100%)}</style>
</head><body class="bg-[#0a0a1a] text-white">

<section class="hero-bg min-h-screen flex flex-col justify-center px-6 py-12">
  <div class="max-w-lg mx-auto text-center">
    <div class="text-6xl mb-4">🏪</div>
    <p class="accent text-xs tracking-[4px] mb-2 uppercase">${cat}</p>
    <h1 class="text-4xl md:text-5xl font-extrabold mb-4">${data.name}</h1>
    <p class="text-white/50 text-sm mb-8">Pelayanan terbaik untuk Anda</p>
    <div class="flex justify-center gap-4 mb-8">
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold accent">${data.rating}</div><div class="text-[10px] text-white/40">⭐ RATING</div></div>
      <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"><div class="text-2xl font-bold">${data.reviews.toLocaleString()}</div><div class="text-[10px] text-white/40">REVIEW</div></div>
    </div>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-900/40"><i class="fab fa-whatsapp text-xl"></i>HUBUNGI KAMI</a>
  </div>
</section>

<section class="py-16 px-6 bg-[#0a0a1a]">
  <div class="max-w-lg mx-auto">
    <h2 class="text-3xl text-center font-bold mb-8">Kenapa Pilih Kami?</h2>
    <div class="grid grid-cols-2 gap-3">
      ${[{t:'Profesional',d:'Layanan berkualitas tinggi',i:'fa-award'},{t:'Terpercaya',d:'Rating ${data.rating}/5 dari pelanggan',i:'fa-star'},{t:'Harga Fair',d:'Harga terjangkau, kualitas terjamin',i:'fa-tags'},{t:'Lokasi Mudah',d:'Mudah dijangkau',i:'fa-location-dot'}].map(f=>`<div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center"><i class="fas ${f.i} accent text-xl mb-2"></i><div class="text-sm font-bold mb-1">${f.t}</div><div class="text-white/40 text-xs">${f.d}</div></div>`).join('')}
    </div>
  </div>
</section>

<section class="py-16 px-6 bg-[#12122a]">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl font-bold mb-6">Lokasi</h2>
    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"><i class="fas fa-map-marker-alt accent text-2xl mb-3"></i><p class="text-white/70 text-sm">${data.address}</p></div>
    <div class="flex gap-3 justify-center">
      <a href="${data.mapsLink}" target="_blank" class="bg-white/10 px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-all"><i class="fas fa-directions mr-2"></i>Maps</a>
      <a href="tel:${data.phone.replace(/[^0-9+]/g,'')}" class="bg-white/10 px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-all"><i class="fas fa-phone mr-2"></i>Telepon</a>
    </div>
  </div>
</section>

<section class="py-16 px-6 hero-bg">
  <div class="max-w-lg mx-auto text-center">
    <h2 class="text-3xl font-bold mb-4">Hubungi Kami</h2>
    <p class="text-white/50 text-sm mb-6">Chat langsung via WhatsApp untuk info lebih lanjut</p>
    <a href="${data.waLink}" target="_blank" class="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all"><i class="fab fa-whatsapp text-xl"></i>CHAT WHATSAPP</a>
  </div>
</section>

<footer class="py-6 px-6 bg-[#0a0a1a] text-center"><p class="text-white/20 text-xs">${data.name} &copy; 2026 | Sovereign Digital</p></footer>
</body></html>`
}
