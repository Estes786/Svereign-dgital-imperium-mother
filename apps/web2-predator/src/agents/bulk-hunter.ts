// ============================================================
// SOVEREIGN PREDATOR SUITE - Bulk Hunter Agent
// Session 004: Multi-city, multi-category automated hunting
// Auto-save to Supabase after each city
// ============================================================

import { scoutWorkflow, type ScoredLead } from './scout'

export interface HuntMission {
  cities: string[]
  categories: string[]
  limit_per_hunt: number
}

export interface BulkHuntResult {
  mission_id: string
  total_leads: number
  total_saved: number
  cities_completed: number
  cities_total: number
  hunts_completed: number
  hunts_total: number
  results_by_city: Record<string, {
    leads: number
    saved: number
    categories: Record<string, number>
    top_score: number
  }>
  all_leads: ScoredLead[]
  errors: string[]
  started_at: string
  completed_at: string | null
  status: 'running' | 'complete' | 'error'
}

// Global bulk hunt status
let currentBulkHunt: BulkHuntResult | null = null

export function getBulkHuntStatus(): BulkHuntResult | null {
  return currentBulkHunt ? { ...currentBulkHunt } : null
}

// Default hunt targets: Top Indonesian cities with high UMKM density
export const DEFAULT_HUNT_CITIES = [
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Jakarta Barat',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Semarang',
  'Malang',
  'Bali Denpasar',
  'Medan',
  'Makassar',
  'Bekasi',
  'Tangerang',
  'Depok',
  'Bogor'
]

export const DEFAULT_HUNT_CATEGORIES = [
  'barber shop',
  'salon kecantikan',
  'cafe',
  'restoran',
  'bengkel mobil',
  'klinik gigi',
  'gym fitness',
  'laundry',
  'toko bunga',
  'pet shop'
]

// Save leads to Supabase via REST
async function saveLeadsToSupabase(
  leads: ScoredLead[],
  supabaseUrl: string,
  serviceRoleKey: string
): Promise<number> {
  if (!leads.length) return 0

  const rows = leads.map((l) => ({
    business_name: l.business_name,
    category: l.category,
    address: l.address,
    phone: l.phone,
    owner_name: l.owner_name,
    rating: l.rating,
    review_count: l.review_count,
    website_url: l.website_url,
    google_maps_url: l.google_maps_url,
    thumbnail: l.thumbnail,
    ai_score: l.ai_score,
    digital_gap_score: l.digital_gap_score,
    digital_gap_analysis: l.digital_gap_analysis,
    recommended_approach: l.recommended_approach,
    status: l.status || 'new',
    source: l.source || 'scout_agent'
  }))

  const res = await fetch(`${supabaseUrl}/rest/v1/hunting_leads`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(rows)
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase save error: ${res.status} - ${err}`)
  }

  const saved: any[] = await res.json()
  return saved.length
}

// ============================================================
// BULK HUNT WORKFLOW
// ============================================================
export async function bulkHuntWorkflow(
  mission: HuntMission,
  serpApiKey: string,
  groqApiKey: string,
  supabaseUrl: string,
  serviceRoleKey: string
): Promise<BulkHuntResult> {
  const missionId = `bulk-${Date.now()}`
  const totalHunts = mission.cities.length * mission.categories.length

  currentBulkHunt = {
    mission_id: missionId,
    total_leads: 0,
    total_saved: 0,
    cities_completed: 0,
    cities_total: mission.cities.length,
    hunts_completed: 0,
    hunts_total: totalHunts,
    results_by_city: {},
    all_leads: [],
    errors: [],
    started_at: new Date().toISOString(),
    completed_at: null,
    status: 'running'
  }

  try {
    for (let ci = 0; ci < mission.cities.length; ci++) {
      const city = mission.cities[ci]
      const cityResult: BulkHuntResult['results_by_city'][string] = {
        leads: 0,
        saved: 0,
        categories: {},
        top_score: 0
      }

      for (let ki = 0; ki < mission.categories.length; ki++) {
        const category = mission.categories[ki]

        try {
          // Run scout workflow for this city + category
          const leads = await scoutWorkflow(
            city,
            category,
            mission.limit_per_hunt,
            serpApiKey,
            groqApiKey
          )

          if (leads.length > 0) {
            // Auto-save to Supabase
            let savedCount = 0
            try {
              savedCount = await saveLeadsToSupabase(leads, supabaseUrl, serviceRoleKey)
            } catch (saveErr: any) {
              currentBulkHunt.errors.push(`Save error [${city}/${category}]: ${saveErr.message}`)
            }

            cityResult.leads += leads.length
            cityResult.saved += savedCount
            cityResult.categories[category] = leads.length
            cityResult.top_score = Math.max(cityResult.top_score, leads[0]?.ai_score || 0)

            currentBulkHunt.total_leads += leads.length
            currentBulkHunt.total_saved += savedCount
            currentBulkHunt.all_leads = [...currentBulkHunt.all_leads, ...leads]
          }

          currentBulkHunt.hunts_completed++

          // Delay between hunts to respect rate limits (SerpAPI & Groq)
          if (ki < mission.categories.length - 1 || ci < mission.cities.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500))
          }
        } catch (huntErr: any) {
          currentBulkHunt.errors.push(`Hunt error [${city}/${category}]: ${huntErr.message}`)
          currentBulkHunt.hunts_completed++
          // Continue to next hunt even on error
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      currentBulkHunt.results_by_city[city] = cityResult
      currentBulkHunt.cities_completed++
    }

    currentBulkHunt.status = 'complete'
    currentBulkHunt.completed_at = new Date().toISOString()

    // Sort all leads by AI score
    currentBulkHunt.all_leads.sort((a, b) => b.ai_score - a.ai_score)

    return currentBulkHunt
  } catch (error: any) {
    if (currentBulkHunt) {
      currentBulkHunt.status = 'error'
      currentBulkHunt.errors.push(`Fatal: ${error.message}`)
      currentBulkHunt.completed_at = new Date().toISOString()
    }
    throw error
  }
}
