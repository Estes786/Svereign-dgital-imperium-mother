// ============================================================
// SOVEREIGN SHARED TYPES - Unified Type System
// All apps share these interfaces for data consistency
// ============================================================

// === LEAD (The Prey) ===
export interface Lead {
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
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'rejected' | 'follow_up'
  source: 'scout' | 'manual' | 'referral' | 'dummy'
  created_at: string
}

// === MESSAGE (The Strike) ===
export interface Message {
  id: string
  lead_id: string
  message_text: string
  message_type: 'initial' | 'follow_up' | 'closing' | 'nurture'
  wa_deeplink: string
  sent_at: string
  response_status: 'draft' | 'sent' | 'replied' | 'no_response'
  created_at: string
}

// === TRANSACTION (The Harvest) ===
export interface Transaction {
  id: string
  lead_id: string
  amount_idr: number
  amount_usd: number
  description: string
  payment_method: 'transfer' | 'qris' | 'cod' | 'crypto'
  payment_status: 'pending' | 'paid' | 'refunded'
  invoice_number: string
  paid_at: string | null
  created_at: string
}

// === DEMO SITE (The Bait) ===
export interface DemoSite {
  id: string
  lead_id: string
  business_name: string
  template_type: string
  deploy_url: string
  status: 'building' | 'deployed' | 'active' | 'expired'
  views_count: number
  created_at: string
}

// === AGENT LOG ===
export interface AgentLog {
  id: string
  agent_type: 'scout' | 'profiler' | 'ghostwriter' | 'architect' | 'harvester' | 'orchestrator'
  action: string
  status: 'success' | 'error' | 'running'
  execution_time_ms: number
  details?: string
  created_at: string
}

// === AGENT (Store Product) ===
export interface AgentProduct {
  id: string
  name: string
  slug: string
  category: string
  tagline: string
  description: string
  icon: string
  color: string
  price: {
    monthly: number
    yearly: number
    currency: string
  }
  features: string[]
  status: 'live' | 'coming_soon' | 'beta'
  rating: number
  users: number
  demo_url: string | null
}

// === TREASURY STATS ===
export interface TreasuryStats {
  total_revenue_idr: number
  total_revenue_usd: number
  target_idr: number
  target_usd: number
  progress_percent: number
  profit_split: {
    operational: number
    growth: number
    liquidity: number
    staking: number
    owner: number
  }
  daily_revenue: Array<{ date: string; amount: number }>
}

// === API RESPONSES ===
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
}

// === ECOSYSTEM STATUS ===
export interface EcosystemStatus {
  web2_predator: {
    status: 'online' | 'offline' | 'degraded'
    url: string
    version: string
    agents: Record<string, string>
  }
  web25_store: {
    status: 'online' | 'offline' | 'degraded'
    url: string
    version: string
    total_agents: number
    live_agents: number
  }
  web3_economy: {
    status: 'online' | 'offline' | 'degraded'
    url: string
    version: string
    hypha_active: boolean
  }
  mother_folder: {
    status: 'online' | 'offline'
    last_sync: string
    total_docs: number
  }
}
