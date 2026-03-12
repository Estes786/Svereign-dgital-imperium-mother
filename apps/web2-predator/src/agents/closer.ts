// ============================================================
// SOVEREIGN PREDATOR SUITE - Closer Agent (The WhatsApp Assassin)
// Session 004: AI-powered personalized WA message generator
// ============================================================

import type { ScoredLead } from './scout'

export interface WAMessage {
  id: string
  lead_id: string
  business_name: string
  phone: string
  message_text: string
  message_type: 'initial' | 'follow_up' | 'closing' | 'demo_offer'
  wa_deeplink: string
  created_at: string
}

// Message templates by approach type
const MESSAGE_TEMPLATES = {
  initial: {
    no_website: [
      `Halo {owner}! Saya perhatikan {business} punya rating {rating}⭐ di Google Maps dengan {reviews} review, tapi belum punya website sendiri. Saya bisa buatkan website profesional + sistem booking online GRATIS untuk demo. Kalau hasilnya bagus, harga spesial Rp 150rb aja/bulan. Mau coba? 🚀`,
      `Assalamualaikum {owner}! {business} sudah terkenal ya ({reviews} review di Google). Sayang banget belum ada website. Saya spesialis bikin website untuk {category}. Demo GRATIS dulu, kalau cocok baru bayar. Minat? 😊`,
      `Halo {owner}! Setiap hari ada {reviews}+ orang cari {category} di Google Maps area Anda. {business} belum punya website, jadi banyak calon pelanggan yang gak nemu info lengkap. Mau saya buatkan? Demo GRATIS! 💡`
    ],
    has_website: [
      `Halo {owner}! Saya lihat {business} sudah punya website, tapi bisa di-upgrade lagi biar lebih modern + ada fitur booking online otomatis. Gratis konsultasi, mau saya buatkan proposal? 📱`,
      `Halo {owner}! Website {business} bisa ditingkatkan lagi performanya. Saya bisa tambahkan booking system + menu online yang bikin pelanggan lebih mudah order. Demo GRATIS! 🔧`
    ]
  },
  follow_up: [
    `Halo {owner}, gimana kabarnya? Kemarin saya chat soal website {business}. Masih minat gak? Saya bisa kasih demo minggu ini 😊`,
    `{owner}, demo website {business} sudah siap nih! Mau saya kirim linknya? Gratis loh, tinggal cek aja 🎯`
  ],
  closing: [
    `{owner}, demo website {business} sudah jadi! Cek di sini: {demo_url}. Kalau cocok, harga spesial bulan ini cuma Rp {price} aja. Deal? 🤝`,
    `Pak/Bu {owner}, website demo {business} udah live! Link: {demo_url}. Diskon khusus hari ini Rp {price}. Mau aktifkan sekarang? ✅`
  ],
  demo_offer: [
    `{owner}! Website demo {business} SUDAH JADI 🎉 Cek sekarang: {demo_url} — Landing page profesional untuk {category} Anda. Kalau suka, paket lengkap cuma Rp {price}/bulan. Gimana? 💪`
  ]
}

// Generate personalized WA message for a lead
export function generateWAMessage(
  lead: ScoredLead,
  messageType: 'initial' | 'follow_up' | 'closing' | 'demo_offer' = 'initial',
  demoUrl?: string,
  price: number = 150000
): WAMessage {
  const owner = lead.owner_name || 'Bos'
  const hasWebsite = lead.digital_gap_analysis?.has_website || !!lead.website_url

  let templates: string[]

  switch (messageType) {
    case 'initial':
      templates = hasWebsite
        ? MESSAGE_TEMPLATES.initial.has_website
        : MESSAGE_TEMPLATES.initial.no_website
      break
    case 'follow_up':
      templates = MESSAGE_TEMPLATES.follow_up
      break
    case 'closing':
      templates = MESSAGE_TEMPLATES.closing
      break
    case 'demo_offer':
      templates = MESSAGE_TEMPLATES.demo_offer
      break
    default:
      templates = MESSAGE_TEMPLATES.initial.no_website
  }

  // Random template selection
  const template = templates[Math.floor(Math.random() * templates.length)]

  // Fill placeholders
  const messageText = template
    .replace(/\{owner\}/g, owner)
    .replace(/\{business\}/g, lead.business_name)
    .replace(/\{category\}/g, lead.category)
    .replace(/\{rating\}/g, String(lead.rating || '4.0'))
    .replace(/\{reviews\}/g, String(lead.review_count || '50'))
    .replace(/\{demo_url\}/g, demoUrl || '[demo-link]')
    .replace(/\{price\}/g, price.toLocaleString('id-ID'))

  // Clean phone number for WA deeplink
  let cleanPhone = (lead.phone || '').replace(/[^0-9+]/g, '')
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1)
  }
  if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone
  }
  cleanPhone = cleanPhone.replace('+', '')

  const waDeeplink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`

  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    lead_id: lead.id,
    business_name: lead.business_name,
    phone: lead.phone || 'unknown',
    message_text: messageText,
    message_type: messageType,
    wa_deeplink: waDeeplink,
    created_at: new Date().toISOString()
  }
}

// Generate AI-powered message using Groq
export async function generateAIMessage(
  lead: ScoredLead,
  messageType: string,
  groqApiKey: string
): Promise<WAMessage> {
  try {
    const prompt = `Kamu adalah copywriter untuk jasa pembuatan website UMKM Indonesia.
Buat pesan WhatsApp untuk menghubungi pemilik bisnis ini:

Bisnis: ${lead.business_name}
Kategori: ${lead.category}
Alamat: ${lead.address}
Rating: ${lead.rating}/5 (${lead.review_count} review)
Punya Website: ${lead.website_url ? 'Ya - ' + lead.website_url : 'TIDAK'}
AI Score: ${lead.ai_score}/100
Digital Gap: ${lead.digital_gap_analysis?.summary || 'Butuh kehadiran digital'}
Approach: ${lead.recommended_approach}

Tipe pesan: ${messageType}

ATURAN:
- Bahasa Indonesia casual tapi sopan
- Maksimal 3 kalimat
- Sebutkan nama bisnis
- Highlight benefit (bukan fitur)
- Ada call-to-action yang jelas
- Gunakan emoji secukupnya (2-3 max)
- Tawarkan GRATIS demo
- Harga mulai Rp 150.000/bulan

Tulis HANYA pesan WhatsApp-nya, tidak ada penjelasan lain.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Kamu copywriter WhatsApp untuk jasa website UMKM Indonesia. Tulis pesan pendek, sopan, persuasif.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data: any = await response.json()
    const messageText = data.choices?.[0]?.message?.content?.trim() || ''

    if (!messageText) {
      throw new Error('Empty response from Groq')
    }

    // Build WA deeplink
    let cleanPhone = (lead.phone || '').replace(/[^0-9+]/g, '')
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1)
    if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone
    cleanPhone = cleanPhone.replace('+', '')

    return {
      id: `msg-ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      lead_id: lead.id,
      business_name: lead.business_name,
      phone: lead.phone || 'unknown',
      message_text: messageText,
      message_type: messageType as any,
      wa_deeplink: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`,
      created_at: new Date().toISOString()
    }
  } catch (error: any) {
    // Fallback to template
    return generateWAMessage(lead, messageType as any)
  }
}

// Batch generate messages for multiple leads
export function batchGenerateMessages(
  leads: ScoredLead[],
  messageType: 'initial' | 'follow_up' | 'closing' | 'demo_offer' = 'initial'
): WAMessage[] {
  return leads
    .filter(l => l.ai_score >= 60) // Only message leads with score >= 60
    .map(lead => generateWAMessage(lead, messageType))
}
