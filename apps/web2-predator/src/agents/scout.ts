// ============================================================
// SOVEREIGN PREDATOR SUITE - Scout Agent (The Hunter)
// Phase 3: SerpAPI + Groq AI Lead Scoring
// ============================================================

// Types
export interface RawBusiness {
  position: number
  title: string
  address: string
  phone?: string
  rating?: number
  reviews?: number
  website?: string
  type?: string
  place_id?: string
  gps_coordinates?: { latitude: number; longitude: number }
  thumbnail?: string
  google_maps_url?: string
  operating_hours?: string
}

export interface ScoredLead {
  id: string
  business_name: string
  category: string
  address: string
  phone: string
  owner_name: string
  rating: number
  review_count: number
  website_url: string | null
  google_maps_url: string
  thumbnail: string | null
  ai_score: number
  digital_gap_score: number
  digital_gap_analysis: {
    has_website: boolean
    has_booking: boolean
    social_active: boolean
    needs: string[]
    summary: string
  }
  recommended_approach: string
  status: string
  source: string
  created_at: string
}

export interface ScoutStatus {
  state: 'idle' | 'hunting' | 'scoring' | 'complete' | 'error'
  current_step: string
  progress: number
  total: number
  results_count: number
  last_error: string | null
  last_run: string | null
}

// Global scout status (in-memory per worker instance)
let scoutStatus: ScoutStatus = {
  state: 'idle',
  current_step: 'Awaiting orders...',
  progress: 0,
  total: 0,
  results_count: 0,
  last_error: null,
  last_run: null
}

// Cached results from last hunt
let lastHuntResults: ScoredLead[] = []

export function getScoutStatus(): ScoutStatus {
  return { ...scoutStatus }
}

export function getLastHuntResults(): ScoredLead[] {
  return [...lastHuntResults]
}

function updateStatus(updates: Partial<ScoutStatus>) {
  scoutStatus = { ...scoutStatus, ...updates }
}

// ============================================================
// SERPAPI - Google Maps Search
// ============================================================
export async function searchBusinesses(
  area: string,
  category: string,
  limit: number,
  serpApiKey: string
): Promise<RawBusiness[]> {
  updateStatus({
    state: 'hunting',
    current_step: `Scanning Google Maps for ${category} in ${area}...`,
    progress: 0,
    total: limit
  })

  try {
    const query = `${category} ${area}`
    const url = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=${limit}&hl=id`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`SerpAPI Error ${response.status}: ${errorText}`)
    }

    const data: any = await response.json()

    if (data.error) {
      throw new Error(`SerpAPI: ${data.error}`)
    }

    const results: RawBusiness[] = (data.local_results || []).slice(0, limit).map((r: any, i: number) => ({
      position: i + 1,
      title: r.title || 'Unknown Business',
      address: r.address || r.formatted_address || 'No address',
      phone: r.phone || null,
      rating: r.rating || 0,
      reviews: r.reviews || 0,
      website: r.website || null,
      type: r.type || category,
      place_id: r.place_id || null,
      gps_coordinates: r.gps_coordinates || null,
      thumbnail: r.thumbnail || null,
      google_maps_url: r.link || r.place_id_search || `https://www.google.com/maps/search/${encodeURIComponent(r.title + ' ' + area)}`,
      operating_hours: r.operating_hours?.state_description || null
    }))

    updateStatus({
      current_step: `Found ${results.length} businesses! Preparing for AI scoring...`,
      progress: results.length,
      total: results.length
    })

    return results
  } catch (error: any) {
    updateStatus({
      state: 'error',
      current_step: `Search failed: ${error.message}`,
      last_error: error.message
    })
    throw error
  }
}

// ============================================================
// GROQ AI - Lead Scoring with Llama 3.3 70B
// ============================================================
export async function scoreLeadWithAI(
  business: RawBusiness,
  category: string,
  groqApiKey: string
): Promise<{
  ai_score: number
  digital_gap_score: number
  digital_gap_analysis: {
    has_website: boolean
    has_booking: boolean
    social_active: boolean
    needs: string[]
    summary: string
  }
  recommended_approach: string
}> {
  try {
    const prompt = `You are a digital marketing analyst for Indonesian UMKM businesses.
Analyze this business and score its potential as a client for a web development service.

Business Data:
- Name: ${business.title}
- Category: ${category}
- Address: ${business.address}
- Rating: ${business.rating || 'N/A'}/5
- Reviews: ${business.reviews || 0}
- Has Website: ${business.website ? 'Yes - ' + business.website : 'NO'}
- Phone: ${business.phone || 'N/A'}
- Operating Hours: ${business.operating_hours || 'N/A'}

Score the business on TWO dimensions:
1. **ai_score** (0-100): Overall client potential. Consider: no website = high score, low digital presence = high score, good rating + reviews = high score, popular business with no online presence = very high score.
2. **digital_gap_score** (0-100): How big is their digital gap. No website = 90+, old/bad website = 60-80, modern website = 10-30.

Also analyze:
- has_website: boolean (do they have any website?)
- has_booking: boolean (do they likely have online booking?)
- social_active: boolean (are they likely active on social media based on reviews?)
- needs: array of strings listing what digital services they need
- summary: one sentence summary of their digital gap in Bahasa Indonesia
- recommended_approach: strategy to approach this business in Bahasa Indonesia (max 2 sentences)

RESPOND IN VALID JSON ONLY, no markdown:
{"ai_score":NUMBER,"digital_gap_score":NUMBER,"digital_gap_analysis":{"has_website":BOOL,"has_booking":BOOL,"social_active":BOOL,"needs":["NEED1","NEED2"],"summary":"TEXT"},"recommended_approach":"TEXT"}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a JSON-only response bot. Never include markdown formatting, code blocks, or explanatory text. Only output valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Groq API Error ${response.status}: ${errorText}`)
    }

    const data: any = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('Empty response from Groq AI')
    }

    // Parse JSON response
    const parsed = JSON.parse(content)

    return {
      ai_score: Math.min(100, Math.max(0, parsed.ai_score || 50)),
      digital_gap_score: Math.min(100, Math.max(0, parsed.digital_gap_score || 50)),
      digital_gap_analysis: {
        has_website: !!parsed.digital_gap_analysis?.has_website,
        has_booking: !!parsed.digital_gap_analysis?.has_booking,
        social_active: !!parsed.digital_gap_analysis?.social_active,
        needs: parsed.digital_gap_analysis?.needs || ['website'],
        summary: parsed.digital_gap_analysis?.summary || 'Membutuhkan kehadiran digital'
      },
      recommended_approach: parsed.recommended_approach || 'Tawarkan demo website gratis'
    }
  } catch (error: any) {
    // Fallback scoring if AI fails
    console.error('Groq scoring error:', error.message)
    const hasWeb = !!business.website
    return {
      ai_score: hasWeb ? 45 : 85,
      digital_gap_score: hasWeb ? 40 : 90,
      digital_gap_analysis: {
        has_website: hasWeb,
        has_booking: false,
        social_active: (business.reviews || 0) > 50,
        needs: hasWeb ? ['modern website', 'booking system'] : ['website', 'booking system', 'online presence'],
        summary: hasWeb ? 'Memiliki website tapi belum optimal' : 'Belum punya website sama sekali'
      },
      recommended_approach: hasWeb
        ? 'Tawarkan upgrade website ke versi modern + booking online'
        : 'Tawarkan pembuatan website profesional + booking system GRATIS demo'
    }
  }
}

// ============================================================
// SCOUT WORKFLOW - Full Pipeline
// ============================================================
export async function scoutWorkflow(
  area: string,
  category: string,
  limit: number,
  serpApiKey: string,
  groqApiKey: string
): Promise<ScoredLead[]> {
  updateStatus({
    state: 'hunting',
    current_step: 'Initializing Scout Agent...',
    progress: 0,
    total: 0,
    results_count: 0,
    last_error: null
  })

  try {
    // Step 1: Search businesses
    const businesses = await searchBusinesses(area, category, limit, serpApiKey)

    if (businesses.length === 0) {
      updateStatus({
        state: 'complete',
        current_step: `No businesses found for "${category}" in "${area}"`,
        results_count: 0,
        last_run: new Date().toISOString()
      })
      lastHuntResults = []
      return []
    }

    // Step 2: Score each business with AI (sequential to respect rate limits)
    updateStatus({
      state: 'scoring',
      current_step: `Scoring ${businesses.length} leads with AI...`,
      progress: 0,
      total: businesses.length
    })

    const scoredLeads: ScoredLead[] = []

    for (let i = 0; i < businesses.length; i++) {
      const biz = businesses[i]
      updateStatus({
        current_step: `AI scoring: ${biz.title} (${i + 1}/${businesses.length})`,
        progress: i + 1
      })

      const scoring = await scoreLeadWithAI(biz, category, groqApiKey)

      const lead: ScoredLead = {
        id: `scout-${Date.now()}-${i}`,
        business_name: biz.title,
        category: category,
        address: biz.address,
        phone: biz.phone || '+62-unknown',
        owner_name: 'Pemilik',
        rating: biz.rating || 0,
        review_count: biz.reviews || 0,
        website_url: biz.website || null,
        google_maps_url: biz.google_maps_url || '',
        thumbnail: biz.thumbnail || null,
        ai_score: scoring.ai_score,
        digital_gap_score: scoring.digital_gap_score,
        digital_gap_analysis: scoring.digital_gap_analysis,
        recommended_approach: scoring.recommended_approach,
        status: 'new',
        source: 'scout_agent',
        created_at: new Date().toISOString()
      }

      scoredLeads.push(lead)

      // Small delay between AI calls to avoid rate limiting
      if (i < businesses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }

    // Sort by AI score descending
    scoredLeads.sort((a, b) => b.ai_score - a.ai_score)

    // Update status
    updateStatus({
      state: 'complete',
      current_step: `HUNT COMPLETE! Found ${scoredLeads.length} leads. Top score: ${scoredLeads[0]?.ai_score || 0}`,
      progress: scoredLeads.length,
      total: scoredLeads.length,
      results_count: scoredLeads.length,
      last_run: new Date().toISOString()
    })

    lastHuntResults = scoredLeads
    return scoredLeads
  } catch (error: any) {
    updateStatus({
      state: 'error',
      current_step: `Hunt failed: ${error.message}`,
      last_error: error.message
    })
    throw error
  }
}
