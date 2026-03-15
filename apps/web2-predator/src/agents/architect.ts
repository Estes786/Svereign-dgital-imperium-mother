// ============================================================
// SOVEREIGN PREDATOR SUITE - Architect Agent (Ghost Web Builder)
// Session 005: Instant website generation from lead data
// ============================================================

import { barberTemplate } from '../templates/barber'
import { cafeTemplate } from '../templates/cafe'
import { salonTemplate } from '../templates/salon'
import { workshopTemplate } from '../templates/workshop'
import { genericTemplate } from '../templates/generic'

export interface DemoSite {
  id: string
  lead_id: string | number
  business_name: string
  category: string
  template_type: string
  html: string
  created_at: string
  views: number
  status: 'active' | 'sent' | 'viewed' | 'converted'
}

// In-memory demo store (per worker instance)
const demos: Map<string, DemoSite> = new Map()

// Category to template mapping
const CATEGORY_MAP: Record<string, string> = {
  'barber shop': 'barber',
  'barber': 'barber',
  'cafe': 'cafe',
  'restoran': 'cafe',
  'restaurant': 'cafe',
  'cafe restaurant': 'cafe',
  'salon kecantikan': 'salon',
  'salon': 'salon',
  'beauty': 'salon',
  'nail art': 'salon',
  'bengkel mobil': 'workshop',
  'bengkel': 'workshop',
  'workshop': 'workshop',
  'bengkel mobil motor': 'workshop',
}

function resolveTemplate(category: string): string {
  const lower = category.toLowerCase()
  return CATEGORY_MAP[lower] || 'generic'
}

function cleanPhone(phone: string): string {
  let p = (phone || '').replace(/[^0-9+]/g, '')
  if (p.startsWith('0')) p = '62' + p.slice(1)
  if (!p.startsWith('+') && !p.startsWith('62')) p = '62' + p
  return p.replace('+', '')
}

// Generate website HTML from lead data
export function generateWebsite(lead: {
  id: string | number
  business_name: string
  category: string
  address: string
  phone: string
  rating: number
  review_count: number
  website_url?: string | null
  google_maps_url?: string
  thumbnail?: string | null
}, templateOverride?: string): DemoSite {
  const tplType = templateOverride || resolveTemplate(lead.category)
  const phone = cleanPhone(lead.phone)
  const waText = encodeURIComponent(
    `Halo, saya tertarik dengan layanan ${lead.business_name}. Bisa info lebih lanjut?`
  )
  const waLink = `https://wa.me/${phone}?text=${waText}`
  const mapsLink = lead.google_maps_url || `https://www.google.com/maps/search/${encodeURIComponent(lead.business_name + ' ' + lead.address)}`

  const data = {
    name: lead.business_name,
    address: lead.address,
    phone: lead.phone || '',
    rating: lead.rating || 4.0,
    reviews: lead.review_count || 0,
    waLink,
    mapsLink,
    thumbnail: lead.thumbnail || undefined,
    category: lead.category,
  }

  let html: string
  switch (tplType) {
    case 'barber': html = barberTemplate(data); break
    case 'cafe': html = cafeTemplate(data); break
    case 'salon': html = salonTemplate(data); break
    case 'workshop': html = workshopTemplate(data); break
    default: html = genericTemplate(data); break
  }

  const demoId = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

  const demo: DemoSite = {
    id: demoId,
    lead_id: String(lead.id),
    business_name: lead.business_name,
    category: lead.category,
    template_type: tplType,
    html,
    created_at: new Date().toISOString(),
    views: 0,
    status: 'active',
  }

  demos.set(demoId, demo)
  return demo
}

// Get demo by ID
export function getDemo(id: string): DemoSite | undefined {
  return demos.get(id)
}

// Track a view
export function trackView(id: string): boolean {
  const demo = demos.get(id)
  if (demo) {
    demo.views++
    if (demo.status === 'sent') demo.status = 'viewed'
    return true
  }
  return false
}

// Update demo status
export function updateDemoStatus(id: string, status: DemoSite['status']): boolean {
  const demo = demos.get(id)
  if (demo) { demo.status = status; return true }
  return false
}

// List all demos
export function listDemos(): DemoSite[] {
  return Array.from(demos.values()).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

// Get available templates
export function getTemplates() {
  return [
    { id: 'barber', name: 'Barber Shop', emoji: '💈', color: '#d4a574', desc: 'Dark bold theme' },
    { id: 'cafe', name: 'Cafe & Restaurant', emoji: '☕', color: '#c8956c', desc: 'Warm cozy theme' },
    { id: 'salon', name: 'Salon & Beauty', emoji: '💅', color: '#d4a0a0', desc: 'Elegant rose theme' },
    { id: 'workshop', name: 'Bengkel', emoji: '🔧', color: '#f59e0b', desc: 'Industrial clean theme' },
    { id: 'generic', name: 'Generic UMKM', emoji: '🏪', color: '#6366f1', desc: 'Modern universal theme' },
  ]
}
